"use client"

import type { ProcessStepDTO } from "../../types/process"
import ApprovalStepEditor from "./step-editors/ApprovalStepEditor"
import NotifyStepEditor from "./step-editors/NotifyStepEditor"
import ConditionStepEditor from "./step-editors/ConditionStepEditor"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface StepEditorProps {
  step: ProcessStepDTO
  allSteps: ProcessStepDTO[]
  onUpdateStep: (updatedStep: ProcessStepDTO) => void
}

export default function StepEditor({ step, allSteps, onUpdateStep }: StepEditorProps) {
  // Update basic step properties
  const updateBasicProperties = (name: string, stepType: "NOTIFY" | "APPROVAL" | "CONDITION") => {
    // Create a new step object based on the type
    let updatedStep: any = { ...step, name, stepType }

    // Add type-specific properties if changing type
    if (stepType !== step.stepType) {
      if (stepType === "APPROVAL") {
        updatedStep = {
          name,
          stepType: "APPROVAL",
          validatorRoles: [],
          requiredApproval: "ANY",
        }
      } else if (stepType === "NOTIFY") {
        updatedStep = {
          name,
          stepType: "NOTIFY",
          recipients: [],
          message: "",
        }
      } else if (stepType === "CONDITION") {
        updatedStep = {
          name,
          stepType: "CONDITION",
          condition: [],
        }
      }
    }

    onUpdateStep(updatedStep)
  }

  return (
    <div className="space-y-6">
      {/* Basic properties for all step types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="step-name">Step Name</Label>
          <Input
            id="step-name"
            value={step.name}
            onChange={(e) => updateBasicProperties(e.target.value, step.stepType)}
          />
        </div>
        <div>
          <Label htmlFor="step-type">Step Type</Label>
          <Select
            value={step.stepType}
            onValueChange={(value: "NOTIFY" | "APPROVAL" | "CONDITION") => updateBasicProperties(step.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select step type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NOTIFY">NOTIFY</SelectItem>
              <SelectItem value="APPROVAL">APPROVAL</SelectItem>
              <SelectItem value="CONDITION">CONDITION</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Type-specific editors */}
      {step.stepType === "APPROVAL" && <ApprovalStepEditor step={step} onUpdateStep={onUpdateStep} />}

      {step.stepType === "NOTIFY" && <NotifyStepEditor step={step} onUpdateStep={onUpdateStep} />}

      {step.stepType === "CONDITION" && (
        <ConditionStepEditor step={step} allSteps={allSteps} onUpdateStep={onUpdateStep} />
      )}
    </div>
  )
}
