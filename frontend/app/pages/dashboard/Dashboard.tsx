import { useEffect, useState } from "react";
import type { visitorType } from "~/service/types";
import { VisitorService } from "~/service/visitor"
import UserList from "~/components/card/UserList";
import { interceptor } from "~/service/axios";
import DashCard from "~/components/card/DashCard";

function Dashboard() {
  const visitorService = new VisitorService();
  const [visitors, setVisitor] = useState<visitorType[]>()
  const [message, setMessage] = useState<string>('')

  useEffect(()=> {
    (async ()=> {
      interceptor();
      const res = await visitorService.getAllVisitor();
      setVisitor(res)
    })()
  },[message])

  return (
    <div className="w-[100%]">
      <div className="flex align-center justify-start gap-[10px] w-[100%] p-[20px]">
        <p className="text-2xl font-bold" >Mange Access</p>
        <p className="font-light mt-[0.6%]">Since Joined</p>
      </div>
      <div className="w-[100%] pl-[20px] pr-[20px]">
        <DashCard count={visitors?.length} setMessage={setMessage} />
      </div>
      <div className="flex flex-col gap-[10px] w-[100%] p-[20px]">
        <div className="w-[100%] flex items-center justify-start"><p>All visitor user</p></div>
        {
          visitors?.map((items, idx) => (
            <UserList data={items} setMessage={setMessage} key={idx} />
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard