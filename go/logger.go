package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"time"
)

// Opens logs/info.log for appending (created if it isn't there)
func openLog() (*os.File, error) {
	if err := os.MkdirAll("logs", 0755); err != nil {
		return nil, err
	}
	return os.OpenFile("logs/info.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
}

// Log every request after its handler:
// 2026-10-17 14:53:43 -- 10.0.1.7 -- GET /eXlBiSl 302 Found -- response-time: 0.27 ms
func logRequests(file *os.File, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r)

		ip, _, _ := net.SplitHostPort(r.RemoteAddr)
		fmt.Fprintf(file, "%s -- %s -- %s %s %d %s -- response-time: %.2f ms\n",
			time.Now().UTC().Format(time.DateTime), ip, r.Method, r.URL.RequestURI(),
			recorder.status, http.StatusText(recorder.status), float64(time.Since(start).Microseconds())/1000)
	})
}

// Keeps the status the handler sends, for the log
type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}
