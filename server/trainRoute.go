package main

import (
	"cmp"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"log"
	"net/http"
	"net/url"
	"slices"
)

func GetTrainRoute(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query["from"] == nil || query["to"] == nil {
		render.Render(w, r, &ErrResponse{HTTPStatusCode: 401, StatusText: "Missing required parameters (from, to)"})
	} else {
		routes := FindTrainRoute(query["from"][0], query["to"][0])
		render.Render(w, r, &routes)
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

func SearchTrainRoute(tripstack []OSMTransportStop, targets []OSMTransportStop) ([]OSMTransportStop, error) {
	for _, t := range tripstack {
		fmt.Printf("%v ->", t.Tags.Name)
	}
	fmt.Printf("\n")
	target_center := Center(targets)
	last_stop := tripstack[len(tripstack)-1]
	for _, tgt := range targets {
		if last_stop.OsmID() == tgt.OsmID() {
			return tripstack, nil
		}
	}
	best_distance := Haversine(last_stop.Latitude(), last_stop.Longtitude(), target_center[0], target_center[1])
	possible_stops, err := GetNamedStations(last_stop.Tags.Name)
	if err != nil {
		return nil, err
	}
	queue := []OSMTransportStop{}
	for _, stop := range *possible_stops {
		reachable_stops, err := GetAllReachableStations(stop)
		if err != nil {
			return nil, err
		}
		for _, stop := range *reachable_stops {
			if stop.OsmID() != last_stop.OsmID() && Haversine(stop.Latitude(), stop.Longtitude(), target_center[0], target_center[1]) < best_distance {
				queue = append(queue, stop)
			}
		}

	}
	slices.SortFunc(queue, func(a, b OSMTransportStop) int {
		return cmp.Compare(
			Haversine(a.Latitude(), a.Longtitude(), target_center[0], target_center[1]),
			Haversine(b.Latitude(), b.Longtitude(), target_center[0], target_center[1]))
	})
	for _, item := range queue {
		route, err := SearchTrainRoute(append(tripstack, item), targets)
		if err == nil {
			return route, nil
		}
	}
	return nil, errors.New("search exhausted!")

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

func FindTrainRoute(from string, to string) ErrResponse {

	startPoints, err := GetNamedStations(from)

	if err != nil {
		panic(err)
	}
	endPoints, err := GetNamedStations(to)

	if err != nil {
		panic(err)
	}

	fmt.Println(startPoints)
	//targetPoint := (*pts)[1]

	center_end := Center(*endPoints)

	for _, start := range *startPoints {

		base_dist := Haversine(start.Latitude(), start.Longtitude(), center_end[0], center_end[1])

		fmt.Println(base_dist)

		tripstack := []OSMTransportStop{start}

		route, err := SearchTrainRoute(tripstack, *endPoints)

		fmt.Println("ROUTE: ======")
		for idx, stop := range route {
			fmt.Printf("[%v] %v \n", idx, stop)
		}
		fmt.Println(err)

	}

	return ErrResponse{HTTPStatusCode: 200, StatusText: "Failed successfully"}

}
