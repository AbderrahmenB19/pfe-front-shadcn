import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { processApi } from "../../apisTesting/testingApis";
import { ReportDTO } from "../../api";
import {StatusCards} from "../../components/StatusCard/statusCard";
import ProcessCards from "../../components/historique/ProcessCards";

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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Process Dashboard</h1>

      {loading && processes.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      ) : (
        <>
          <StatusCards processes={processes} />

          
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Input
              placeholder="Search by process name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2"
            />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full md:w-48">
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

        
          <Card className="mt-6">
            <CardContent className="p-6">
              {loading && <Skeleton className="h-2 w-full rounded" />}
              <ProcessCards processes={filteredProcesses} loading={loading} />
            </CardContent>
          </Card>

          {filteredProcesses.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-6">
              No processes found matching your criteria
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProcessDashboardPage;
