import { useEffect, useState } from "react"
import MovieCard from "~/components/card/MovieCard"
import SearchInput from "~/components/input/SearchInput"
import type { Serie } from "~/service/types"
import { MoviesService } from "~/service/movies"

function Movies() {
  const movieService = new MoviesService();
  const [allMovies, setAllMovies] = useState<Serie[]>();

  useEffect(()=> {
    (async ()=> {
      const res = await movieService.getMoviesList();
      if (res) {
        setAllMovies(res.list)
      }
    })()
  },[])

  return (
    <div className="w-[100%]">
      <div className="w-[100%] h-[10vh] pl-[10px] pr-[10px] pt-[10px] flex align-center justify-start">
        <SearchInput />
      </div>
      <div className='w-[100%] h-[90vh] grid grid-cols-3 overflow-scroll pb-[1%] gap-[20px] pl-[1.5%] pr-[1.5%]'>
        {
          allMovies?.map((items, idx) => (
            <MovieCard count={items.episode_count} title={items.title} key={idx}/>
          ))
        }
      </div>
    </div>
  )
}

export default Movies