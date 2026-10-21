// The Go version: the same as node/app.js. One process, which uses every core on its own.
package main

import (
	"encoding/json"
	"errors"
	"log"
	"math/rand/v2"
	"net"
	"net/http"
	"net/netip"
	"os"
	"strings"

	"github.com/jackc/pgx/v5"
)

// A random 7-character code
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
func generateCode() string {
	code := make([]byte, 7)
	for i := range code {
		code[i] = alphabet[rand.IntN(len(alphabet))]
	}
	return string(code)
}

func main() {
	pool, err := connectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	logFile, err := openLog()
	if err != nil {
		log.Fatal(err)
	}
	defer logFile.Close()

	mux := http.NewServeMux()

	mux.HandleFunc("POST /url", func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			URL string `json:"url"`
		}
		err := json.NewDecoder(r.Body).Decode(&body)
		realUrl := strings.TrimSpace(body.URL)

		if err != nil || realUrl == "" {
			http.Error(w, "url is required", http.StatusBadRequest)
			return
		}

		code := generateCode()
		if _, err := pool.Exec(r.Context(), "INSERT INTO urls (code, url) VALUES ($1, $2)", code, realUrl); err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"code": code})
	})

	mux.HandleFunc("GET /{code}", func(w http.ResponseWriter, r *http.Request) {
		code := r.PathValue("code")

		var id int
		var url string
		err := pool.QueryRow(r.Context(), "SELECT id, url FROM urls WHERE code = $1", code).Scan(&id, &url)
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		_, err = pool.Exec(r.Context(), "INSERT INTO views (url_id, ip_address, user_agent, referrer) VALUES ($1, $2, $3, $4)",
			id, clientIP(r), r.UserAgent(), r.Referer())
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		http.Redirect(w, r, url, http.StatusFound)
	})

	log.Println("Listening on " + os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), logRequests(logFile, mux)))
}

// The visitor's address without the port, or nil if it can't be read
func clientIP(r *http.Request) *netip.Addr {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return nil
	}
	ip, err := netip.ParseAddr(host)
	if err != nil {
		return nil
	}
	return &ip
}
