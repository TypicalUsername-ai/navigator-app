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

	return r

}

func trainRouter() chi.Router {
	r := chi.NewRouter()

	r.Get("/stops", GetRailwayStops)

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
		var city string
		var err error

		cityList := SupportedCities()

		if cityParam := chi.URLParam(r, "cityName"); slices.Contains(cityList, cityParam) {
			city = cityParam
		} else {
			render.Render(w, r, CityNotFound)
			return
		}
		if err != nil {
			render.Render(w, r, CityNotFound)
			return
		}

		ctx := context.WithValue(r.Context(), "city", city)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
