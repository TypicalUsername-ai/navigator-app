package main

import (
	"net/http"

	"encoding/json"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"net/url"
	"time"
)

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
