import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useSubmissionStore } from "@/store/requestStore"
import { useDialogStateStore } from "@/store/DialogStateStore"
import type { ProcessDefinitionDTO } from "@/types/process"
import SubmitForm from "../AddRequest/submitForm"



interface RequestCardProps {
  request: ProcessDefinitionDTO
  index: number
}

export default function RequestCard({ request, index }: RequestCardProps) {
  const [open, setOpen] = useState(false)
  const updateProcessDefinitionId = useSubmissionStore((state) => state.updateProcessDefenitionId)
  const submissionDialog = useDialogStateStore((state) => state.submissionDialog)
  const setSubmissionDialog = useDialogStateStore((state) => state.setSubmissionDialog)
  const setToastState = useDialogStateStore((state) => state.setToastState)

  function handleOpen() {
    updateProcessDefinitionId(request.id!)
    setOpen(true)
    setSubmissionDialog(true)
  }

  useEffect(() => {
    if (submissionDialog === false && open === true) {
      setOpen(false)
    }
    
  }, [submissionDialog, open])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="h-full flex flex-col justify-between overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="p-6 flex-grow">
            <div className="h-1.5 w-12 bg-primary mb-4 rounded-full" />
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{request.name}</h2>
            <p className="text-muted-foreground text-sm mb-4">No description available</p>
          </div>
          <div className="p-4 border-t border-border/50 bg-muted/30">
            <Button
              onClick={handleOpen}
              variant="ghost"
              className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Add Request
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <SubmitForm formSchemaId={request.formTemplate?.id!} requestName={request.name!} />
        </DialogContent>
      </Dialog>
    </>
  )
}
