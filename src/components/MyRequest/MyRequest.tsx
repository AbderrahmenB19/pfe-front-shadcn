

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  CalendarDays,
  Eye,
  Trash2,
} from "lucide-react"
import type { ReportDTO } from "../../api"
import { CustomizedTimeline } from "../customizedTimeLine/customizedTimeline"
import { Avatar } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProcessDashboardProps {
  processes: ReportDTO[]
  onCancelRequest: (id: number) => void
  loading: boolean
}

type ProcessStatus = "APPROVED" | "REJECTED" | "PENDING" | "CANCELLED" | "DEFAULT"

const statusConfig: Record<
  ProcessStatus,
  { icon: JSX.Element; color: string; label: string }
> = {
  APPROVED: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-800",
    label: "Approved",
  },
  REJECTED: {
    icon: <XCircle className="w-4 h-4" />,
    color: "bg-rose-100 text-rose-800",
    label: "Rejected",
  },
  PENDING: {
    icon: <Clock className="w-4 h-4" />,
    color: "bg-amber-100 text-amber-800",
    label: "Pending",
  },
  CANCELLED: {
    icon: <XCircle className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-800",
    label: "Cancelled",
  },
  DEFAULT: {
    icon: <Clock className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-800",
    label: "Unknown",
  },
} as const

const isValidStatus = (status: string): status is ProcessStatus => {
  return status in statusConfig
}

const formatDate = (date?: string | Date) => 
  date ? new Date(date).toLocaleDateString() : "--"

export const ProcessDashboard: React.FC<ProcessDashboardProps> = ({
  processes,
  onCancelRequest,
  loading,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<ReportDTO | null>(null)

  const handleOpenDialog = (process: ReportDTO) => setSelectedProcess(process)
  const handleCloseDialog = () => setSelectedProcess(null)

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

  return (
    <div className="w-full p-6 space-y-6">
      

      {processes.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border">
          <p className="text-muted-foreground">No processes found</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-x-auto shadow-lg bg-white/50 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-gradient-to-b from-gray-50 to-gray-100/80">
              <TableRow className="hover:bg-transparent">
                {["Request Name", "Requester", "Submitted", "Status", "Actions"].map((header) => (
                  <TableHead key={header} className="text-gray-700 font-semibold py-4 px-6 first:rounded-tl-xl last:rounded-tr-xl">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => {
                const status = isValidStatus(process.currentStatus!) 
                  ? process.currentStatus 
                  : "DEFAULT"
                const statusInfo = statusConfig[status]

                return (
                  <TableRow key={process.processInstanceId} className="hover:bg-gray-50/50 transition-all duration-200 border-b group">
                    <TableCell className="font-semibold px-6 py-4">
                      <span className="bg-primary/5 px-2.5 py-1 rounded-md group-hover:bg-primary/10 transition-colors">
                        REQ-{process.processName}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 bg-primary/10 ring-2 ring-primary/5 flex items-center justify-center transition-all group-hover:ring-primary/20">
                          <User className="text-primary w-5 h-5" />
                        </Avatar>
                        <span className="font-medium text-gray-700">You</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600">
                      {formatDate(process.startTime)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={`gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${statusInfo.color} group-hover:shadow-sm`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2 justify-start">
                        {status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                            onClick={() => 
                              process.processInstanceId !== undefined &&
                              onCancelRequest(process.processInstanceId)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-primary/5 hover:border-primary/20 transition-colors"
                          onClick={() => handleOpenDialog(process)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedProcess} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {selectedProcess?.processName || "Process Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedProcess && (
              <CustomizedTimeline
                timelineData={selectedProcess.processHistoryDTOList || []}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}