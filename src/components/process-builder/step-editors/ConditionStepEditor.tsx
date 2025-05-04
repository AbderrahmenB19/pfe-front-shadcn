

import { useState } from "react"
import type { ConditionStepDTO, ConditionDTO, ProcessStepDTO } from "../../../types/process"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { PlusCircle, Trash2 } from "lucide-react"

interface ConditionStepEditorProps {
  step: ConditionStepDTO
  allSteps: ProcessStepDTO[]
  onUpdateStep: (updatedStep: ConditionStepDTO) => void
}

export default function ConditionStepEditor({ step, allSteps, onUpdateStep }: ConditionStepEditorProps) {
  const [newCondition, setNewCondition] = useState<ConditionDTO>({
    condition: "",
    targetStep: "",
  })

  // Add a condition
  const addCondition = () => {
    if (!newCondition.condition.trim() || !newCondition.targetStep.trim()) return

    onUpdateStep({
      ...step,
      condition: [...step.condition, { ...newCondition }],
    })
    setNewCondition({ condition: "", targetStep: "" })
  }

  // Remove a condition
  const removeCondition = (index: number) => {
    const updatedConditions = [...step.condition]
    updatedConditions.splice(index, 1)

    onUpdateStep({
      ...step,
      condition: updatedConditions,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Conditions</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              placeholder="e.g. status == 'APPROVED'"
              value={newCondition.condition}
              onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  condition: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="target-step">Target Step</Label>
            <Select
              value={newCondition.targetStep}
              onValueChange={(value) =>
                setNewCondition({
                  ...newCondition,
                  targetStep: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target step" />
              </SelectTrigger>
              <SelectContent>
                {allSteps.map((step, index) => (
                  <SelectItem key={index} value={step.name}>
                    {step.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={addCondition}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Condition
        </Button>

        <div className="space-y-2 mt-4">
          {step.condition.map((cond, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <div>
                <span className="font-medium">If:</span> {cond.condition}
                <br />
                <span className="font-medium">Then go to:</span> {cond.targetStep}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCondition(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {step.condition.length === 0 && <p className="text-muted-foreground">No conditions added yet</p>}
        </div>
      </div>
    </div>
  )
}
