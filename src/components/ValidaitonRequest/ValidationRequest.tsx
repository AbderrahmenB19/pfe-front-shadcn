import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2 as ApprovedIcon,
  XCircle as RejectedIcon,
  Clock as PendingIcon,
  User as PersonIcon,
  Eye as ViewIcon
} from "lucide-react";
import { RequestDetailsDialog } from "../RequestDialog/RequestDialog";
import type { ProcessInstanceDTO } from "../../api";
import { validatorApi } from "@/apisTesting/testingApis";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

const statusConfig: Record<RequestStatus, { icon: JSX.Element; variant: "default" | "secondary" | "destructive"; label: string; color: string }> = {
  PENDING: { icon: <PendingIcon className="w-4 h-4" />, variant: "default", label: "Pending", color: "bg-yellow-500" },
  APPROVED: { icon: <ApprovedIcon className="w-4 h-4" />, variant: "secondary", label: "Approved", color: "bg-green-500" },
  REJECTED: { icon: <RejectedIcon className="w-4 h-4" />, variant: "destructive", label: "Rejected", color: "bg-red-500" }
};

const statuses: RequestStatus[] = ["PENDING", "APPROVED", "REJECTED"];

const formatDate = (date?: string | Date) =>
  date ? new Date(date).toLocaleDateString() : "--";

export const RequestTable = ({
  requests,
  tabValue,
  loading,
  error
}: {
  requests: ProcessInstanceDTO[];
  tabValue: number;
  loading: boolean;
  error: any;
}) => {
  const [selectedRequest, setSelectedRequest] = React.useState<ProcessInstanceDTO>({});
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const currentStatus = statuses[tabValue] || "PENDING";
  

  const handleShowDetails = (request: ProcessInstanceDTO) => {
    console.log("Selected request:", request);
    
    setSelectedRequest(request);
    setDialogOpen(true);
   
    
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message || "An error occurred"}</AlertDescription>
      </Alert>
    );
  }

  const  handleApprove  = async (id: number | undefined)=> {
    try{
      const response = await validatorApi.approveRequest(id!);
      console.log("Request approved:", response.data);


    }
    catch (error) {
      console.error("Error approving request:", error);
    }
  }

 

  return (
    <div className="w-full p-4 space-y-6">
      <h2 className="text-2xl font-bold text-primary">{currentStatus} Requests</h2>

      <div className="rounded-lg border overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              {["Request #", "Requester", "Submitted", "Decision Date", "Status", "Actions"].map((header) => (
                <TableHead key={header} className="text-white text-center">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => {
              const { id, createdAt, decisionDate, status , formId} = request;
            
              const requesterName = request.requesterName;
              const reqStatus = (status as RequestStatus) || "PENDING";
              const statusInfo = statusConfig[reqStatus];
              const processName= request.processName ; 

              return (
                <TableRow key={id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="text-center font-semibold">REQ-{processName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <PersonIcon  />
                      </Avatar>
                      <span className="font-medium">{requesterName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{formatDate(createdAt)}</TableCell>
                  <TableCell className="text-center">{formatDate(decisionDate)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusInfo.variant} className={`gap-1 px-3 py-1 text-sm ${statusInfo.color}`}>
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      <RequestDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        request={selectedRequest}
        tabValue={tabValue}
        onApprove={() => {handleApprove(selectedRequest.id)}}
        
      />
    </div>
  );
};
