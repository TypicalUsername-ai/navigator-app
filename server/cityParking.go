package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"sync"
	"time"
)

// Cache with 1 hour TTL
var (
	parkingCache    = make(map[string]parkingCacheEntry)
	parkingCacheMu  sync.RWMutex
	parkingCacheTTL = 1 * time.Hour
)

type parkingCacheEntry struct {
	spots     []ParkingSpot
	fetchedAt time.Time
}

type CityParkingResponse struct {
	Stops []ParkingSpot `json:"stops"`
}

type ParkingSpot struct {
	OsmID    int
	Lat      float64
	Lon      float64
	Capacity int
	Fee      string
}

func (rd *CityParkingResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func GetCityParking(w http.ResponseWriter, r *http.Request) {

	currentCity := r.Context().Value("city").(string)

	citySpots := CityParkingSpots(currentCity)

	spots := CityParkingResponse{Stops: citySpots}

	render.Render(w, r, &spots)
}

type CityParkingQuery struct {
	*OsmResponseHeaders
	Elements []struct {
		Type string  `json:"type"`
		ID   int     `json:"id"`
		Lat  float64 `json:"lat,omitempty"`
		Lon  float64 `json:"lon,omitempty"`
		Tags struct {
			Access           string `json:"access"`
			Amenity          string `json:"amenity"`
			Capacity         string `json:"capacity"`
			CapacityDisabled string `json:"capacity:disabled"`
			Fee              string `json:"fee"`
			Lit              string `json:"lit"`
			OpeningHours     string `json:"opening_hours"`
			Parking          string `json:"parking"`
			Smoothness       string `json:"smoothness"`
			Supervised       string `json:"supervised"`
			Surface          string `json:"surface"`
		} `json:"tags"`
		Bounds struct {
			Minlat float64 `json:"minlat"`
			Minlon float64 `json:"minlon"`
			Maxlat float64 `json:"maxlat"`
			Maxlon float64 `json:"maxlon"`
		} `json:"bounds,omitempty"`
		Nodes    []interface{} `json:"nodes,omitempty"`
		Geometry []struct {
			Lat float64 `json:"lat"`
			Lon float64 `json:"lon"`
		} `json:"geometry,omitempty"`
		Members []struct {
			Type     string `json:"type"`
			Ref      int    `json:"ref"`
			Role     string `json:"role"`
			Geometry []struct {
				Lat float64 `json:"lat"`
				Lon float64 `json:"lon"`
			} `json:"geometry"`
		} `json:"members,omitempty"`
	} `json:"elements"`
}

func CityParkingSpots(city string) []ParkingSpot {
	// Check cache first
	parkingCacheMu.RLock()
	if entry, ok := parkingCache[city]; ok && time.Since(entry.fetchedAt) < parkingCacheTTL {
		parkingCacheMu.RUnlock()
		fmt.Printf("[GetCityParking] cache hit for %s\n", city)
		return entry.spots
	}
	parkingCacheMu.RUnlock()

	var query = fmt.Sprintf(`[out:json][timeout:25];area["name"="%v"]->.searchArea;nwr["amenity"="parking"]["access"!~"(private|customers)"]["capacity"~"[0-9]+"](area.searchArea);out geom;`, city)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		fmt.Printf("[GetCityParking] error: %v\n", err)
		return []ParkingSpot{}
	}
	defer response.Body.Close()

	fmt.Printf("[GetCityParking] => %v\n", response.Status)

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	spotsData := CityParkingQuery{}

	err = json.Unmarshal(bodyBytes, &spotsData)
	if err != nil {
		panic(err)
	}

	spots := []ParkingSpot{}

	for _, spot := range spotsData.Elements {

		var newSpot ParkingSpot

		capacity, err := strconv.Atoi(spot.Tags.Capacity)

		if err != nil {
			fmt.Println(err)
			capacity = 0
		}

		if spot.Geometry != nil {

			lats := 0.0
			lons := 0.0

			for _, data := range spot.Geometry {
				lats += data.Lat
				lons += data.Lon
			}

			lat := lats / float64(len(spot.Geometry))
			lon := lons / float64(len(spot.Geometry))
			newSpot = ParkingSpot{OsmID: spot.ID, Lat: lat, Lon: lon, Capacity: capacity, Fee: spot.Tags.Fee}

		} else {
			newSpot = ParkingSpot{OsmID: spot.ID, Lat: spot.Lat, Lon: spot.Lon, Capacity: capacity, Fee: spot.Tags.Fee}
		}

		spots = append(spots, newSpot)
	}

	// Store in cache
	parkingCacheMu.Lock()
	parkingCache[city] = parkingCacheEntry{spots: spots, fetchedAt: time.Now()}
	parkingCacheMu.Unlock()

	return spots
}
