package main

import (
	"github.com/go-chi/render"
	//"maps"
	"net/http"
	//"slices"
)

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

	cached := cityStopsCache.GetStops(currentCity)

	var cityStops []OSMTransportStop

	if cached != nil {
		cityStops = cached.stops

	} else {
		cityStops, err := GetAllCityStops(currentCity)
		if err != nil {
			render.Render(w, r, &ErrResponse{HTTPStatusCode: 500, StatusText: err.Error()})
		}
		cityStopsCache.SetStops(currentCity, cityStops)
	}

	stops := CityStopsResponse{Stops: FormatStops(cityStops)}
	render.Render(w, r, &stops)

}

func FormatStops(stops []OSMTransportStop) []TransportStop {
	formatted := []TransportStop{}

	for _, stop := range stops {
		newStop := TransportStop{OsmID: stop.ID, Lat: stop.Lat, Lon: stop.Lon, Tram: stop.Tags.Tram == "yes", Bus: stop.Tags.Bus == "yes", Name: stop.Tags.Name}
		formatted = append(formatted, newStop)
	}

	return formatted
}
