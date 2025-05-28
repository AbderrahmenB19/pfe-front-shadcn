
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { GripVertical, Trash2, ChevronRight } from "lucide-react"
import type { ProcessStepDTO, ConditionDTO } from "../../types/process"
import { formApi } from "@/api/testingApis"

import React from "react"

interface StepItemProps {
  id: string
  step: ProcessStepDTO
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export default function StepItem({ id, step, isSelected, onSelect, onDelete }: StepItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Get conditions based on step type
  const getConditions = (): ConditionDTO[] => {
    if (step.stepType === "CONDITION") {
      return step.condition
    }
    return []
  }

  const conditions = getConditions()
  const  fetchStepTemplateName= async (formId: number)=>{
    try{
      const res= await formApi.getFormSchema(formId)
      return res.data.name
    }catch(eror){
      console.log(eror)
    }
  }

  
  const getFormTemplateName = async ()  => {
    if (step.stepType === "APPROVAL" && step.formTemplate?.id) {
      return await fetchStepTemplateName(step.formTemplate.id)
    }
    return null
  }

  const [formTemplateName, setFormTemplateName] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchTemplate = async () => {
      const name = await getFormTemplateName()
      setFormTemplateName(name)
    }
  
    fetchTemplate()
  }, [step])

  // Get step type specific styling
  const getStepTypeStyles = () => {
    switch (step.stepType) {
      case "NOTIFY":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "APPROVAL":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "CONDITION":
        return "bg-amber-50 border-amber-200 hover:bg-amber-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-md border mb-2 transition-all duration-200 ${getStepTypeStyles()} ${isSelected ? "ring-2 ring-primary border-primary" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">{step.name}</h3>
            <div className="flex gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={`
                  ${step.stepType === "NOTIFY" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                  ${step.stepType === "APPROVAL" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  ${step.stepType === "CONDITION" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""}
                `}
              >
                {step.stepType}
              </Badge>
              {formTemplateName && <Badge variant="secondary">{formTemplateName}</Badge>}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {conditions.length > 0 && (
        <div className="mt-2 pt-2 border-t ml-7">
          <p className="text-sm font-medium mb-1">Conditions:</p>
          <div className="space-y-1">
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="text-muted-foreground">{cond.condition}</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span>{cond.targetStep}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


