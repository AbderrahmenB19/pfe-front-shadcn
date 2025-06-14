

import { useState } from "react"
import type { NotifyStepDTO } from "../../../types/process"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"

interface NotifyStepEditorProps {
  step: NotifyStepDTO
  onUpdateStep: (updatedStep: NotifyStepDTO) => void
}

export default function NotifyStepEditor({ step, onUpdateStep }: NotifyStepEditorProps) {
  const [newRecipient, setNewRecipient] = useState("")

  const addRecipient = () => {
    if (!newRecipient.trim()) return

    onUpdateStep({
      ...step,
      recipients: [...step.recipients, newRecipient.trim()],
    })
    setNewRecipient("")
  }

    const removeRecipient = (index: number) => {
    const updatedRecipients = [...step.recipients]
    updatedRecipients.splice(index, 1)

    onUpdateStep({
      ...step,
      recipients: updatedRecipients,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Recipients</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add recipient email"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addRecipient()
              }
            }}
          />
          <Button onClick={addRecipient}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {step.recipients.map((email, index) => (
            <div key={email} className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>{email}</span>
              <Button variant="ghost" size="icon" onClick={() => removeRecipient(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {step.recipients.length === 0 && <p className="text-muted-foreground">No recipients added yet</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={step.message}
          onChange={(e) =>
            onUpdateStep({
              ...step,
              message: e.target.value,
            })
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
