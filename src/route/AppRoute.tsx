import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminFormBuilder from "../components/FormBuilder/FormBuilder";
import FormTemplatesDashboard from "../components/FormBuilder/FormTemplate";
import ValidatorDashboard from "../pages/validator/validationdashboard/validationPage";
import ProcessDashboardPage from "../pages/controller/historique";

import MyRequestPage from "../pages/User/MyRequest/MyRequestPage";
import AvailableRequestPage from "@/pages/User/AvaibleRequest/AvaibleRequestPage";
import { AppSidebar } from "./AppSidebar";
import Dashboard from "@/pages/admin/ProcessDefinition/Dashboard";
import ProcessBuilder from "@/pages/admin/ProcessDefinition/ProcessBuilder";



const Header = () => (
  <div style={{ backgroundColor: "#4F46E5", color: "white", height: "50px" }} className="sticky top-0 z-30 flex items-center justify-center border-b bg-background p-4 ">
    <h4 className="font-semibold text-center">🚀 Elevate Your Validation Experience</h4>
  </div>
);

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
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
