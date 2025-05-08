package config

import (
	"database/sql"
	_ "github.com/lib/pq"
)

func NewDatabase(dbURL string) *sql.DB {
	db, err := sql.Open("postgres", dbURL)

	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	if err = db.Ping(); err != nil {
		panic("Failed to ping database: " + err.Error())
	}

	return db
}
