

import { useEffect, useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

import { ProcessDashboard } from "../../../components/MyRequest/MyRequest"
import { ReportDTO } from "../../../api"
import { processApi } from "../../../apisTesting/testingApis"

const MyRequestPage = () => {
  const [myRequests, setMyRequests] = useState<ReportDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await processApi.getUserReports()
        if (response.data) {
          setMyRequests(response.data)
          console.log("My Requests:", response.data)
        } else {
          setError("No data received from server")
        }
      } catch (error) {
        console.error("Error fetching My Requests:", error)
        setError("Failed to fetch My Requests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMyRequests()
  }, [])

  const handleCancelRequest = async (requestId: number) => {
    try {
      setLoading(true)
      await processApi.cancelRequest(requestId)
      setMyRequests(prev => prev.filter(request => request.processInstanceId !== requestId))
    } catch (error) {
      console.error("Error canceling request:", error)
      setError("Failed to cancel request. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filteredProcesses = myRequests.filter((process) => {
    const statusMatch = statusFilter === 'ALL' || process.currentStatus === statusFilter
    const applicationTypeMatch = process.processDefinitionName!.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && applicationTypeMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error || myRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-2" />
            <CardTitle>No Processes Available</CardTitle>
            <CardDescription>
              {error
                ? error
                : "You don’t have any requests yet. Start a new one to see it listed here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by application type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dashboard */}
      <ProcessDashboard
        processes={filteredProcesses}
        onCancelRequest={handleCancelRequest}
        loading={loading}
      />
    </div>
  )
}

export default MyRequestPage
