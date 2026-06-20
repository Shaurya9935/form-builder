"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import useCreateForm from "~/hooks/api/form"

export default function FormsPage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { createFormAsync, isSuccess, isError, isIdle, status, error } =
    useCreateForm()

  const isLoading = status === "pending"

  const onCreate = async () => {
    try {
      await createFormAsync({ title, description })
      setOpen(false)
      setTitle("")
      setDescription("")
    } catch (e) {
      // leave error handling to hook consumer or show UI feedback
      console.error(e)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forms</h1>
          <p className="text-sm text-muted-foreground">
            This route is now wired up from the sidebar.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Form</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new form</DialogTitle>
              <DialogDescription>
                Provide a title and optional description for the new form.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2 py-4">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form title"
              />

              <label className="text-sm font-medium pt-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onCreate} disabled={isLoading || title.trim() === ""}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}