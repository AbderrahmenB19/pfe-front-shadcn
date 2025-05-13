import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { GitBranch, FileText, ClipboardList, UserCircle, CheckCircle } from "lucide-react";
import RequestCard from "@/components/ui/RequestCard";
import { ProcessDefinitionDTO } from "@/types/process";
import { processApi } from "@/apisTesting/testingApis";
import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/roleUtils";

export default function Home() {
  const navigate = useNavigate();
  const [processDefinitions, setProcessDefinitions] = useState<ProcessDefinitionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcessDefinitions = async () => {
      try {
        const response = await processApi.getProcessDefinitions();
        setProcessDefinitions(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching process definitions:', error);
        setError('Failed to load process definitions');
      } finally {
        setLoading(false);
      }
    };

    fetchProcessDefinitions();
  }, []);

  const { roles } = useAuthStore();
  
  const allActions = [
    {
      title: "Process Definitions",
      description: "Create and manage process workflows",
      icon: <GitBranch className="h-6 w-6" />,
      path: "/process-definition",
      roles: ["ADMIN"]
    },
    {
      title: "Form Templates",
      description: "Design and manage form templates",
      icon: <FileText className="h-6 w-6" />,
      path: "/form-templates",
      roles: ["ADMIN"]
    },
    {
      title: "Form Builder",
      description: "Create and edit form templates",
      icon: <FileText className="h-6 w-6" />,
      path: "/form-builder",
      roles: ["ADMIN"]
    },
    {
      title: "Process Builder",
      description: "Build and configure processes",
      icon: <GitBranch className="h-6 w-6" />,
      path: "/builder",
      roles: ["ADMIN"]
    },
    {
      title: "Validation Dashboard",
      description: "Review and validate requests",
      icon: <CheckCircle className="h-6 w-6" />,
      path: "/validator",
      roles: ["VALIDATOR"]
    },
    {
      title: "Process History",
      description: "View process history and analytics",
      icon: <ClipboardList className="h-6 w-6" />,
      path: "/Historique",
      roles: ["VALIDATOR"]
    },
    {
      title: "Available Requests",
      description: "Browse available request forms",
      icon: <FileText className="h-6 w-6" />,
      path: "/form",
      roles: ["USER"]
    },
    {
      title: "My Requests",
      description: "View and manage your requests",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/processes",
      roles: ["USER"]
    }
  ];
  
  // Filter actions based on user roles
  const roleBasedActions = allActions.filter(action => 
    action.roles.some(role => roles.includes(role))
  );

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Welcome to Process Management"
        description="Manage your processes, forms, and requests in one place"
        icon={<GitBranch className="h-8 w-8" />}
      />

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roleBasedActions.length > 0 ? (
          roleBasedActions.map((action, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  {action.icon}
                  <div>
                    <CardTitle>{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center p-6">
            <p className="text-gray-500">No actions available for your role. Please contact an administrator.</p>
          </div>
        )}
      </div>

      {/* Available Requests Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading requests...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : processDefinitions.length > 0 ? (
            processDefinitions.map((process, index) => (
              <RequestCard key={process.id} request={process} index={index} />
            ))
          ) : (
            <p>No requests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}