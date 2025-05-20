import Users from '../users/Users';
import SideButton from '../button/SideButton';
import { useLocation, useNavigate } from 'react-router';
import Books from "~/components/icon/Books"
import DashIcon from "~/components/icon/DashIcon"
import Movies from "~/components/icon/Movies"
import LogoutIcon from '../icon/Logout';
import { useLayoutEffect, useState } from 'react';
import { decodePaylod } from '~/service/decode';

function Sidebar() {
  const [view, setView] = useState<boolean>(true)
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname == path;
  }

  useLayoutEffect(() => {
    const payload = decodePaylod();
    if (payload?.role == "visitor") {
      setView(false);
    }
  },[])

  const navLinkStatic = [
    {
      icon: <DashIcon color={isActive("/dash")? "white": "black"} />,
      label: "Dashboard",
      link: "/dash"
    },
    {
      icon: <Movies color={isActive("/movies")? "white": "black"} />,
      label: "Movies",
      link: "/movies"
    },
    {
      icon: <Books color={isActive("/books")? "white": "black"} />,
      label: "Books",
      link: "/books"
    }
  ]

  const logout = () => {
    localStorage.clear();
    navigate("/");
  }
  return (
    <div className='flex flex-col items-start justify-between h-[100vh] bg-white pt-5 pb-5'>
      <div className='flex flex-col items-center justify-start gap-5 w-[100%]'>
        <Users />
        <div className='w-[100%]'>
          {
            navLinkStatic.map((item, idx) => (
              item.label == "Dashboard"? view && <SideButton is_active={isActive} key={idx} icon={item.icon} label={item.label} link={item.link}  /> : <SideButton is_active={isActive} key={idx} icon={item.icon} label={item.label} link={item.link}  />
            ))
          }
        </div>
      </div>
      <div className='flex items-center justify-start w-[100%] p-[10px] gap-[10px] cursor-pointer hover:bg-emerald-400 hover:text-white' onClick={logout}>
        <LogoutIcon />
        <p className='font-bold' >Logout</p>
      </div>
    </div>
  )
}

export default Sidebar