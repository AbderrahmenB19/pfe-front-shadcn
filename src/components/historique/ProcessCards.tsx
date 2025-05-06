import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,

  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  CalendarDays,
  Flag,

  Circle as TimelineIcon,
  Eye,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-6  " >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {processes.map((process) => {
          const statusColor =
            statusColors[process.currentStatus as keyof typeof statusColors] ||
            "bg-gray-100 text-gray-800";
          const statusIcon =
            statusIcons[process.currentStatus as keyof typeof statusIcons] || (
              <Clock className="w-4 h-4 text-gray-500" />
            );

          return (
            <Card
              key={process.processInstanceId}
              className="h-full flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-3 text-wrap">

                  <Flag style={{ color: "blueviolet" }} className="w-5 h-5" />

                  <CardTitle className="text-lg break-words whitespace-normal">
                    REQ-{process.processDefinitionName}
                  </CardTitle>

                </div>
                <Badge className={`${statusColor} flex items-center gap-1`}>
                  {statusIcon}
                  {process.currentStatus}
                </Badge>
              </CardHeader>
              

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  <span>{process.username}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>
                    Date:{" "}
                    {process.startTime
                      ? new Date(process.startTime).toLocaleDateString()
                      : "--:--:--"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(process, "timeline")}
                >
                  <TimelineIcon className="w-4 h-4 mr-2" />
                  Timeline
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(process, "details")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
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
              readOnly={true} onSubmit={function (submission: any): void {
                throw new Error("Function not implemented.");
              } }              
              
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}