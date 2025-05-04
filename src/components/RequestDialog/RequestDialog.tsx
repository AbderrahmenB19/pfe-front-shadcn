import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RenderForm } from '../renderForm/renderForm'
import { type FormSchemaDTO, type ProcessInstanceDTO } from '../../api'
import { formApi, validatorApi } from '../../apisTesting/testingApis'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"


interface RequestDetailsDialogProps {
  open: boolean
  onClose: () => void
  request: ProcessInstanceDTO
  tabValue: number
  onApprove?: () => void

  onSubmit?: (submission: any) => void
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error'
  timestamp: number
}

export const RequestDetailsDialog = ({
  open,
  onClose,
  request,
  tabValue,
  onApprove,

  onSubmit = () => { }
}: RequestDetailsDialogProps) => {
  const [formSchema, setFormSchema] = useState<FormSchemaDTO>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectComment, setRejectComment] = useState("")


  const handleRejectConfirm = async () => {
    try {
      const response = await validatorApi.rejectRequest(request.id!, rejectComment);
      console.log(response)

    } catch (error) {
      console.error("Error rejecting request:", error);
    }
    setShowRejectDialog(false)
    setRejectComment("")
    onclose

  }


  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const newNotification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
      timestamp: Date.now()
    }
    setNotifications(prev => [...prev, newNotification])
  }


  useEffect(() => {
    const fetchForm = async () => {
      if (!request?.formId) return


      try {
        setLoading(true)
        const response = await formApi.getFormSchema(request.formId)
        console.log("Form Schema:", response.data)
        setFormSchema(response.data)
      } catch (error) {
        console.error("Error fetching form schema:", error)
        setError("Failed to fetch form schema. Please try again later.")
        showNotification("Failed to fetch form schema", 'error')
      } finally {
        setLoading(false)
      }
    }


    if (request?.formId) {
      fetchForm()
    }
  }, [open, request?.formId])

  if (!request) return null

   const handleApprove =()=>{
    onclose
    onApprove
    
   }

  return (
    <div className="relative">

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-md shadow-lg ${notification.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
              }`}
          >
            <div className="flex items-center">
              <span>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            {request.rejectionComment && (
           
              <div className="w-full border-t pt-4 mt-4">
                <Alert variant="destructive">
                  <AlertTitle>Rejection Reason</AlertTitle>
                  <AlertDescription>{request.rejectionComment}</AlertDescription>
                </Alert>
              </div>
            )}
          </DialogHeader>

          <RenderForm
            formSchema={formSchema.jsonSchema}
            loading={loading}
            error={error}
            onSubmit={onSubmit}

            readOnly={true}
            data={request.formData}
          />

          {/* Approve/Reject buttons for pending requests */}
          {tabValue === 0 && (
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          )}
          
        </DialogContent>


      </Dialog>
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please provide a reason for rejection:</p>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded-md"
              placeholder="Enter rejection comment..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>

  )
}