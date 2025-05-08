package middleware

import (
	"doppelganger/config"
	"doppelganger/internal/domain"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"reflect"
)

type APIHandler func(w http.ResponseWriter, r any) error

func HandleRoute(h APIHandler, req domain.Request) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := config.AppContainer.Logger.With().Str("method", r.Method).Str("path", r.RequestURI).Logger()

		hydratedRequest, err := hydrateRequest(r, req)

		if err != nil {
			l.Err(err).Msg("error hydrating request")
			http.Error(w, "invalid request", http.StatusUnprocessableEntity)

			return
		}

		if err = h(w, hydratedRequest); err != nil {
			l.Error().Err(err).Msg("api handler error")
			err = domain.JSONErrorResponse(w, err)

			if err != nil {
				l.Err(err).Msg("error when trying to build JSONErrorResponse")
				http.Error(w, "internal server error", http.StatusInternalServerError)
			}
		}
	}
}

func hydrateRequest(r *http.Request, req any) (any, error) {
	if req == nil {
		return nil, nil
	}

	var targetRequest any = nil
	var err error = nil

	targetRequest = reflect.New(reflect.TypeOf(req)).Interface()

	if r.ContentLength > 0 {
		if err = json.NewDecoder(r.Body).Decode(&targetRequest); err != nil {
			return nil, errors.Join(errors.New("failed to parse request body"), err)
		}
	}

	if vars := mux.Vars(r); len(vars) > 0 {
		val := reflect.ValueOf(targetRequest).Elem()
		typ := val.Type()

		for i := 0; i < val.NumField(); i++ {
			field := val.Field(i)
			structField := typ.Field(i)

			if uriTag := structField.Tag.Get("uri"); uriTag != "" {
				if paramValue, exists := vars[uriTag]; exists && field.CanSet() {
					switch field.Kind() {
					case reflect.String:
						field.SetString(paramValue)
					default:
						return nil, fmt.Errorf("invalid uri tag type: %s", uriTag)
					}
				}
			}
		}
	}

	return targetRequest, nil
}
