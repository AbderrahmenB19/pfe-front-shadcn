import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

// Lazy load components
const AdminFormBuilder = lazy(() => import("../components/FormBuilder/FormBuilder"));
const FormTemplatesDashboard = lazy(() => import("../components/FormBuilder/FormTemplate"));
const ValidatorDashboard = lazy(() => import("../pages/validator/validationdashboard/validationPage"));
const ProcessDashboardPage = lazy(() => import("../pages/controller/historique"));
const MyRequestPage = lazy(() => import("../pages/User/MyRequest/MyRequestPage"));
const AvailableRequestPage = lazy(() => import("@/pages/User/AvaibleRequest/AvaibleRequestPage"));
const Dashboard = lazy(() => import("@/pages/admin/ProcessDefinition/Dashboard"));
const ProcessBuilder = lazy(() => import("@/pages/admin/ProcessDefinition/ProcessBuilder"));



const Header = () => (
  <div style={{ backgroundColor: "black", color: "white", height: "50px" }} className="sticky top-0 z-30 flex items-center justify-center border-b bg-background p-4 ">
    <h4 className="font-semibold text-center">🚀 Elevate Your Validation Experience</h4>
  </div>
);



const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Header />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/form-builder" element={<AdminFormBuilder />} />
            <Route path="/form-templates" element={<FormTemplatesDashboard />} />
            <Route path="/process-definition" element={<Dashboard />} />
            <Route path="/builder" element={<ProcessBuilder />} />
            <Route path="/validator" element={<ValidatorDashboard />} />
            <Route path="/form" element={<AvailableRequestPage />} />
            <Route path="/processes" element={<MyRequestPage />} />
            <Route path="/Historique" element={<ProcessDashboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
