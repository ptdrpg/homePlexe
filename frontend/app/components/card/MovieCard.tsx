
type Props = {
  title: string;
  count: number;
}

function MovieCard({title, count}: Props) {

  return (
    <div className="w-[100%] flex align-start justify-start pt-[10px] gap-[10px]">
      <div className="w-[40%] h-[30vh] flex align-center justify-center bg-white">
        {/* <p className="text-5xl font-black text-white">{title.charAt(0).toUpperCase()}</p> */}
      </div>
      <div className="flex flex-col align-start justify-start gap-[5px] w-[50%]">
        <p className="text-[14px] font-bold">{title}</p>
        <div className="pl-[5px] pr-[5px] pt-[5px] pb-[5px] bg-amber-400 text-white rounded-[4px] w-[50%] flex align-center justify-center">
          <p className="text-[11.5px] font-black">{count} episodes</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard