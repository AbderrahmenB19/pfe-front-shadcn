
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RenderForm } from "../renderForm/renderForm"
import type { FormSchemaDTO, ProcessInstanceDTO } from "../../api"
import { formApi } from "../../apisTesting/testingApis"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RequestDetailsDialogProps {
  open: boolean
  onClose: () => void
  request: ProcessInstanceDTO
  tabValue: number
  onApprove?: () => void
  onReject?: (comment: string) => void
  onSubmit?: (submission: any) => void
}

export const RequestDetailsDialog = ({
  open,
  onClose,
  request,
  tabValue,
  onApprove,
  onReject,
  onSubmit = () => {},
}: RequestDetailsDialogProps) => {
  const [formSchema, setFormSchema] = useState<FormSchemaDTO>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectComment, setRejectComment] = useState("")
  const [actionInProgress, setActionInProgress] = useState(false)
  const [actionResult, setActionResult] = useState<{
    success: boolean
    message: string
    action: string
  } | null>(null)

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
      } finally {
        setLoading(false)
      }
    }

    if (open && request?.formId) {
      fetchForm()
      setActionResult(null)
      setActionInProgress(false)
    }
  }, [open, request?.formId])

  const handleRejectConfirm = async () => {
    if (!rejectComment.trim()) {
      setError("Please provide a reason for rejection")
      return
    }

    setActionInProgress(true)

    try {
      if (onReject) {
        onReject(rejectComment)
      }

      setActionResult({
        success: true,
        message: "Request has been rejected successfully",
        action: "rejected",
      })
    } catch (error) {
      console.error("Error rejecting request:", error)
      setActionResult({
        success: false,
        message: "Failed to reject the request. Please try again.",
        action: "reject",
      })
    } finally {
      setActionInProgress(false)
      setShowRejectDialog(false)
      setRejectComment("")
    }
  }

  const handleApprove = async () => {
    setActionInProgress(true)

    try {
      if (onApprove) {
        onApprove()
      }

      setActionResult({
        success: true,
        message: "Request has been approved successfully",
        action: "approved",
      })
    } catch (error) {
      console.error("Error approving request:", error)
      setActionResult({
        success: false,
        message: "Failed to approve the request. Please try again.",
        action: "approve",
      })
    } finally {
      setActionInProgress(false)
    }
  }

  if (!request) return null

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Request Details
              <span className="text-sm font-normal text-muted-foreground">(REQ-{request.processName})</span>
            </DialogTitle>
          </DialogHeader>

          {request.rejectionComment && (
            <div className="w-full mb-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Rejection Reason</AlertTitle>
                <AlertDescription>{request.rejectionComment}</AlertDescription>
              </Alert>
            </div>
          )}

          {actionResult && (
            <div className="w-full mb-4">
              <Alert variant={actionResult.success ? "default" : "destructive"}>
                {actionResult.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{actionResult.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{actionResult.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Request Information</CardTitle>
              <CardDescription>
                Submitted on {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "--"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <RenderForm
                formSchema={formSchema.jsonSchema}
                loading={loading}
                error={error}
               
                readOnly={true}
                data={request.formData}
              />
            </CardContent>

            {/* Approve/Reject buttons for pending requests */}
            {tabValue === 0 && !actionResult && (
              <CardFooter className="flex justify-end gap-4 px-0 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={actionInProgress}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setShowRejectDialog(true)} disabled={actionInProgress}>
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={actionInProgress}
                >
                  {actionInProgress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Approve"
                  )}
                </Button>
              </CardFooter>
            )}

            {/* Close button for approved/rejected requests or after action */}
            {(tabValue !== 0 || actionResult) && (
              <CardFooter className="flex justify-end px-0 pt-4 border-t">
                <Button onClick={onClose}>Close</Button>
              </CardFooter>
            )}
          </Card>
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
              className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter rejection comment..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setError(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm} disabled={actionInProgress}>
                {actionInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Reject"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
