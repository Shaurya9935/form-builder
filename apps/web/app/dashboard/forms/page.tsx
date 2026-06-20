"use client"

import { useState } from "react"
import Link from "next/link"
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
import { useCreateForm, useListForms } from "~/hooks/api/form"

export default function FormsPage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { createFormAsync, status } = useCreateForm()
  const { forms, isLoading: isFormsLoading, error: formsError } = useListForms()

  const isLoading = status === "pending"
  const isTableLoading = isFormsLoading

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
            Browse your forms and open one in the builder.
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

      <div className="overflow-hidden rounded-lg border bg-background">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  Loading forms...
                </td>
              </tr>
            ) : formsError ? (
              <tr>
                <td className="px-4 py-6 text-destructive" colSpan={4}>
                  Failed to load forms.
                </td>
              </tr>
            ) : forms && forms.length > 0 ? (
              forms.map((form) => (
                <tr key={form.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4 font-medium">{form.title}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {form.description || "No description"}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/forms/${form.id}`}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  No forms yet. Create your first form to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}