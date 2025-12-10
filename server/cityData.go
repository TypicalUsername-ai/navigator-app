package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/render"
	"io"
	"net/http"
	"net/url"
	"time"
)

var cachedCities []City

type CitiesResponse struct {
	Cities []City `json:"cities"`
}

type City struct {
	Name string  `json:"name"`
	Lat  float64 `json:"lat"`
	Lon  float64 `json:"lon"`
}

func (rd *CitiesResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

type CityBoundsResponse struct {
	Version   float64 `json:"version"`
	Generator string  `json:"generator"`
	Osm3S     struct {
		TimestampOsmBase time.Time `json:"timestamp_osm_base"`
		Copyright        string    `json:"copyright"`
	} `json:"osm3s"`
	Elements []struct {
		Type   string `json:"type"`
		ID     int    `json:"id"`
		Bounds struct {
			Minlat float64 `json:"minlat"`
			Minlon float64 `json:"minlon"`
			Maxlat float64 `json:"maxlat"`
			Maxlon float64 `json:"maxlon"`
		} `json:"bounds"`
		Members []struct {
			Type     string `json:"type"`
			Ref      int    `json:"ref"`
			Role     string `json:"role"`
			Geometry []struct {
				Lat float64 `json:"lat"`
				Lon float64 `json:"lon"`
			} `json:"geometry,omitempty"`
			Lat float64 `json:"lat,omitempty"`
			Lon float64 `json:"lon,omitempty"`
		} `json:"members"`
		Tags struct {
			AdminLevel   string `json:"admin_level"`
			AltName      string `json:"alt_name"`
			Boundary     string `json:"boundary"`
			Name         string `json:"name"`
			OfficialName string `json:"official_name"`
			TerytTerc    string `json:"teryt:terc"`
			Type         string `json:"type"`
			Website      string `json:"website"`
			Wikidata     string `json:"wikidata"`
			Wikipedia    string `json:"wikipedia"`
		} `json:"tags"`
	} `json:"elements"`
}

func GetSupportedCities(w http.ResponseWriter, r *http.Request) {

	param := ""

	for _, name := range SupportedCities() {

		param += fmt.Sprintf(`nwr["name"="%v"]["type"="boundary"]["admin_level"~"[6,7]"];`, name)
	}
	var query = fmt.Sprintf(`[out:json][timeout:25];(%v);out geom;`, param)

	response, err := http.Get(overpass_api_url + url.QueryEscape(query))
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(response.Body)
		fmt.Printf("[SuppCityBoundaries] non-200: %v body: %s\n", response.Status, string(body))
		if len(cachedCities) > 0 {
			render.Render(w, r, &CitiesResponse{Cities: cachedCities})
			return
		}
		fallback := make([]City, 0, len(SupportedCities()))
		for _, name := range SupportedCities() {
			fallback = append(fallback, City{Name: name, Lat: 0, Lon: 0})
		}
		render.Render(w, r, &CitiesResponse{Cities: fallback})
		return
	}

	bodyBytes, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	cityData := CityBoundsResponse{}

	err = json.Unmarshal(bodyBytes, &cityData)
	if err != nil {
		panic(err)
	}

	fmt.Printf("[SuppCityBoundaries] => %v\n", response.Status)

	cities := []City{}

	for _, data := range cityData.Elements {
		lat := (data.Bounds.Maxlat + data.Bounds.Minlat) / 2
		lon := (data.Bounds.Maxlon + data.Bounds.Minlon) / 2
		cities = append(cities, City{Name: data.Tags.Name, Lat: lat, Lon: lon})

	}

	if len(cities) > 0 {
		cachedCities = cities
	}

	cityList := CitiesResponse{Cities: cities}

	render.Render(w, r, &cityList)
}
