// SearchInput.tsx
import { Input } from "~/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

export default function SearchInput() {
  const [query, setQuery] = useState("")

  return (
    <div className="flex align-center justify-center gap-[10px]">
      <Input className="bg-white" />
      <Button type="submit">Search</Button>
    </div>
  )
}
