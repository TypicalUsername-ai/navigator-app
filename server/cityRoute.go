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

type TransportTripPart struct {
	Info              OSMGeometry
	DistanceRemaining float64
	StopsNo           int
	PossibleMethods   []int
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

func Center(i []OSMGeometry) [2]float64 {
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

func SearchCityRoute(tripstack []TransportTripPart, targets []OSMGeometry, stopMap map[int][]TransportTripPart) ([]TransportTripPart, error) {
	last_stop_id := tripstack[len(tripstack)-1].Info.OsmID()
	var query = fmt.Sprintf(`[out:json];
			node(%v) -> .startPoint;
			rel(bn.startPoint);
			out geom;`, last_stop_id)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))

	if err != nil {
		return nil, err
	}
	if response.StatusCode != 200 {
		return nil, errors.New("non-200 response " + string(response.StatusCode))
	}
	defer response.Body.Close()

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	stopsData := RelationsGeomQuery{}

	err = json.Unmarshal(bodyBytes, &stopsData)
	if err != nil {
		log.Fatal(string(bodyBytes))
		return nil, err
	}

	target_center := Center(targets)

	var new_items [][]TransportTripPart

	for _, route := range stopsData.Elements {

		//fmt.Println(idx, route.Tags.Name)
		past_start := false
		stop_distance := 0
		for _, child := range route.Members {

			for _, tgt := range targets {
				if tgt.OsmID() == child.OsmID() {
					distance := Haversine(child.Lat, child.Lon, target_center[0], target_center[1])
					transport := TransportTripPart{Info: child, DistanceRemaining: distance, StopsNo: stop_distance, PossibleMethods: []int{route.ID}}
					trip := append(tripstack, transport)
					return trip, nil
				}

			}
			if child.OsmID() == last_stop_id {
				past_start = true
				// to not include the stop logic on the initial stop
			}
			if child.Role == "stop" && past_start {
				refd := stopMap[child.Ref]

				if refd != nil {
					refd[len(refd)-1].PossibleMethods = append(refd[len(refd)-1].PossibleMethods, route.ID)
					//think of some logic here
					// replace if shorter path TODO
					// append if new method
					stopMap[child.Ref] = refd

				} else {
					distance := Haversine(child.Lat, child.Lon, target_center[0], target_center[1])
					transport := TransportTripPart{Info: child, DistanceRemaining: distance, StopsNo: stop_distance, PossibleMethods: []int{route.ID}}
					trip := append(tripstack, transport)
					stopMap[child.Ref] = trip

					new_items = append(new_items, trip)
				}
				stop_distance += 1
			}
		}
	}
	queue := new_items
	slices.SortFunc(queue, SortTripParts)
	fmt.Printf("qdepth: %v | mapsize: %v \n", len(queue), len(stopMap))
	//fmt.Println(queue[0:10])

	for qid, hops := range queue {
		hop := hops[len(hops)-1]
		fmt.Printf("HOP: %v \n", hop)
		fmt.Printf("[%v] %v/%v \n", hop, qid, len(hops))
		res, err := SearchCityRoute(append(tripstack, hop), targets, stopMap)
		if res != nil {
			return res, err
		}
	}

	return nil, errors.New("search exhausted!")

}

func SortTripParts(a, b []TransportTripPart) int {
	var dist_a, dist_b float64

	for _, item := range a {
		dist_a += item.DistanceRemaining
	}
	for _, item := range b {
		dist_b += item.DistanceRemaining
	}

	return cmp.Compare(dist_a, dist_b)

}

func FindCityRoute(city string, from string, to string) ErrResponse {

	startPoints, err := GetNamedStops(city, from)

	if err != nil {
		panic(err)
	}
	endStops, err := GetNamedStops(city, to)

	if err != nil {
		panic(err)
	}

	endPoints := make([]OSMGeometry, len(*endStops))
	for sid, stop := range *endStops {
		endPoints[sid] = stop
	}

	fmt.Println(startPoints)
	//targetPoint := (*pts)[1]

	center_end := Center(endPoints)

	for _, target := range *startPoints {

		base_dist := Haversine(target.Latitude(), target.Longtitude(), center_end[0], center_end[1])

		fmt.Println(base_dist)

		tripstack := []TransportTripPart{TransportTripPart{Info: OSMGeometry(target), DistanceRemaining: base_dist, StopsNo: 0, PossibleMethods: []int{}}}

		stopMap := make(map[int][]TransportTripPart, 30)

		stopMap[target.OsmID()] = tripstack

		route, err := SearchCityRoute(tripstack, endPoints, stopMap)

		fmt.Println("ROUTE: ======")
		for idx, stop := range route {
			fmt.Printf("[%v] after %v stops via %v => %v \n", idx, stop.StopsNo, stop.PossibleMethods, stop.Info.OsmID())
		}
		fmt.Println(err)

	}

	return ErrResponse{HTTPStatusCode: 200, StatusText: "Failed successfully"}
}
