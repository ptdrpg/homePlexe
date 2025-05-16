package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/ptdrpg/homePlexe/controller"
)

type Router struct {
	R *chi.Mux
	C *controller.Controller
}

func NewRouter(c *controller.Controller) *Router {
	r := chi.NewRouter()

	// Middleware CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}))

	return &Router{
		R: r,
		C: c,
	}
}

func (r *Router) RegisterRouter() {
	r.R.Route("/api/v1", func(v1 chi.Router) {
		
	})
}

func (r *Router) Handler() http.Handler {
	return r.R
}
