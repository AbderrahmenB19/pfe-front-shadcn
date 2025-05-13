import { useEffect, useState } from "react"
import { Loader2, GitPullRequestCreateIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

import { ProcessDashboard } from "../../../components/MyRequest/MyRequest"
import { ReportDTO } from "../../../api"
import { processApi } from "../../../apisTesting/testingApis"
import { PageHeader } from "@/components/ui/PageHeader"

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
      <div className="flex items-center justify-center h-[70vh] px-4">
        <div className="text-center space-y-6 max-w-lg w-full">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <GitPullRequestCreateIcon className="w-24 h-24 text-primary/40" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {error ? "Oops!" : "No Requests Yet"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {error
              ? error
              : "Your request history is empty. Start your journey by creating your first request."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {error ? (
              <Button 
                size="lg"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => window.location.href = '/request'}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                Create Your First Request
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl">
      <PageHeader 
        title="My Requests" 
        icon={<GitPullRequestCreateIcon className="h-8 w-8 text-primary" />}
        description="View and manage all your submitted requests"
      />
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-6 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by application type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-900"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-900">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900">
              <SelectItem value="ALL">All Requests</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <ProcessDashboard
          processes={filteredProcesses}
          onCancelRequest={handleCancelRequest}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default MyRequestPage
