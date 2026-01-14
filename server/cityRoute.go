package main

import (
	"cmp"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"log"
	//"maps"
	"math"
	"net/http"
	"net/url"
	"slices"
)

func GetCityRoute(w http.ResponseWriter, r *http.Request) {

	currentCity := r.Context().Value("city").(string)

	query := r.URL.Query()

	if query["from"] == nil || query["to"] == nil {
		render.Render(w, r, &ErrResponse{HTTPStatusCode: 401, StatusText: "Missing required parameters (from, to)"})
	} else {
		route := FindCityRoute(currentCity, query["from"][0], query["to"][0])
		render.Render(w, r, &route)
	}
}

type OSMGeometry interface {
	OsmID() int
	Latitude() float64
	Longtitude() float64
}

type RelationMember struct {
	Type     string  `json:"type"`
	Ref      int     `json:"ref"`
	Role     string  `json:"role"`
	Lat      float64 `json:"lat,omitempty"`
	Lon      float64 `json:"lon,omitempty"`
	Geometry []struct {
		Lat float64 `json:"lat"`
		Lon float64 `json:"lon"`
	} `json:"geometry,omitempty"`
}

func (r RelationMember) OsmID() int          { return r.Ref }
func (r RelationMember) Latitude() float64   { return r.Lat }
func (r RelationMember) Longtitude() float64 { return r.Lon }

type RelationsGeomQuery struct {
	*OsmResponseHeaders
	Elements []struct {
		Type   string `json:"type"`
		ID     int    `json:"id"`
		Bounds struct {
			Minlat float64 `json:"minlat"`
			Minlon float64 `json:"minlon"`
			Maxlat float64 `json:"maxlat"`
			Maxlon float64 `json:"maxlon"`
		} `json:"bounds"`
		Members []RelationMember `json:"members"`
		Tags    struct {
			Bicycle                string `json:"bicycle"`
			CheckDate              string `json:"check_date"`
			From                   string `json:"from"`
			Name                   string `json:"name"`
			Network                string `json:"network"`
			NetworkWikidata        string `json:"network:wikidata"`
			Operator               string `json:"operator"`
			OperatorWikidata       string `json:"operator:wikidata"`
			PublicTransportVersion string `json:"public_transport:version"`
			Ref                    string `json:"ref"`
			Route                  string `json:"route"`
			To                     string `json:"to"`
			Type                   string `json:"type"`
			Wheelchair             string `json:"wheelchair"`
		} `json:"tags"`
	} `json:"elements"`
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

func Center(i []OSMTransportStop) [2]float64 {
	print(i)
	end_lat := 0.0
	end_lon := 0.0
	for _, pt := range i {
		end_lat += pt.Latitude()
		end_lon += pt.Longtitude()
	}

	end_lat = end_lat / float64(len(i))
	end_lon = end_lon / float64(len(i))

	return [2]float64{end_lat, end_lon}

}

func Haversine(lat1, lon1, lat2, lon2 float64) float64 {
	radius_km := 6371e3
	lat_1 := lat1 * math.Pi / 180.0
	lat_2 := lat2 * math.Pi / 180.0
	lat_diff := (lat2 - lat1) * math.Pi / 180.0
	lon_diff := (lon2 - lon1) * math.Pi / 180.0

	a := math.Pow(math.Sin(lat_diff/2), 2) + math.Cos(lat_1)*math.Cos(lat_2)*math.Pow(math.Sin(lon_diff/2), 2)
	c := 2.0 * math.Atan2(math.Sqrt(a), math.Sqrt(1.0-a))
	return radius_km * c
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

func SearchCityRoute(tripstack []OSMTransportStop, targets []OSMTransportStop, city string) ([]OSMTransportStop, error) {
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
	possible_stops, err := GetNamedStops(city, last_stop.Tags.Name)
	if err != nil {
		return nil, err
	}
	queue := []OSMTransportStop{}
	for _, stop := range *possible_stops {
		reachable_stops, err := GetAllReachableStops(stop)
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
		route, err := SearchCityRoute(append(tripstack, item), targets, city)
		if err == nil {
			return route, nil
		}
	}
	return nil, errors.New("search exhausted!")

}

func FindCityRoute(city string, from string, to string) ErrResponse {

	startPoints, err := GetNamedStops(city, from)

	if err != nil {
		panic(err)
	}
	endPoints, err := GetNamedStops(city, to)

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

		route, err := SearchCityRoute(tripstack, *endPoints, city)

		fmt.Println("ROUTE: ======")
		for idx, stop := range route {
			fmt.Printf("[%v] %v \n", idx, stop)
		}
		fmt.Println(err)

	}

	return ErrResponse{HTTPStatusCode: 200, StatusText: "Failed successfully"}
}
