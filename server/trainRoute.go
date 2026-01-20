package main

import (
	"container/heap"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"log"
	"net/http"
	"net/url"
)

func GetTrainRoute(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query["from"] == nil || query["to"] == nil {
		render.Render(w, r, &ErrResponse{HTTPStatusCode: 401, StatusText: "Missing required parameters (from, to)"})
	} else {
		routes, err := FindTrainRoute(query["from"][0], query["to"][0])
		if err != nil {
			render.Render(w, r, err)
		} else {
			render.Render(w, r, routes)
		}
	}

}

func GetNamedStations(name string) (*[]OSMTransportStop, error) {
	var point_query = fmt.Sprintf(`
	[out:json];
	area[name="Polska"]->.searchArea;
	node["public_transport"="stop_position"]["railway"="stop"][name="%v"](area.searchArea);
	out geom;`, name)

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

func GetAllReachableStations(source OSMTransportStop) (*[]OSMTransportStop, error) {
	var query = fmt.Sprintf(`[out:json];
			node(%v) -> .startPoint;
			rel(bn.startPoint);
			node(r)[public_transport=stop_position];
			out;`, source.ID)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))

	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, fmt.Errorf("non-200 response [%v]", response.StatusCode)
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

func FindTrainRoute(from string, to string) (*RouteResponse, *ErrResponse) {

	var titleCache *map[string][]*OSMTransportStop
	var idCache *map[int]*OSMTransportStop

	if len(trainStopsCache.stops) != 0 {
		titleCache = &trainStopsCache.byTitle
		idCache = &trainStopsCache.byId

	} else {
		trainStops, err := GetAllRailwayStops()
		if err != nil {
			return nil, &ErrResponse{HTTPStatusCode: 500, StatusText: err.Error()}
		}
		trainStopsCache.SetStops(trainStops)
		titleCache = &trainStopsCache.byTitle
		idCache = &trainStopsCache.byId
	}

	startPoints := (*titleCache)[TrimStopSuffix(from)]
	endPoints := (*titleCache)[TrimStopSuffix(to)]

	fmt.Println(startPoints)
	fmt.Println(endPoints)

	center_end := Center(endPoints)

	queue := make(TransportSearchQueue, len(startPoints))

	for i, start := range startPoints {

		base_dist := Haversine(start.Latitude(), start.Longtitude(), center_end[0], center_end[1])

		tripstack := []OSMTransportStop{*start}

		queue[i] = &TransportSearchItem{CurrentTrip: tripstack, Distances: []float64{base_dist}, index: i}

	}
	heap.Init(&queue)

	var foundRoute TransportSearchItem

	for queue.Len() > 0 {

		item := heap.Pop(&queue).(*TransportSearchItem)

		//fmt.Println(len(queue), item.Distances[len(item.Distances)-1], item.CurrentTrip[len(item.CurrentTrip)-1].Tags.Name)
		route, err := SearchTrainRoute(*item, endPoints, &queue)

		if err != nil {
			panic(err)
		}
		if route != nil {
			foundRoute = *route
			break
		}
	}
	lineData := make([][]LineConnection, len(foundRoute.CurrentTrip)-1)

	for ind := range len(foundRoute.CurrentTrip) - 1 {
		startName := foundRoute.CurrentTrip[ind].Tags.Name
		endName := foundRoute.CurrentTrip[ind+1].Tags.Name
		data, err := GetConnections(startName, endName, *idCache)
		if err != nil {
			panic(err)
		}
		lineData[ind] = data
	}
	return &RouteResponse{Connections: lineData}, nil
}
