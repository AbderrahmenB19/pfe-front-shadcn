"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { processApi } from "@/api/testingApis"
import { useSubmissionStore } from "@/store/requestStore"
import type { ProcessDefinitionDTO } from "@/types/process"
import RequestCard from "@/components/ui/RequestCard"
import { toast, Toaster } from "sonner"
import { useDialogStateStore } from "@/store/DialogStateStore"


export default function AvailableRequestPage() {
  const [requestList, setRequestList] = useState<ProcessDefinitionDTO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const setSelectedSubmission = useSubmissionStore((state) => state.setSelectedSubmission)
  const toastState = useDialogStateStore((state) => state.toastState)
  const setToastState = useDialogStateStore((state) => state.setToastState)


  
  

  useEffect(() => {
    if (toastState.open === true) {
      const showToast = toastState.status === "success" ? toast.success : toast.error;
      showToast(toastState.message);
      
      const timer = setTimeout(() => {
        setToastState({ open: false, message: "", status: undefined });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastState, setToastState]);

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
       <Toaster position="top-right" richColors />
      {/* Header */}
      <motion.header style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        className=" text-primary-foreground py-16 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')] mix-blend-overlay opacity-50"></div>
<div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Request Portal
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl mx-auto text-center leading-relaxed">
              Browse available requests and select one to begin your submission process
            </p>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background/80 backdrop-blur-sm rounded-xl shadow-lg mb-8 p-4 flex gap-3 items-center border border-white/10 hover:border-white/20 transition-all duration-300"
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
            <AnimatePresence>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                  className="h-64 bg-muted animate-pulse rounded-lg shadow-sm"
                />
              ))}
            </AnimatePresence>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error loading requests</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredRequests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-background/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                No requests found
              </h2>
              <p className="text-muted-foreground text-lg">
                Try adjusting your search criteria
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <RequestCard key={request.id} request={request} index={index} />
            ))}
          </div>
            </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
