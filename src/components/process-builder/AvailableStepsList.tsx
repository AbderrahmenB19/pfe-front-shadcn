

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
          className="p-3 bg-secondary rounded-md mb-2 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onAddStep(step)}
        >
          <div className="flex items-center justify-between">
            <span>{step.name}</span>
            <Badge>{step.stepType}</Badge>
          </div>
        </div>
      ))}
      <div className="mt-4 text-sm text-muted-foreground">Click on a step to add it to the process flow</div>
    </div>
  )
}
