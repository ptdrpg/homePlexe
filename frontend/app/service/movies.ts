import { apiService, interceptor } from "./axios";
import type { SerieResponse } from "./types";

export class MoviesService {
  getMoviesList = async ()=> {
    interceptor()
    return await apiService.get("/movies/list")
    .then(async (response) => await response.data)
    .then(async (data: SerieResponse)=> {
      return data
    })
  }
}
