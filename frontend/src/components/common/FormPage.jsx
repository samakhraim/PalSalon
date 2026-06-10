import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FormRenderer from "@/components/common/FormRenderer"
import PageHeader from "@/components/common/PageHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormPage({
  title,
  description,
  fields,
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  loading = false,
  error = "",
  mode = "create",
  transformValues,
  hideFormOnError = false,
  formTitle = "Details",
  formDescription,
}) {
  if (loading) {
    return <Skeleton className="h-[420px] w-full rounded-xl" />
  }

  const shouldRenderForm = !(hideFormOnError && error)

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shouldRenderForm && (
        <Card>
          <CardHeader>
            <CardTitle>{formTitle}</CardTitle>
            {formDescription && <CardDescription>{formDescription}</CardDescription>}
          </CardHeader>
          <CardContent>
            <FormRenderer
              fields={fields}
              initialValues={initialValues}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              mode={mode}
              transformValues={transformValues}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
