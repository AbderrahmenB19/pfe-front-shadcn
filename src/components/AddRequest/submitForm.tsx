

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { formApi } from "@/apisTesting/testingApis"
import { useSubmissionStore } from "@/store/requestStore"
import { useDialogStateStore } from "@/store/DialogStateStore"


import { CheckCircle2 } from "lucide-react"
import { FormSchemaDTO } from "@/api"
import { RenderForm } from "../renderForm/renderForm"

interface SubmitFormProps {
  formSchemaId: number
  requestName: string
}

export default function SubmitForm({ formSchemaId, requestName }: SubmitFormProps) {
  const [jsonTemplate, setJsonTemplate] = useState<FormSchemaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const submissionRequest = useSubmissionStore((state) => state.selectedSubmission)
  const setSubmissionDialog = useDialogStateStore((state) => state.setSubmissionDialog)

  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        const response = await formApi.getFormSchema(formSchemaId)
        setJsonTemplate(response.data)
      } catch (err) {
        console.error("Error fetching form schema:", err)
        setError("Failed to load form. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFormSchema()
  }, [formSchemaId])

  const handleSave = async () => {
    try {
      await formApi.submitForm(submissionRequest!)
      setSuccess(true)
      // Close dialog after showing success message for 2 seconds
      setTimeout(() => {
        setSubmissionDialog(false)
      }, 2000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to submit form. Please try again later.")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-10 w-1/4 mt-4" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">{error}</Alert>
      </div>
    )
  }

  if (!jsonTemplate) {
    return (
      <div className="p-6">
        <Alert>No form template available</Alert>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h5 className="text-2xl font-bold text-primary mb-6 border-b border-primary pb-2">Request: {requestName}</h5>

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Form submitted successfully!</AlertDescription>
        </Alert>
      )}

      <RenderForm
        formSchema={jsonTemplate.jsonSchema}
        loading={false}
        error={null}
        onSubmit={handleSave}
        readOnly={false}
      />
    </div>
  )
}
