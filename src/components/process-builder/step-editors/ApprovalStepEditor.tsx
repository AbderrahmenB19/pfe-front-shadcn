
import { useEffect, useState } from "react"
import type { ApprovalStepDTO, FormTemplateDTO } from "../../../types/process"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { FormSchemaDTO } from "@/api"

import { formApi } from "@/apisTesting/testingApis"




interface ApprovalStepEditorProps {
  step: ApprovalStepDTO
  onUpdateStep: (updatedStep: ApprovalStepDTO) => void
}

export default function ApprovalStepEditor({ step, onUpdateStep }: ApprovalStepEditorProps) {
  const [newRole, setNewRole] = useState("")
  const [formTemplates, setFormTemplates]= useState<FormSchemaDTO[]>([])
  useEffect(()=>{
    const fetchTemplates= async ()=>{
      try{
        const response = await formApi.getAllFormSchemas()
      setFormTemplates(response.data)
      }catch(eror){
        console.log(eror)
      }
    }
    fetchTemplates()
  },[])

  // Add a validator role
  const addValidatorRole = () => {
    if (!newRole.trim()) return

    onUpdateStep({
      ...step,
      validatorRoles: [...step.validatorRoles, newRole.trim()],
    })
    setNewRole("")
  }

  // Remove a validator role
  const removeValidatorRole = (index: number) => {
    const updatedRoles = [...step.validatorRoles]
    updatedRoles.splice(index, 1)

    onUpdateStep({
      ...step,
      validatorRoles: updatedRoles,
    })
  }

  // Handle form template selection
  const handleFormTemplateChange = (templateId: string) => {
    const selectedTemplate = formTemplates.find((template) => template.id === Number.parseInt(templateId))
    const temp: FormTemplateDTO={
      id: selectedTemplate?.id!,
      name: selectedTemplate?.name!
    }

    onUpdateStep({
      ...step,
      formTemplate: temp,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="required-approval">Required Approval</Label>
          <Select
            value={step.requiredApproval}
            onValueChange={(value) =>
              onUpdateStep({
                ...step,
                requiredApproval: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approval type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">ANY</SelectItem>
              <SelectItem value="ALL">ALL</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="form-template">Form Template</Label>
          <Select value={step.formTemplate?.id?.toString() || ""} onValueChange={handleFormTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a form template" />
            </SelectTrigger>
            <SelectContent>
              {formTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id!.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Validator Roles</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add validator role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addValidatorRole()
              }
            }}
          />
          <Button onClick={addValidatorRole}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {step.validatorRoles.map((role, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>{role}</span>
              <Button variant="ghost" size="icon" onClick={() => removeValidatorRole(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {step.validatorRoles.length === 0 && <p className="text-muted-foreground">No validator roles added yet</p>}
        </div>
      </div>
    </div>
  )
}
