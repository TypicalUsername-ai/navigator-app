package main

import (
	"context"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"golang.org/x/exp/slices"
	"net/http"
)

func transportRouter() chi.Router {
	r := chi.NewRouter()
	r.Use(CitiesCtx)

	r.With(CitiesCtx).Get("/stops", GetCityStops)
	r.With(CitiesCtx).Get("/route", GetCityRoute)
	//r.With(CitiesCtx).Get("/fares", GetCityFares)

	return r

}

func trainRouter() chi.Router {
	r := chi.NewRouter()

	r.Get("/stops", GetRailwayStops)
	r.Get("/route", GetTrainRoute)

	return r

}

func parkingRouter() chi.Router {
	r := chi.NewRouter()
	r.Use(CitiesCtx)

	r.With(CitiesCtx).Get("/all", GetCityParking)

	return r

}

var CityNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Requested city not found."}

func CitiesCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if slices.Contains(SupportedCities(), chi.URLParam(r, "cityName")) {
			ctx := context.WithValue(r.Context(), "city", chi.URLParam(r, "cityName"))
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			render.Render(w, r, CityNotFound)
			return
		}
	})
}
