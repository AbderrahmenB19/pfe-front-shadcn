
import { useEffect, useState } from "react"
import type { FormTemplateDTO, ProcessDefinitionDTO } from "../../types/process"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FormSchemaDTO } from "@/Models"
import { formApi } from "@/api/testingApis"


interface ProcessDefinitionFormProps {
  processDefinition: ProcessDefinitionDTO
  updateProcessDefinition: (updatedProcess: ProcessDefinitionDTO) => void
}

export default function ProcessDefinitionForm({
  processDefinition,
  updateProcessDefinition,
}: ProcessDefinitionFormProps) {
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
  
  const handleFormTemplateChange = (templateId: string) => {
    const selectedTemplate = formTemplates.find((template) => template.id === Number.parseInt(templateId))
    const temp :FormTemplateDTO ={
      id: selectedTemplate?.id!,
      name: selectedTemplate?.name!,
     
    }
    


    updateProcessDefinition({
      ...processDefinition,
      formTemplate: temp,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="process-name" className="font-medium">Process Name</Label>
        <Input
          id="process-name"
          value={processDefinition.name}
          onChange={(e) =>
            updateProcessDefinition({
              ...processDefinition,
              name: e.target.value,
            })
          }
          className="text-lg"
          placeholder="e.g. Employee Onboarding Process"
        />
        <p className="text-sm text-muted-foreground">
          Give your process a descriptive name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-template" className="font-medium">Form Template</Label>
        <Select value={processDefinition.formTemplate?.id?.toString() || ""} onValueChange={handleFormTemplateChange}>
          <SelectTrigger className="text-lg">
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
        <p className="text-sm text-muted-foreground">
          Select the form template this process will use
        </p>
      </div>
    </div>
  )
}
