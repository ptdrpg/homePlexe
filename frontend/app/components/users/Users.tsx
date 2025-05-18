import { useLayoutEffect, useState } from "react"
import { decodePaylod, type Paylod } from "~/service/decode"

function Users() {
  const [userpaylod, setuserPaylod] = useState<Paylod>()
  const [initial, setinitial] = useState<string>()
  useLayoutEffect(() => {
    const paylod = decodePaylod();
    if (paylod) {
      setuserPaylod(paylod);
      setinitial(paylod.username.charAt(0).toUpperCase());
    }
  },[])

  return (
    <div className=" w-[100%] flex items-start justify-start gap-[10px] pl-5">
      <div className="pt-[7px] pb-[7px] pl-[15px] pr-[10px] bg-amber-400 text-white rounded-[5px]">
        <p className="text-3xl font-black">{initial}</p>
      </div>
      <div className="flex flex-col items-start justify-start gap-0 text-emerald-600">
        <p className="font-bold">{userpaylod?.username}</p>
        <p className="text-gray-500 ">{userpaylod?.role}</p>
      </div>
    </div>
  )
}

export default Users