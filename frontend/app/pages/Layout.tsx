import Sidebar from "~/components/sidebar/Sidebar"
import { Outlet } from "react-router"
import { isTokenValid } from "~/service/axios"
import { useEffect } from "react"
import { useNavigate } from "react-router"

function Layout() {
  const navigate = useNavigate();
  useEffect(()=> {
    if (!isTokenValid()) {
      navigate("/")
    }
  },[])

  return (
    <div className="grid grid-cols-6 w-[100%] h-[100vh] align-start justify-start">
      <div className=" h-[100vh]">
        <Sidebar />
      </div>
      <div className="col-span-5 w-[100%] h-[100vh] bg-gray-200">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout