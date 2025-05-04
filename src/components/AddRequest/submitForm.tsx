"use client"

import { useEffect, useState } from "react"
import { Alert } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { RenderForm } from "@/components/renderForm/renderForm"
import { formApi } from "../../apisTesting/testingApis"
import { useSubmissionStore } from "../../store/requestStore"
import type { FormSchemaDTO } from "../../api"

interface SubmitFormProps {
  formSchemaId: number
  RequestName: string
}

const SubmitForm = ({ formSchemaId, RequestName }: SubmitFormProps) => {
  const [jsonTemplate, setJsonTemplate] = useState<FormSchemaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const submissionRequest = useSubmissionStore((state) => state.selectedSubmission)
  const setSelectedSubmission = useSubmissionStore((state) => state.setSelectedSubmission)

  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        console.log("id")
        const response = await formApi.getFormSchema(formSchemaId)
        setJsonTemplate(response.data)
      } catch (err) {
        console.error("Error fetching form schema:", err)
        setError("🚫 Failed to load form. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFormSchema()
  }, [formSchemaId])

  const handleSave = async () => {
    try {
      const api =await formApi.submitForm(submissionRequest!)
      console.log ("ur response", api)
      setSelectedSubmission({}) 
    } catch (err) {
      console.log("Error submitting form:", err)
      setError("🚫 Failed to submit form. Please try again later.")
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
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
      <div className="max-w-xl mx-auto p-6">
        <Alert variant="destructive">{error}</Alert>
      </div>
    )
  }

  if (!jsonTemplate) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <Alert variant="default">⚠️ No form template available</Alert>
      </div>
    )
  }

  return (
    <div style={{height:"auto"}} className="max-w-3xl mx-auto px-4 py-8">
      <h5 className="text-3xl font-bold text-primary mb-6 border-b border-primary pb-2">
        Request: {RequestName}
      </h5>

      <RenderForm
        formSchema={jsonTemplate.jsonSchema}
        loading={false}
        error={null}
        onSubmit={handleSave}
        readOnly={false}
        data={null}
        successMessage="✅ Form submitted successfully!"
      />
    </div>
  )
}

export default SubmitForm
