"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RequestTable } from "@/components/ValidaitonRequest/ValidationRequest"
import { validatorApi } from "@/api/testingApis"
import { CheckCircle, Clock, ShieldCheck, XCircle } from "lucide-react"
import type { ProcessInstanceDTO } from "@/Models"
import { PageHeader } from "@/components/ui/PageHeader"

const statuses = ["PENDING", "APPROVED", "REJECTED"]
const statusIcons = { PENDING: Clock, APPROVED: CheckCircle, REJECTED: XCircle }

export default function ValidatorDashboard() {
  const [activeStatus , setActiveStatus] = useState("PENDING")
  const [requests , setRequests] = useState<ProcessInstanceDTO[]>([])
  const [counts , setCounts] = useState({ PENDING: 0, APPROVED: 0, REJECTED: 0 })
  const [loading , setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRequests(activeStatus)
    loadCounts()
  }, [activeStatus])

  const loadRequests = async (status: string) => {
    try {
      setLoading(true)
      const { data } = await validatorApi.getRequestsByStatus(status)
      setRequests(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to load requests.")
    } finally {
      setLoading(false)
    }
  }

  const loadCounts = async () => {
    try {
      const results = await Promise.all(
        statuses.map((status) => validatorApi.getRequestsByStatus(status))
      )
      setCounts({
        PENDING: results[0].data.length,
        APPROVED: results[1].data.length,
        REJECTED: results[2].data.length,
      })
    } catch {
      console.error("Failed to load counts")
    }
  }

  const StatusIcon = statusIcons[activeStatus as keyof typeof statusIcons]

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        
          <div>
           <PageHeader title={"Validator"} description="Validate and approve requests" icon= {<ShieldCheck className="h-8 w-8" />} />
          </div>
        
      
        

      
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                activeStatus === "PENDING" ? "bg-amber-100" :
                activeStatus === "APPROVED" ? "bg-emerald-100" :
                "bg-rose-100"
              }`}>
                <StatusIcon className={`h-6 w-6 ${
                  activeStatus === "PENDING" ? "text-amber-600" :
                  activeStatus === "APPROVED" ? "text-emerald-600" :
                  "text-rose-600"
                }`} />
              </div>
              <CardTitle className="text-xl font-semibold">{capitalize(activeStatus)} Requests</CardTitle>
            </div>
            <CardDescription>
              {activeStatus === "PENDING"
                ? "Requests waiting for your action."
                : activeStatus === "APPROVED"
                ? "Approved requests."
                : "Rejected requests."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value)} className="w-full">
              <div className="flex justify-end mb-4">
                <TabsList className="bg-white shadow-sm grid grid-cols-3 gap-1 p-1 rounded-lg">
                  {statuses.map((status) => (
                    <TabsTrigger 
                      key={status} 
                      value={status}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {capitalize(status)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeStatus}>
                {loading ? (
                  <SkeletonLoader />
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : requests.length === 0 ? (
                  <EmptyState status={activeStatus} />
                ) : (
                  <RequestTable requests={requests} tabValue={statuses.indexOf(activeStatus)} loading={false} error={undefined} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const capitalize = (text: string) => text.charAt(0) + text.slice(1).toLowerCase()

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col space-y-3 py-4 border-b">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    ))}
  </div>
)

const EmptyState = ({ status }: { status: string }) => {
  const Icon = statusIcons[status as keyof typeof statusIcons]
  const color =
    status === "PENDING" ? "bg-amber-100 text-amber-600" :
    status === "APPROVED" ? "bg-emerald-100 text-emerald-600" :
    "bg-rose-100 text-rose-600"

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className={`p-4 rounded-full mb-4 ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold">No {status.toLowerCase()} requests</h3>
      <p className="text-muted-foreground mt-2">Nothing to show here yet.</p>
    </div>
  )
}
