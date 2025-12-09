package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"golang.org/x/exp/slices"
	"io"
	"net/http"
	"net/url"
	"time"
)

func transportRouter() chi.Router {
	r := chi.NewRouter()
	r.Use(CitiesCtx)

	r.With(CitiesCtx).Get("/stops", GetCityStops)

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

type CityStopsResponse struct {
	Stops []TransportStop `json:"stops"`
}

type TransportStop struct {
	OsmID int
	Lat   float64
	Lon   float64
	Tram  bool
	Bus   bool
	Name  string
}

func (rd *CityStopsResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func GetCityStops(w http.ResponseWriter, r *http.Request) {

	currentCity := r.Context().Value("city").(string)

	cityStops := GetStops(currentCity)

	stops := CityStopsResponse{Stops: cityStops}

	render.Render(w, r, &stops)
}

type CityStopsQuery struct {
	Version   float64 `json:"version"`
	Generator string  `json:"generator"`
	Osm3S     struct {
		TimestampOsmBase   time.Time `json:"timestamp_osm_base"`
		TimestampAreasBase time.Time `json:"timestamp_areas_base"`
		Copyright          string    `json:"copyright"`
	} `json:"osm3s"`
	Elements []struct {
		Type string  `json:"type"`
		ID   int     `json:"id"`
		Lat  float64 `json:"lat"`
		Lon  float64 `json:"lon"`
		Tags struct {
			Bench           string `json:"bench"`
			Bin             string `json:"bin"`
			DeparturesBoard string `json:"departures_board"`
			Lit             string `json:"lit"`
			Name            string `json:"name"`
			Network         string `json:"network"`
			Operator        string `json:"operator"`
			PublicTransport string `json:"public_transport"`
			Ref             string `json:"ref"`
			Shelter         string `json:"shelter"`
			TactilePaving   string `json:"tactile_paving"`
			Tram            string `json:"tram"`
			Bus             string `json:"bus"`
		} `json:"tags"`
	} `json:"elements"`
}

func GetStops(city string) []TransportStop {

	var query = fmt.Sprintf(`[out:json][timeout:25];area["name"="%v"]->.searchArea;(node["public_transport"="platform"]["bus"="yes"](area.searchArea);node["public_transport"="platform"]["tram"="yes"](area.searchArea););out geom;`, city)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	defer response.Body.Close()
	if err != nil {
		panic(err)
	}

	fmt.Printf("[GetStops] => %v\n", response.Status)

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	stopsData := CityStopsQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		panic(err)
	}

	stops := []TransportStop{}

	for _, stop := range stopsData.Elements {

		newStop := TransportStop{OsmID: stop.ID, Lat: stop.Lat, Lon: stop.Lon, Tram: stop.Tags.Tram == "yes", Bus: stop.Tags.Bus == "yes", Name: stop.Tags.Name}

		stops = append(stops, newStop)

	}

	return stops

}
