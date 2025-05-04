

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import StepItem from "./StepItem"
import type { ProcessStepDTO } from "../../types/process"

interface StepsListProps {
  steps: ProcessStepDTO[]
  selectedStepIndex: number | null
  onSelectStep: (index: number) => void
  onDeleteStep: (index: number) => void
  onReorderSteps: (steps: ProcessStepDTO[]) => void
}

export default function StepsList({
  steps,
  selectedStepIndex,
  onSelectStep,
  onDeleteStep,
  onReorderSteps,
}: StepsListProps) {
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((_, i) => `step-${i}` === active.id)
      const newIndex = steps.findIndex((_, i) => `step-${i}` === over.id)

      const newSteps = arrayMove(steps, oldIndex, newIndex)
      onReorderSteps(newSteps)

      // Update selected step index if it was moved
      if (selectedStepIndex === oldIndex) {
        onSelectStep(newIndex)
      } else if (
        selectedStepIndex !== null &&
        ((selectedStepIndex > oldIndex && selectedStepIndex <= newIndex) ||
          (selectedStepIndex < oldIndex && selectedStepIndex >= newIndex))
      ) {
        // Adjust selected index if it was affected by the move
        onSelectStep(
          selectedStepIndex > oldIndex && selectedStepIndex <= newIndex ? selectedStepIndex - 1 : selectedStepIndex + 1,
        )
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <div className="min-h-[300px]">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Click on steps from the left panel to add them here</p>
          </div>
        ) : (
          <SortableContext items={steps.map((_, i) => `step-${i}`)}>
            {steps.map((step, index) => (
              <StepItem
                key={`step-${index}`}
                id={`step-${index}`}
                step={step}
                index={index}
                isSelected={selectedStepIndex === index}
                onSelect={() => onSelectStep(index)}
                onDelete={() => onDeleteStep(index)}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </DndContext>
  )
}
