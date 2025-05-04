
import { useEffect, useState } from "react"
import type { FormTemplateDTO, ProcessDefinitionDTO } from "../../types/process"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FormSchemaDTO } from "@/api"
import { formApi } from "@/apisTesting/testingApis"


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
      id: selectedTemplate?.id! ,
      name: selectedTemplate?.name!

    }

    updateProcessDefinition({
      ...processDefinition,
      formTemplate: temp,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="process-name">Process Name</Label>
        <Input
          id="process-name"
          value={processDefinition.name}
          onChange={(e) =>
            updateProcessDefinition({
              ...processDefinition,
              name: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="form-template">Form Template</Label>
        <Select value={processDefinition.formTemplate?.id?.toString() || ""} onValueChange={handleFormTemplateChange}>
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
  )
}
