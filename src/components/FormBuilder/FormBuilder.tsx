import { useState, useEffect, useRef } from "react"
import { FormBuilder as FormioFormBuilderComponent } from "@formio/react"
import type { FormBuilder as FormioFormBuilderType } from "@formio/js"
import "formiojs/dist/formio.full.min.css"
import { useFormStore } from "../../store/formStore"
import { useNavigate } from "react-router-dom"
import { formApi } from "../../api/testingApis"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Template {
  id?: number
  name?: string
  description?: string
  jsonSchema: string
}

interface FormType {
  display: string
  components: any[]
}

interface FeedbackMessage {
  type: "success" | "error"
  title: string
  message: string
}

export default function AdminFormBuilder() {
  const [formSchema, setFormSchema] = useState<FormType>({ display: "form", components: [] })
  const selectedTemplate = useFormStore((state) => state.selectedForm as Template)
  const setSelectedTemplate = useFormStore((state) => state.setSelectedForm)
  const navigate = useNavigate()
  const builderRef = useRef<FormioFormBuilderType | null>(null)
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedTemplate?.jsonSchema) {
      try {
        const parsedSchema = JSON.parse(selectedTemplate.jsonSchema)
        setFormSchema(parsedSchema)

        if (builderRef.current) {
          builderRef.current.setForm(parsedSchema)
        }
      } catch (error) {
        console.error("Error parsing form schema:", error)
        setFeedback({
          type: "error",
          title: "Error",
          message: "Failed to parse form schema",
        })
      }
    } else {
      setFormSchema({ display: "form", components: [] })
    }
  }, [selectedTemplate])

 
  useEffect(() => {
    if (feedback?.type === "success") {
      const timer = setTimeout(() => {
        setFeedback(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleBuilderReady = (builder: FormioFormBuilderType) => {
    builderRef.current = builder
    if (formSchema) {
      builder.setForm(formSchema)
    }
  }

  const handleSave = async () => {
    if (!formSchema || formSchema.components.length === 0) {
      setFeedback({
        type: "error",
        title: "Error",
        message: "Please create a form first",
      })
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const updatedTemplate = {
        ...selectedTemplate,
        jsonSchema: JSON.stringify(formSchema),
      }

      const response = updatedTemplate.id
        ? await formApi.updateFormSchema(updatedTemplate)
        : await formApi.saveFormSchema(updatedTemplate)

      setFeedback({
        type: "success",
        title: "Success",
        message: "Form saved successfully!",
      })

      setTimeout(() => {
        setSelectedTemplate({})
        navigate("/form-templates")
      }, 1500)
    } catch (error) {
      console.error("Error saving form:", error)
      setFeedback({
        type: "error",
        title: "Error",
        message: `Failed to save form: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedTemplate({})
    navigate("/form-templates")
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {selectedTemplate?.id ? "Edit Form Template" : "Create New Form Template"}
          </CardTitle>
          {selectedTemplate?.name && <p className="text-muted-foreground">{selectedTemplate.name}</p>}
        </CardHeader>
        <CardContent>
          {feedback && (
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
              className={`mb-4 ${feedback.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}`}
            >
              {feedback.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle>{feedback.title}</AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4">
            <FormioFormBuilderComponent
              form={formSchema}
              onChange={(schema: FormType) => {
                setFormSchema(schema)
              }}
              onBuilderReady={handleBuilderReady}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? "Saving..." : "Save Form"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
