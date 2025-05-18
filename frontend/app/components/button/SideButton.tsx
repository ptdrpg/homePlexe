import type { JSX } from "react"
import { Link } from "react-router";

type Props = {
  icon: JSX.Element;
  label: string;
  link: string;
  is_active: (path: string) => boolean
}

function SideButton({ icon, label, link, is_active }: Props) {
  const getLink = (path: string) => {
    return is_active(path)?  "flex items-center justify-start w-[100%] p-[10px] gap-[10px] bg-emerald-500 text-white" : "flex items-center justify-start w-[100%] p-[10px] gap-[10px]"
  }

  return (
    <Link to={link} className={getLink(link)}>
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}

export default SideButton