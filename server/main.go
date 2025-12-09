package main

import (
	//"context"
	//"errors"
	"flag"
	"fmt"
	//"math/rand"
	"net/http"
	//"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
)

var routes = flag.Bool("routes", false, "Generate router documentation")

func main() {
	flag.Parse()

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Route("/city", func(r chi.Router) {
		r.Get("/list", GetSupportedCities)
		r.Route("/{cityName}", func(r chi.Router) {
			//r.Use(CitiesCtx)
			r.Mount("/transport", transportRouter())
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

type CitiesResponse struct {
	Cities []string `json:"cities"`
}

func (rd *CitiesResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func SupportedCities() []string {
	return []string{"Wrocław"}
}

func GetSupportedCities(w http.ResponseWriter, r *http.Request) {
	cityList := CitiesResponse{Cities: SupportedCities()}

	render.Render(w, r, &cityList)
}
