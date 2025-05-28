import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { processApi } from "../../api/testingApis";
import { ReportDTO } from "../../Models";
import {StatusCards} from "../../components/StatusCard/statusCard";
import ProcessCards from "../../components/historique/ProcessCards";
import { PageHeader } from "@/components/ui/PageHeader";
import { FileText, LayoutDashboard } from "lucide-react";

const ProcessDashboardPage = () => {
  const [allProcesses, setAllProcesses] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'|'CANCELLED'>('ALL');

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await processApi.getAllReports();
        setAllProcesses(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProcesses();
  }, []);

  const processes = allProcesses.map((process) => ({
    id: process.processInstanceId,
    processName: 'N/A',
    currentStatus: process.currentStatus,
    submittedBy: 'Unknown',
    createdAt: process.startTime || '',
    formData: {},
    ...process,
  }));

  const filteredProcesses = processes.filter((process) => {
    const statusMatch = statusFilter === 'ALL' || process.currentStatus === statusFilter;
    const applicationTypeMatch = process.processName.toLowerCase().includes(searchTerm.toLowerCase());
    return applicationTypeMatch && statusMatch;
  });

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <PageHeader 
          title="Request Dashboard" 
          icon={<LayoutDashboard className="h-8 w-8 text-primary" />}
          className="mb-2"
        />

        {loading && processes.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
        ) : (
          <>
            <StatusCards processes={processes} />

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
              <Input
                placeholder="Search by process name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/2 text-lg"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-full md:w-48 text-lg">
                  <SelectValue placeholder="Filter by Status" />
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

           
                {loading && <Skeleton className="h-2 w-full rounded" />}
                <ProcessCards processes={filteredProcesses} loading={loading} />
            

            {filteredProcesses.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm">
                <FileText className="w-10 h-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No processes found</h3>
                <p className="text-muted-foreground mt-2">
                  No processes match your search criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProcessDashboardPage;
