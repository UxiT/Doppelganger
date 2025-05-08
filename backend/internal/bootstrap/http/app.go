package http

import (
	"context"
	"errors"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/rs/zerolog"
	"net/http"
)

type App struct {
	logger     *zerolog.Logger
	httpServer *http.Server
}

func New(
	logger *zerolog.Logger,
	router *mux.Router,
	address string,
	cors *cors.Cors,
) *App {
	return &App{
		logger: logger,
		httpServer: &http.Server{
			Addr:    address,
			Handler: cors.Handler(router),
		},
	}
}

func (a *App) MusRun() {
	if err := a.Run(); err != nil {
		panic(err)
	}
}

func (a *App) Run() error {
	a.logger.Info().Str("address", a.httpServer.Addr).Msg("starting http server")

	if err := a.httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}

	return nil
}

func (a *App) Stop() {
	a.logger.Info().Msg("stopping http server")

	if err := a.httpServer.Shutdown(context.Background()); err != nil {
		panic(err)
	}
}
