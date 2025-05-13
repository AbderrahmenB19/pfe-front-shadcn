

import { Badge } from "../ui/badge"

interface AvailableStepsListProps {
  onAddStep: (step: any) => void
}

export default function AvailableStepsList({ onAddStep }: AvailableStepsListProps) {
  const availableSteps = [
    {
      name: "Notification Step",
      stepType: "NOTIFY",
      recipients: [],
      message: "Notification message",
    },
    {
      name: "Approval Step",
      stepType: "APPROVAL",
      validatorRoles: [],
      requiredApproval: "ANY",
    },
    {
      name: "Condition Step",
      stepType: "CONDITION",
      condition: [],
    },
  ]

  return (
    <div className="space-y-2">
      {availableSteps.map((step, index) => (
        <div
          key={`available-${index}`}
          className={`
            p-3 rounded-md mb-2 cursor-pointer transition-colors
            ${step.stepType === "NOTIFY" ? "bg-blue-50 border border-blue-200 hover:bg-blue-100" : ""}
            ${step.stepType === "APPROVAL" ? "bg-green-50 border border-green-200 hover:bg-green-100" : ""}
            ${step.stepType === "CONDITION" ? "bg-amber-50 border border-amber-200 hover:bg-amber-100" : ""}
          `}
          onClick={() => onAddStep(step)}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{step.name}</span>
            <Badge
              className={`
                ${step.stepType === "NOTIFY" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                ${step.stepType === "APPROVAL" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                ${step.stepType === "CONDITION" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""}
              `}
            >
              {step.stepType}
            </Badge>
          </div>
        </div>
      ))}
      <div className="mt-4 text-sm text-muted-foreground">Click on a step to add it to the process flow</div>
    </div>
  )
}
