package main

import (
	"container/heap"
	//"errors"
	"fmt"
	"github.com/go-chi/render"
	"net/http"
	//"slices"
)

func GetCityRoute(w http.ResponseWriter, r *http.Request) {

	currentCity := r.Context().Value("city").(string)

	query := r.URL.Query()
	from := query["from"]
	to := query["to"]

	if from == nil || to == nil {
		render.Render(w, r, &ErrResponse{HTTPStatusCode: 401, StatusText: "Missing required parameters (from, to)"})
	} else {
		route, err := FindCityRoute(currentCity, from[0], to[0])
		if err != nil {
			render.Render(w, r, err)
		} else {
			render.Render(w, r, route)
		}
	}
}

type CityRouteResponse struct {
	Connections [][]LineConnection
}

func (cr *CityRouteResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func FindCityRoute(city string, from string, to string) (*CityRouteResponse, *ErrResponse) {

	var titleCache map[string][]*OSMTransportStop
	var idCache map[int]*OSMTransportStop

	cached := cityStopsCache.GetStops(city)
	if cached != nil {
		titleCache = cached.byTitle
		idCache = cached.byId

	} else {
		cityStops, err := GetAllCityStops(city)
		if err != nil {
			return nil, &ErrResponse{HTTPStatusCode: 500, StatusText: err.Error()}
		}
		cityStopsCache.SetStops(city, cityStops)
		cache := cityStopsCache.GetStops(city)
		titleCache = cache.byTitle
		idCache = cache.byId
	}

	startPoints := titleCache[TrimStopSuffix(from)]
	endPoints := titleCache[TrimStopSuffix(to)]

	//fmt.Println(startPoints)
	//targetPoint := (*pts)[1]

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
		route, err := SearchCityRoute(*item, endPoints, city, &queue, &titleCache)
		if err != nil {
			panic(err)
		}
		if route != nil {
			fmt.Println(route)
			foundRoute = *route
			break
		}

	}

	lineData := make([][]LineConnection, len(foundRoute.CurrentTrip)-1)

	for ind := range len(foundRoute.CurrentTrip) - 1 {
		startName := foundRoute.CurrentTrip[ind].Tags.Name
		endName := foundRoute.CurrentTrip[ind+1].Tags.Name
		data, err := GetConnections(startName, endName, idCache)
		if err != nil {
			panic(err)
		}
		lineData[ind] = data
	}
	return &CityRouteResponse{Connections: lineData}, nil
}

type OSMGeometry interface {
	OsmID() int
	Latitude() float64
	Longtitude() float64
}
