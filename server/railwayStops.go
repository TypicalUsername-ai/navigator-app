package main

import (
	"net/http"
	"sync"

	"encoding/json"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"net/url"
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

	//currentCity := r.Context().Value("city").(string)

	railwayStops := AllRailwayStops()

	stops := RailwayStopsResponse{Stops: railwayStops}

	render.Render(w, r, &stops)
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

func AllRailwayStops() []RailwayStop {
	// Check cache first
	railwayCacheMu.RLock()
	if len(railwayCache) > 0 && time.Since(railwayCachedAt) < railwayCacheTTL {
		stops := railwayCache
		railwayCacheMu.RUnlock()
		fmt.Printf("[AllRailwayStops] cache hit\n")
		return stops
	}
	railwayCacheMu.RUnlock()

	var query = fmt.Sprintf(`[out:json][timeout:25];area["name"="Polska"]->.searchArea;nwr["public_transport"="station"]["railway"="station"]["wikipedia"](area.searchArea);out geom;`)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		fmt.Printf("[AllRailwayStops] error: %v\n", err)
		return []RailwayStop{}
	}
	defer response.Body.Close()

	fmt.Printf("[AllRailwayStops] => %v\n", response.Status)

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	stopsData := RailwayStopsQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		panic(err)
	}

	stops := []RailwayStop{}

	for _, stop := range stopsData.Elements {
		newStop := RailwayStop{OsmID: stop.ID, Lat: stop.Lat, Lon: stop.Lon, Name: stop.Tags.Name}
		stops = append(stops, newStop)
	}

	// Store in cache
	railwayCacheMu.Lock()
	railwayCache = stops
	railwayCachedAt = time.Now()
	railwayCacheMu.Unlock()

	return stops
}
