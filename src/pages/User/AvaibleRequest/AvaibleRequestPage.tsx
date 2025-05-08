"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { processApi } from "@/apisTesting/testingApis"
import { useSubmissionStore } from "@/store/requestStore"
import type { ProcessDefinitionDTO } from "@/types/process"
import RequestCard from "@/components/ui/RequestCard"


export default function AvailableRequestPage() {
  const [requestList, setRequestList] = useState<ProcessDefinitionDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const setSelectedSubmission = useSubmissionStore((state) => state.setSelectedSubmission)

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setSelectedSubmission({ formData: undefined, processDefenitionId: undefined })

      try {
        const response = await processApi.getProcessDefinitions()
        setRequestList(response.data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [setSelectedSubmission])

  const filteredRequests = requestList.filter((request) =>
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-12">
      {/* Header */}
      <motion.header style={{backgroundColor:"gray"}}
        className=" text-primary-foreground py-16 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgxMjgsMTI4LDEyOCwwLjA4KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
<div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-center">Request Portal</h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto text-center">
            Browse available requests and select one to begin your submission process
          </p>
        </div>
      </motion.header>

      <div style={{marginTop:"20px"}}className="max-w-5xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background rounded-xl shadow-lg mb-8 p-4 flex gap-3 items-center"
        >
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 flex-grow"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-5xl mx-auto px-4"
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error loading requests</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">No requests found</h2>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <RequestCard key={request.id} request={request} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
