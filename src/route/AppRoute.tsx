import { useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/roleUtils";

const DefaultRedirect = () => {
  const { roles } = useAuthStore();
  
  if (hasRole(["ADMIN"])) {
    return <Navigate to="/process-definition" replace />;
  } else if (hasRole(["VALIDATOR"])) {
    return <Navigate to="/validator" replace />;
  } else if (hasRole(["USER"])) {
    return <Navigate to="/form" replace />;
  } else {
    return <Navigate to="/logout" replace />;
  }
};
const AdminFormBuilder = lazy(() => import("../components/FormBuilder/FormBuilder"));
const FormTemplatesDashboard = lazy(() => import("../components/FormBuilder/FormTemplate"));
const ValidatorDashboard = lazy(() => import("../pages/validator/validationdashboard/validationPage"));
const ProcessDashboardPage = lazy(() => import("../pages/controller/historique"));
const MyRequestPage = lazy(() => import("../pages/User/MyRequest/MyRequestPage"));
const AvailableRequestPage = lazy(() => import("@/pages/User/AvaibleRequest/AvaibleRequestPage"));
const Dashboard = lazy(() => import("@/pages/admin/ProcessDefinition/Dashboard"));
const ProcessBuilder = lazy(() => import("@/pages/admin/ProcessDefinition/ProcessBuilder"));



const Header = () => (
  <div className="sticky top-0 z-30 flex items-center justify-center border-b p-4"
       style={{ 
         background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)", 
         color: "white", 
         height: "50px",
         boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
       }}>
    <h4 className="font-semibold text-center">🚀 Elevate Your Validation Experience</h4>
  </div>
);



const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Header />
        <main className="flex-1 p-6">
         
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <Routes>
                <Route path="/" element={<DefaultRedirect />} />
                
                <Route path="/form-builder" element={
                  <ProtectedRoute element={<AdminFormBuilder />} allowedRoles={["ADMIN"]} />
                } />
                <Route path="/form-templates" element={
                  <ProtectedRoute element={<FormTemplatesDashboard />} allowedRoles={["ADMIN"]} />
                } />
                <Route path="/process-definition" element={
                  <ProtectedRoute element={<Dashboard />} allowedRoles={["ADMIN"]} />
                } />
                <Route path="/builder" element={
                  <ProtectedRoute element={<ProcessBuilder />} allowedRoles={["ADMIN"]} />
                } />
                
                <Route path="/validator" element={
                  <ProtectedRoute element={<ValidatorDashboard />} allowedRoles={["VALIDATOR"]} />
                } />
                <Route path="/Historique" element={
                  <ProtectedRoute element={<ProcessDashboardPage />} allowedRoles={["VALIDATOR","ADMIN"]} />
                } />
                
                <Route path="/form" element={
                  <ProtectedRoute element={<AvailableRequestPage />} allowedRoles={["USER"]} />
                } />
                <Route path="/processes" element={
                  <ProtectedRoute element={<MyRequestPage />} allowedRoles={["USER"]} />
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
