package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
	"unicode"
)

func TrimStopSuffix(name string) string {
	return strings.TrimRightFunc(name, func(r rune) bool { return unicode.IsNumber(r) || unicode.IsSpace(r) })
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

func GetNamedStops(city string, name string) (*[]OSMTransportStop, error) {
	var point_query = fmt.Sprintf(`
	[out:json];
	area[name="%v"]->.searchArea;
	node["public_transport"="stop_position"]["name"="%v"](area.searchArea) -> .startPoint;
	(
	  .startPoint;
	);
	out geom;`, city, name)

	response, err := http.Get(overpass_api_url + url.QueryEscape(point_query))
	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, errors.New(response.Status)
	}
	defer response.Body.Close()

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	stopsData := CityStopsQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		log.Fatal(string(bodyBytes))
		return nil, err
	}

	return &stopsData.Elements, nil
}

func GetAllReachableStops(source OSMTransportStop) (*[]OSMTransportStop, error) {
	var query = fmt.Sprintf(`[out:json];
			node(%v) -> .startPoint;
			rel(bn.startPoint);
			node(r)[public_transport=stop_position];
			out;`, source.ID)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))

	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("non-200 response [%v]", response.StatusCode)
	}

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	stopsData := CityStopsQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		log.Fatal(string(bodyBytes))
		return nil, err
	}

	return &stopsData.Elements, nil
}

func GetAllCityStops(city string) ([]OSMTransportStop, error) {
	var query = fmt.Sprintf(`[out:json][timeout:25];area["name"="%v"]->.searchArea;(node["public_transport"="stop_position"]["bus"="yes"](area.searchArea);node["public_transport"="stop_position"]["tram"="yes"](area.searchArea););out geom;`, city)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("non-200 response [%v]", response.StatusCode)
	}
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

type CityStopsCacheEntry struct {
	updateTime time.Time
	stops      []OSMTransportStop
	byTitle    map[string][]*OSMTransportStop
	byId       map[int]*OSMTransportStop
}

type CityStopsCache struct {
	ttl   time.Duration
	lock  sync.RWMutex
	stops map[string]*CityStopsCacheEntry
}

func (c *CityStopsCache) GetStops(city string) *CityStopsCacheEntry {
	c.lock.RLock()
	cityPtr := c.stops[city]
	c.lock.RUnlock()
	if cityPtr == nil {
		return nil
	}
	if time.Since(cityPtr.updateTime) > c.ttl {
		return nil
	} else {
		return cityPtr
	}
}

func (c *CityStopsCache) SetStops(city string, stops []OSMTransportStop) bool {
	old := c.stops[city]
	c.lock.Lock()
	titleMap := make(map[string][]*OSMTransportStop)
	idMap := make(map[int]*OSMTransportStop)
	for _, entry := range stops {
		stopName := TrimStopSuffix(entry.Tags.Name)
		titleMap[stopName] = append(titleMap[stopName], &entry)
		idMap[entry.ID] = &entry
	}
	c.stops[city] = &CityStopsCacheEntry{updateTime: time.Now(), stops: stops, byTitle: titleMap, byId: idMap}
	fmt.Printf("cache set for [%v] %p => %p", city, old, c.stops[city])
	c.lock.Unlock()
	return old != nil
}

type TrainStopsCache struct {
	ttl        time.Duration
	lock       sync.RWMutex
	updateTime time.Time
	stops      []OSMTransportStop
	byTitle    map[string][]*OSMTransportStop
	byId       map[int]*OSMTransportStop
}

func (c *TrainStopsCache) SetStops(stops []OSMTransportStop) bool {
	old := c.stops
	c.lock.Lock()
	titleMap := make(map[string][]*OSMTransportStop)
	idMap := make(map[int]*OSMTransportStop)
	for _, entry := range stops {
		titleMap[entry.Tags.Name] = append(titleMap[entry.Tags.Name], &entry)
		idMap[entry.ID] = &entry
	}
	c.updateTime = time.Now()
	c.stops = stops
	c.byTitle = titleMap
	c.byId = idMap
	fmt.Printf("cache set for [trains] %p => %p", old, c.stops)
	c.lock.Unlock()
	return old != nil
}
