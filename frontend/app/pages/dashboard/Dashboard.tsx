import { useEffect, useState } from "react";
import type { visitorType } from "~/service/types";
import { VisitorService } from "~/service/visitor"
import UserList from "~/components/card/UserList";
import { interceptor } from "~/service/axios";

function Dashboard() {
  const visitorService = new VisitorService();
  const [visitors, setVisitor] = useState<visitorType[]>()
  
  useEffect(()=> {
    (async ()=> {
      interceptor();
      const res = await visitorService.getAllVisitor();
      setVisitor(res)
    })()
  },[])

  return (
    <div className="w-[100%]">
      <div className="flex align-center justify-start gap-[10px] w-[100%] p-[20px]">
        <p className="text-2xl font-bold" >Mange Access</p>
        <p className="font-light mt-[0.6%]">Since Joined</p>
      </div>
      <div></div>
      <div className="flex flex-col gap-[10px] w-[100%] p-[20px]">
        <div className="w-[100%] flex items-center justify-start"><p>All visitor user</p></div>
        {
          visitors?.map((items, idx) => (
            <UserList created_at={items.created_at} id={items.id} is_expired={items.is_expired} password={items.password} status={items.status} username={items.username} updated_at={items.updated_at} key={idx} />
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard