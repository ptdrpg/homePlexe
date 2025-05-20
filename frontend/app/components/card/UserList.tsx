import Trash from "../icon/Trash"
import { Switch } from "../ui/switch"
import type { visitorType } from "~/service/types"
import { VisitorService } from "~/service/visitor"

type Porps = {
  data: visitorType;
  setChanged: React.Dispatch<React.SetStateAction<number | undefined>>
}

function UserList({data, setChanged}: Porps) {
  const isActive = () => {
    return data.is_expired? "bg-amber-500 text-white font-bold text-[11px] pt-[5px] pr-[7px] pb-[5px] pl-[7px]": " bg-emerald-400 text-white font-bold text-[11px] pt-[5px] pr-[7px] pb-[5px] pl-[7px] rounded-[5px] mt-[12%]"
  }
  const dateSplited = data.created_at.split("T")
  const visitorService = new VisitorService();

  const reabilite = async ()=> {
    const res = await visitorService.reactiveVisitor(data.id)
    setChanged(data.id)
    console.log(res);
  }

  return (
    <div className="flex w-[100%] p-[10px] align-center justify-between bg-white rounded-[5px] h-[10vh]">
      <div className="flex align-center justify-center gap-[5px]">
        <div className="pl-[7px] pr-[7px] bg-amber-400 text-white rounded-[5px] flex items-center justify-center h-[35px] w-[35px]">
          <p className="text-[16] font-black">{data.username.charAt(0).toUpperCase()}</p>
        </div>
        <div className="flex flex-col items-start justify-start gap-0">
          <p className="text-[14px]">{data.username}</p>
          <p className="text-gray-500 text-[11px]">visitor id: {data.id}</p>
        </div>
      </div>
      <div className="flex flex-col align-center justify-start">
        <p className="text-[14px]">Password</p>
        <p className="text-gray-500 text-[11px]">{data.password}</p>
      </div>
      <div className="flex flex-col align-center justify-start">
        <p className="text-[14px]">Created_at</p>
        <p className="text-gray-500 text-[11px]">{dateSplited[0]}</p>
      </div>
      <div>
        <p className={isActive()}>{data.is_expired?"INACTIVE":"ACTIVE"}</p>
      </div>
      <div className="flex align-center justify-center gap-[10px] mt-[1%]">
        <Switch checked={!data.is_expired} onCheckedChange={reabilite} />
        <Trash />
      </div>
    </div>
  )
}

export default UserList