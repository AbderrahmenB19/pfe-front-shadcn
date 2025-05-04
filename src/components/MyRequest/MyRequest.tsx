"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  CalendarDays,
  Flag,
  X,
  Eye,
  Trash2,
} from "lucide-react"

import type { ReportDTO } from "../../api"
import { Badge } from "@/components/ui/badge"
import { CustomizedTimeline } from "../customizedTimeLine/customizedTimeline"

interface ProcessDashboardProps {
  processes: ReportDTO[]
  onCancelRequest: (id: number) => void
  loading: boolean
}

type ProcessStatus = "APPROVED" | "REJECTED" | "PENDING" | "CANCELLED" | "DEFAULT"

const statusConfig = {
  "APPROVED": {
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    color: "bg-green-100 text-green-800",
    label: "Approved",
  },
  "REJECTED": {
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    color: "bg-red-100 text-red-800",
    label: "Rejected",
  },
  "PENDING": {
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  "CANCELLED": {
    icon: <X className="w-4 h-4 text-gray-500" />,
    color: "bg-gray-100 text-gray-800",
    label: "Cancelled",
  },
  "DEFAULT": {
    icon: <Clock className="w-4 h-4 text-gray-500" />,
    color: "bg-gray-100 text-gray-800",
    label: "Unknown",
  },
} as const


const isValidStatus = (status: string): status is ProcessStatus => {
  return status in statusConfig
}

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
      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {processes.map((process) => {
          const status = isValidStatus(process.currentStatus!) 
            ? process.currentStatus 
            : "DEFAULT"
          const currentStatus = statusConfig[status]

          return (
            <Card
              key={process.processInstanceId}
              className={`border-l-4 ${
                status === "APPROVED"
                  ? "border-green-500"
                  : status === "REJECTED"
                  ? "border-red-500"
                  : "border-yellow-500"
              }`}
            >
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <Flag className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">{process.processName}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Assignee:</span>
                  <div className="flex items-center ml-2">
                    <Avatar className="w-6 h-6 mr-2">
                      <User className="w-3 h-3" />
                    </Avatar>
                    <span className="text-sm">You</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm ml-2">
                    {process.startTime
                      ? new Date(process.startTime).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  {currentStatus.icon}
                  <span className="text-sm text-muted-foreground ml-2">Status:</span>
                  <Badge className={`ml-2 ${currentStatus.color}`}>
                    {currentStatus.label}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                {status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
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
                  onClick={() => handleOpenDialog(process)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

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