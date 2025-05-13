import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  CalendarDays,
  Flag,
  Eye,
  AlarmCheckIcon,
} from "lucide-react";
import { CustomizedTimeline } from "../customizedTimeLine/customizedTimeline";
import type { ReportDTO } from "../../api";
import { RenderForm } from "../renderForm/renderForm";
import { formApi, processApi } from "@/apisTesting/testingApis";


interface ProcessCardsProps {
  processes?: ReportDTO[];
  loading?: boolean;
}

type ViewType = "timeline" | "details";

const statusIcons = {
  APPROVED: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  REJECTED: <XCircle className="w-4 h-4 text-red-500" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
} as const;

const statusColors = {
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

export default function ProcessCards({ processes = [], loading = false }: ProcessCardsProps) {
  const [selectedProcess, setSelectedProcess] = useState<
    ReportDTO & { viewType?: ViewType }
  >();
  const[formSchma , setFormSchema]= useState<string>();
  const [openDialog, setOpenDialog] = useState(false);
  const[formData , setFormData]= useState<string>();
  useEffect(()=>{
    console.log("hoooola")
    const fetchFormSchema= async (id:number)=>{
      try{
        const response= await formApi.getFormSchema(id);
        setFormSchema(response.data.jsonSchema)
      }catch(eror){
        console.log(eror)
      }

    }
    const fetchProcess = async ()=>{
      try{
        const response = await processApi.getProcessInstanceById(selectedProcess?.processInstanceId!);
        setFormData(response.data.formData)
        fetchFormSchema(response.data.formId!)

      }catch(eror){
        console.log(eror)
      }
      


      
    }
    fetchProcess();
  },[openDialog])
  
  
  

  const handleOpenDialog = (process: ReportDTO, type: ViewType) => {
    setSelectedProcess({ ...process, viewType: type });
   
    setOpenDialog(true);
  };

  

  if (loading) {
    return (
      <div className="w-full mt-6">
        <div className="rounded-xl border overflow-hidden shadow-lg bg-white/50">
          <Table>
            <TableHeader>
              <TableRow>
                {["Request", "Requester", "Date", "Status", "Actions"].map((header) => (
                  <TableHead key={header} className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6 py-4"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="px-6 py-4"><Skeleton className="h-8 w-32" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="rounded-xl border overflow-x-auto shadow-lg bg-white/50 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-gradient-to-b from-gray-50 to-gray-100/80">
            <TableRow className="hover:bg-transparent">
              {["Request", "Requester", "Date", "Status", "Actions"].map((header) => (
                <TableHead key={header} className="text-gray-700 font-semibold py-4 px-6 first:rounded-tl-xl last:rounded-tr-xl">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => {
              const statusColor =
                statusColors[process.currentStatus as keyof typeof statusColors] ||
                "bg-gray-100 text-gray-800";
              const statusIcon =
                statusIcons[process.currentStatus as keyof typeof statusIcons] || (
                  <Clock className="w-4 h-4 text-gray-500" />
                );

              return (
                <TableRow key={process.processInstanceId} className="hover:bg-gray-50/50 transition-all duration-200 border-b group">
                  <TableCell className="font-semibold px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Flag style={{ color: "blueviolet" }} className="w-5 h-5" />
                      <span className="bg-primary/5 px-2.5 py-1 rounded-md group-hover:bg-primary/10 transition-colors">
                        REQ-{process.processDefinitionName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 bg-primary/10 ring-2 ring-primary/5 flex items-center justify-center transition-all group-hover:ring-primary/20">
                        <User className="text-primary w-5 h-5" />
                      </Avatar>
                      <span className="font-medium text-gray-700">{process.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">
                    {process.startTime
                      ? new Date(process.startTime).toLocaleDateString()
                      : "--:--:--"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`${statusColor} flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all group-hover:shadow-sm`}>
                      {statusIcon}
                      {process.currentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2 justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/5 hover:border-primary/20 transition-colors"
                        onClick={() => handleOpenDialog(process, "timeline")}
                      >
                        <AlarmCheckIcon className="w-4 h-4 mr-2" />
                        Timeline
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/5 hover:border-primary/20 transition-colors"
                        onClick={() => handleOpenDialog(process, "details")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>
                {selectedProcess?.viewType === "timeline"
                  ? `Timeline: REQ-${selectedProcess?.processInstanceId}`
                  : `Details: REQ-${selectedProcess?.processInstanceId}`}
              </span>
          
            
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 " >
            {selectedProcess?.viewType === "timeline" && (
              <CustomizedTimeline
                timelineData={selectedProcess.processHistoryDTOList || []}
              />
            )}
            {selectedProcess?.viewType === "details" && (
              <RenderForm formSchema={formSchma} loading={false} error={null} data={formData}
              readOnly={true}               
              
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}