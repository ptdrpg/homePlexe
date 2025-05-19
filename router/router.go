package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/ptdrpg/homePlexe/controller"
	"github.com/ptdrpg/homePlexe/lib"
)

type Router struct {
	R *chi.Mux
	C *controller.Controller
}

func NewRouter(c *controller.Controller) *Router {
	r := chi.NewRouter()

	// Middleware CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}))

	return &Router{
		R: r,
		C: c,
	}
}

func (r *Router) RegisterRouter() {
	// r.R.Route("/api/v1", func(v1 chi.Router) {
	// 	v1.Route("/users", func(users chi.Router) {
	// 		users.Get("/", r.C.GetAllUsers)
	// 		users.Post("/newVisitor", r.C.CreateUser)
	// 		users.Put("/reabilite/{id}", r.C.ActualiseUser)
	// 		users.Delete("/delete/{id}", r.C.DeleteUser)
	// 	})
	// 	v1.Route("/login", func(login chi.Router){
	// 		login.Post("/", r.C.Login)
	// 	})
	// })
	r.R.Group(func(public chi.Router) {
		public.Route("/api/v1/login", func(login chi.Router) {
			login.Post("/", r.C.Login)
		})
	})

	r.R.Group(func(private chi.Router) {
		private.Use(lib.JWTMiddleware)
		private.Route("/api/v1", func(v1 chi.Router) {
			v1.Route("/users", func(users chi.Router) {
				users.Get("/", r.C.GetAllUsers)
				users.Post("/newVisitor", r.C.CreateUser)
				users.Put("/reabilite/{id}", r.C.ActualiseUser)
				users.Delete("/delete/{id}", r.C.DeleteUser)
			})
		})
	})
}

func (r *Router) Handler() http.Handler {
	return r.R
}
