package main

import (
	"doppelganger/config"
	"doppelganger/internal/bootstrap"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	container := config.AppContainer

	//defer container.DB.Close()

	app := bootstrap.New(container)

	go app.HTTPSrv.MusRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	systemCall := <-stop

	container.Logger.Info().Str("signal", systemCall.String()).Msg("stopping application")

	app.HTTPSrv.Stop()

	container.Logger.Info().Msg("application stopped")
}
