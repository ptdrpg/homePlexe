import Plus from "../icon/Plus"
import People from "../icon/People"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "../ui/button"
import { useForm, Controller } from "react-hook-form"
import type { newVisitorType } from "~/service/types"
import { VisitorService } from "~/service/visitor"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useState } from "react"


type Props = {
  count: number | undefined;
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

function DashCard({count, setMessage}: Props) {
  const visitorService = new VisitorService();
  const [open, setOpen] = useState<boolean>(false)

  const { register, handleSubmit, reset, control } = useForm<newVisitorType>();

  const submit = async (data: newVisitorType)=> {
    const res = await visitorService.createVisitor(data)
    setMessage(res.message);
    toast(res.message, {
      description: Date.now(),
    });
    reset();
    setOpen(false)
  }

  return (
    <div className='w-[20%] flex flex-col align-start justify-center p-[15px] gap-[5px] bg-white rounded-[5px]'>
      <div className='flex align-start justify-between'>
        <People />
        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer" onClick={() => setOpen(true)}>
          <Plus />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onSubmit={handleSubmit(submit)}>
        <DialogHeader>
          <DialogTitle>New visitor</DialogTitle>
          <DialogDescription>
            Create visitor profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Username" className="text-right">
              Username
            </Label>
            <Input id="username" className="col-span-3" {...register('username')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              password
            </Label>
            <Input id="password" className="col-span-3" {...register("password")} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({field}) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[100%]">
                  <SelectValue placeholder="Status"  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="visitor">visitor</SelectItem>
                </SelectContent>
              </Select>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(submit)}>Save visitor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      </div>
      <p className='text-[11px]'>Customer total</p>
      <div>
        <p className='text-3xl font-bold'>{count} visitor</p>
      </div>
    </div>
  )
}

export default DashCard