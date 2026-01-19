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
		route := FindCityRoute(currentCity, from[0], to[0])
		render.Render(w, r, &route)
	}
}

func FindCityRoute(city string, from string, to string) ErrResponse {

	var titleCache map[string][]*OSMTransportStop

	cached := cityStopsCache.GetStops(city)
	if cached != nil {
		titleCache = cached.byTitle

	} else {
		cityStops, err := GetAllCityStops(city)
		if err != nil {
			return ErrResponse{HTTPStatusCode: 500, StatusText: err.Error()}
		}
		cityStopsCache.SetStops(city, cityStops)
		titleCache = cityStopsCache.GetStops(city).byTitle
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

	for queue.Len() > 0 {
		item := heap.Pop(&queue).(*TransportSearchItem)
		//fmt.Println(len(queue), item.Distances[len(item.Distances)-1], item.CurrentTrip[len(item.CurrentTrip)-1].Tags.Name)
		route, err := SearchCityRoute(*item, endPoints, city, &queue, &titleCache)
		if err != nil {
			panic(err)
		}
		if route != nil {
			fmt.Println(route)
			break
		}

	}

	//route, err := SearchCityRoute(tripstack, *endPoints, city)
	//fmt.Println(err)

	return ErrResponse{HTTPStatusCode: 200, StatusText: "Search Exhausted"}
}

type OSMGeometry interface {
	OsmID() int
	Latitude() float64
	Longtitude() float64
}
