package bootstrap

import (
	"doppelganger/config"
	"doppelganger/internal/bootstrap/http"
)

type App struct {
	HTTPSrv *http.App
}

func New(
	container *config.Container,
) *App {
	httpSrv := http.New(
		container.Logger,
		container.Router,
		container.Config.ServerAddress,
		container.Config.Cors,
	)

	return &App{
		HTTPSrv: httpSrv,
	}
}
