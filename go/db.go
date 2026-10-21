package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connects to the PostgreSQL of the DB_ settings, with a pool of DB_POOL_SIZE connections
func connectDB() (*pgxpool.Pool, error) {
	return pgxpool.New(context.Background(), fmt.Sprintf("host='%s' port='%s' user='%s' password='%s' dbname='%s' pool_max_conns='%s'",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_DATABASE"), os.Getenv("DB_POOL_SIZE")))
}
