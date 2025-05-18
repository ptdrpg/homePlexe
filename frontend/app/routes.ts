import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("login/Login.tsx"),
  layout("./pages/Layout.tsx", [
    route("/dash", "./pages/dashboard/Dashboard.tsx"),
    route("/movies", "./pages/movies/Movies.tsx"),
    route("/books", "./pages/books/Books.tsx"),
  ])
] satisfies RouteConfig;
