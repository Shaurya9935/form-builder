import Link from "next/link"
import { Button } from "~/components/ui/button"

type FormBuilderPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Form Builder</h1>
          <p className="text-sm text-muted-foreground">
            Editing form {id}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/forms">Back to forms</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        Builder UI for this form goes here.
      </div>
    </div>
  )
}
