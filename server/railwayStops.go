package main

import (
	"encoding/json"
	"github.com/go-chi/render"
	"io"
	"net/http"
	"net/url"
	"sync"
	"time"
)

// Cache with 1 hour TTL
var (
	railwayCache    []RailwayStop
	railwayCacheMu  sync.RWMutex
	railwayCachedAt time.Time
	railwayCacheTTL = 1 * time.Hour
)

type RailwayStopsResponse struct {
	Stops []RailwayStop `json:"stops"`
}

type RailwayStop struct {
	OsmID int
	Lat   float64
	Lon   float64
	Name  string
}

func (rd *RailwayStopsResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func GetRailwayStops(w http.ResponseWriter, r *http.Request) {

	var trainStops []OSMTransportStop
	//currentCity := r.Context().Value("city").(string)
	if len(trainStopsCache.stops) != 0 {
		trainStops = trainStopsCache.stops
	} else {
		trainStops, err := GetAllRailwayStops()
		if err != nil {
			panic(err)
		}
		trainStopsCache.SetStops(trainStops)
	}

	stops := RailwayStopsResponse{Stops: FormatStations(trainStops)}

	render.Render(w, r, &stops)
}

func FormatStations(stations []OSMTransportStop) []RailwayStop {
	stops := make([]RailwayStop, len(stations))
	for id, stop := range stations {
		newStop := RailwayStop{OsmID: stop.ID, Lat: stop.Lat, Lon: stop.Lon, Name: stop.Tags.Name}
		stops[id] = newStop
	}
	return stops

}

type RailwayStopsQuery struct {
	*OsmResponseHeaders
	Elements []struct {
		Type string  `json:"type"`
		ID   int     `json:"id"`
		Lat  float64 `json:"lat"`
		Lon  float64 `json:"lon"`
		Tags struct {
			HistoricRailway string `json:"historic:railway"`
			Name            string `json:"name"`
			Network         string `json:"network"`
			Operator        string `json:"operator"`
			OperatorShort   string `json:"operator:short"`
			PublicTransport string `json:"public_transport"`
			Railway         string `json:"railway"`
			RailwayRef      string `json:"railway:ref"`
			Train           string `json:"train"`
			Wikidata        string `json:"wikidata"`
			Wikipedia       string `json:"wikipedia"`
		} `json:"tags"`
	} `json:"elements"`
}

func GetAllRailwayStops() ([]OSMTransportStop, error) {
	var query = `[out:json][timeout:25];area["name"="Polska"]->.searchArea;nwr["public_transport"="stop_position"]["railway"="stop"](area.searchArea);out geom;`

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	stopsData := CityStopsQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		return nil, err
	}

	return stopsData.Elements, nil
}
