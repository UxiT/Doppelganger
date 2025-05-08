package config

import (
	"doppelganger/internal/routes"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"os"
)

type Container struct {
	Config *Config
	Logger *zerolog.Logger
	Router *mux.Router
	//DB     *sql.DB
}

var AppContainer *Container

func init() {
	cfg := newConfig()
	AppContainer = NewContainer(*cfg)
}

func NewContainer(cfg Config) *Container {
	logger := configureLogger(cfg.LogLevel)

	//db := NewDatabase(cfg.DbUrl)

	router := routes.NewRouter()

	return &Container{
		Config: &cfg,
		Logger: logger,
		Router: router,
		//DB:     db,
	}
}

func configureLogger(level zerolog.Level) *zerolog.Logger {
	var log zerolog.Logger

	logWriter := zerolog.MultiLevelWriter(os.Stdout)
	zerolog.SetGlobalLevel(level)

	log = zerolog.New(logWriter).With().Caller().Logger()

	return &log
}
