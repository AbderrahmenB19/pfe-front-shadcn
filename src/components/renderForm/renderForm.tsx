import { Form } from "@formio/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubmissionStore } from "@/store/requestStore"
import "formiojs/dist/formio.full.min.css"
import { useDialogStateStore } from "@/store/DialogStateStore"
import { Toaster, toast } from "sonner";


interface RenderFormProps {
  formSchema: any
  loading: boolean
  error: string | null
  
  title?: string
  readOnly?: boolean
  data?: any
  onChange?: (data: any) => void
}

export function RenderForm({
  formSchema,
  loading,
  error,
  
  title,
  readOnly = false,
  data = null,
  onChange,
}: RenderFormProps) {
  const parsedFormSchema = typeof formSchema === "string" ? JSON.parse(formSchema) : formSchema
  const updateFormDataSubmission = useSubmissionStore((state) => state.updateFormData)
  const saveRequest = useSubmissionStore((state) => state.submitForm)
  const setSubmissionDialog = useDialogStateStore((state) => state.setSubmissionDialog)
  const setToastState = useDialogStateStore((state) => state.setToastState)

  const handleSubmit = (submission: any) => {
    console.log("submission", submission.data)
    updateFormDataSubmission(JSON.stringify(submission.data))
    saveRequest().then(() => {
      setSubmissionDialog(false);
      setToastState({
        open: true,message: "Form submitted successfully", status: "success"
      })
    }).catch((error) => {
      setToastState({
        open: true,message: "Error submitting form: "+error ,status: "error"
      })
    });
    
    
      
    
    
  }

  return (
    <Card className="w-full shadow-sm">
      {title && (
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-primary">{title}</CardTitle>
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && !parsedFormSchema ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : parsedFormSchema ? (
          <div className="formio-wrapper [&_.form-control]:bg-white [&_.form-control]:border [&_.form-control]:rounded-md [&_.form-control]:px-3 [&_.form-control]:py-2 [&_.form-control]:text-sm [&_.form-control]:shadow-sm [&_.form-control:focus]:border-primary [&_.form-control:focus]:ring-2 [&_.form-control:focus]:ring-primary">
            <Form
              form={parsedFormSchema}
              onSubmit={handleSubmit}
              onChange={onChange}
              submission={{
                data: data ? JSON.parse(data) : {},
              }}
              options={{
                readOnly,
                noAlerts: true,
                i18n: {
                  en: {
                    error: "Please fix the following errors before submitting.",
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No form schema available.</p>
        )}
      </CardContent>
    </Card>
  )
}
