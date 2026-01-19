package main

import (
	"math"
)

func Center(i []*OSMTransportStop) [2]float64 {
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
