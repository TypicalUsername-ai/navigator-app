package main

import (
	"flag"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	"net/http"
	"sync"
	"time"
)

var routes = flag.Bool("routes", false, "Generate router documentation")

var overpass_api = flag.String("api_url", "http://overpass-api.de", "Overpass API site")

var overpass_endpoint = flag.String("api_endpoint", "/api/interpreter?data=", "Overpass API endpoint")

//var overpass_api_url = "http://localhost:5555/api/interpreter?data="

var overpass_api_url = fmt.Sprintf("%v%v", *overpass_api, *overpass_endpoint)
var cityStopsCache = CityStopsCache{ttl: 1 * time.Hour, lock: sync.RWMutex{}, stops: make(map[string]*CityStopsCacheEntry)}
var trainStopsCache = TrainStopsCache{}

func main() {
	flag.Parse()

	overpass_api_url = fmt.Sprintf("%v%v", *overpass_api, *overpass_endpoint)
	fmt.Printf("Starting navigator server [overpass api: %v] \n", overpass_api_url)

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(render.SetContentType(render.ContentTypeJSON))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://0.0.0.0:5173", "*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/city", func(r chi.Router) {
		r.Get("/list", GetSupportedCities)
		r.Route("/{cityName}", func(r chi.Router) {
			//r.Use(CitiesCtx)
			//r.Get("/tickets", GetTickets)
			r.Mount("/transport", transportRouter())
			r.Mount("/trains", trainRouter())
			r.Mount("/parking", parkingRouter())
		})
	})

	// Passing -routes to the program will generate docs for the above
	// router definition. See the `routes.json` file in this folder for
	// the output.
	if *routes {
		// fmt.Println(docgen.JSONRoutesDoc(r))
		fmt.Println(docgen.MarkdownRoutesDoc(r, docgen.MarkdownOpts{
			ProjectPath: "github.com/TypicalUsername-ai/navigator-app/server",
			Intro:       "Navigator app docs",
		}))
		return
	}

	http.ListenAndServe(":3333", r)
}

func SupportedCities() []string {
	return []string{"Wrocław", "Warszawa", "Łódź", "Kraków", "Opole"}
}
