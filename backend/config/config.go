package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/rs/zerolog"
	"os"
)

const (
	envLocal      = "local"
	envDevelop    = "develop"
	envProduction = "production"
)

type Config struct {
	Env      string
	LogLevel zerolog.Level

	ServerAddress string
	DbUrl         string

	Cors *cors.Cors
}

func newConfig() *Config {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	appEnv := getEnv("APP_ENV")

	return &Config{
		Env:      appEnv,
		LogLevel: getLogLevel(appEnv),

		ServerAddress: getEnv("SERVER_ADDRESS"),
		DbUrl:         getEnv("DB_URL"),
		Cors:          getCorsConfig(),
	}
}

func getEnv(key string) string {
	value := os.Getenv(key)

	if value == "" {
		panic(fmt.Sprintf("key %s has no value", key))
	}

	return value
}

func getLogLevel(env string) zerolog.Level {
	switch env {
	case envLocal:
		return zerolog.TraceLevel
	case envDevelop:
		return zerolog.DebugLevel
	case envProduction:
		return zerolog.InfoLevel
	default:
		panic("unknown environment: " + env)
	}
}

func getCorsConfig() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
		Debug:            false,
	})
}
