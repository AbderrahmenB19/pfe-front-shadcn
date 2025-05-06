import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AwardIcon as ApprovedIcon,
  AngryIcon as RejectedIcon,
  CloudyIcon as PendingIcon,
  PersonStandingIcon as PersonIcon,
  ViewIcon,
} from "lucide-react"
import { RequestDetailsDialog } from "../RequestDialog/RequestDialog"
import type { ProcessInstanceDTO } from "../../api"
import { validatorApi } from "@/apisTesting/testingApis"
import { useToast } from "@/hooks/use-toast"

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

const statusConfig: Record<
  RequestStatus,
  { icon: JSX.Element; variant: "default" | "secondary" | "destructive"; label: string; color: string }
> = {
  PENDING: {
    icon: <PendingIcon className="w-4 h-4" />,
    variant: "default",
    label: "Pending",
    color: "bg-amber-500 text-white",
  },
  APPROVED: {
    icon: <ApprovedIcon className="w-4 h-4" />,
    variant: "secondary",
    label: "Approved",
    color: "bg-emerald-500 text-white",
  },
  REJECTED: {
    icon: <RejectedIcon className="w-4 h-4" />,
    variant: "destructive",
    label: "Rejected",
    color: "bg-rose-500 text-white",
  },
}

const statuses: RequestStatus[] = ["PENDING", "APPROVED", "REJECTED"]

const formatDate = (date?: string | Date) => (date ? new Date(date).toLocaleDateString() : "--")

export const RequestTable = ({
  requests,
  tabValue,
  loading,
  error,
  onRequestUpdated,
}: {
  requests: ProcessInstanceDTO[]
  tabValue: number
  loading: boolean
  error: any
  onRequestUpdated?: () => void
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ProcessInstanceDTO>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const currentStatus = statuses[tabValue] || "PENDING"

  const handleShowDetails = (request: ProcessInstanceDTO) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  const handleRequestAction = (success: boolean, action: string) => {
    if (success) {
      toast({
        title: `Request ${action}`,
        description: `The request has been successfully ${action.toLowerCase()}.`,
        variant: "default",
      })

      setDialogOpen(false)

      // Refresh the request list if callback provided
      if (onRequestUpdated) {
        onRequestUpdated()
      }
    } else {
      toast({
        title: "Action Failed",
        description: `Failed to ${action.toLowerCase()} the request. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (id: number | undefined) => {
    try {
      const response = await validatorApi.approveRequest(id!)
      console.log("Request approved:", response.data)
      handleRequestAction(true, "Approved")
    } catch (error) {
      console.error("Error approving request:", error)
      handleRequestAction(false, "Approve")
    }
  }

  const handleReject = async (id: number | undefined, comment: string) => {
    try {
      const response = await validatorApi.rejectRequest(id!, comment)
      console.log("Request rejected:", response.data)
      handleRequestAction(true, "Rejected")
    } catch (error) {
      console.error("Error rejecting request:", error)
      handleRequestAction(false, "Reject")
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-primary h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error.message || "An error occurred"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary border-b pb-2">{currentStatus} Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border">
          <p className="text-muted-foreground">No {currentStatus.toLowerCase()} requests found</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto shadow-sm">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                {["Request #", "Requester", "Submitted", "Decision Date", "Status", "Actions"].map((header) => (
                  <TableHead key={header} className="text-white text-center font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const { id, createdAt, decisionDate, status, formId } = request
                const requesterName = request.requesterName
                const reqStatus = (status as RequestStatus) || "PENDING"
                const statusInfo = statusConfig[reqStatus]
                const processName = request.processName

                return (
                  <TableRow key={id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="text-center font-semibold">REQ-{processName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 bg-primary/10">
                          <PersonIcon className="text-primary" />
                        </Avatar>
                        <span className="font-medium">{requesterName || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{formatDate(createdAt)}</TableCell>
                    <TableCell className="text-center">{formatDate(decisionDate)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`gap-1 px-3 py-1 text-sm ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShowDetails(request)}
                        className="rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        <ViewIcon className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <RequestDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        request={selectedRequest}
        tabValue={tabValue}
        onApprove={() => handleApprove(selectedRequest.id)}
        onReject={(comment) => handleReject(selectedRequest.id, comment)}
      />
    </div>
  )
}
