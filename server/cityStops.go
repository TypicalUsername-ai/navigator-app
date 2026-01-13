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
	stopsCache    = make(map[string]stopsCacheEntry)
	stopsCacheMu  sync.RWMutex
	stopsCacheTTL = 1 * time.Hour
)

type stopsCacheEntry struct {
	stops     []TransportStop
	fetchedAt time.Time
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

type OSMTransportStop struct {
	Type string  `json:"type"`
	ID   int     `json:"id"`
	Lat  float64 `json:"lat"`
	Lon  float64 `json:"lon"`
	Tags struct {
		Name            string `json:"name"`
		PublicTransport string `json:"public_transport"`
		Ref             string `json:"ref"`
		Tram            string `json:"tram"`
		Bus             string `json:"bus"`
	} `json:"tags"`
}

func (s OSMTransportStop) OsmID() int          { return s.ID }
func (s OSMTransportStop) Latitude() float64   { return s.Lat }
func (s OSMTransportStop) Longtitude() float64 { return s.Lon }

type CityStopsQuery struct {
	*OsmResponseHeaders
	Elements []OSMTransportStop `json:"elements"`
}

func GetStops(city string) []TransportStop {
	// Check cache first
	stopsCacheMu.RLock()
	if entry, ok := stopsCache[city]; ok && time.Since(entry.fetchedAt) < stopsCacheTTL {
		stopsCacheMu.RUnlock()
		fmt.Printf("[GetStops] cache hit for %s\n", city)
		return entry.stops
	}
	stopsCacheMu.RUnlock()

	var query = fmt.Sprintf(`[out:json][timeout:25];area["name"="%v"]->.searchArea;(node["public_transport"="stop_position"]["bus"="yes"](area.searchArea);node["public_transport"="stop_position"]["tram"="yes"](area.searchArea););out geom;`, city)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		fmt.Printf("[GetStops] error: %v\n", err)
		return []TransportStop{}
	}
	defer response.Body.Close()

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

	// Store in cache
	stopsCacheMu.Lock()
	stopsCache[city] = stopsCacheEntry{stops: stops, fetchedAt: time.Now()}
	stopsCacheMu.Unlock()

	return stops
}
