import { Button } from "@/components/ui/button";
import { Folder, LogOut, FileText, GitBranch, ShieldCheck, FileStack, History, ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { doLogout } from "@/auth/KeycloakService";
import { hasRole } from "@/utils/roleUtils";

export function AppSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (collapsed: boolean) => void; }) {
  return (
    <div className={`fixed top-0 left-0 h-screen text-white p-4 flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 z-50`}
         style={{
           background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
           borderRight: "1px solid rgba(255, 255, 255, 0.1)",
           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
         }}>
     
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <> 
          <img src="./logo.png" width={150} height={150}/> <br />
         
        </>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-indigo-700 transition-colors"
        >
          {collapsed ? <img src="./image.png" width={50} height={50}/> : <ArrowLeft/>}
        </Button>
      </div>

      
      <nav className="flex-1 flex flex-col gap-4 overflow-y-auto">
        
        
        {hasRole(["ADMIN"]) && (
          <>
            <SidebarItem to="/form-templates" Icon={FileText} label="Form Templates" collapsed={collapsed} />
            <SidebarItem to="/process-definition" Icon={GitBranch} label="Process Definition" collapsed={collapsed} />
            <SidebarItem to="/Historique" Icon={History} label="Process History" collapsed={collapsed} />
            <SidebarItem to="http://localhost:9090/" Icon={Settings} label="Manage users" collapsed={collapsed} />
          </>
        )}
        
        
        {hasRole(["VALIDATOR"]) && (
          <>
            <SidebarItem to="/validator" Icon={ShieldCheck} label="Validator Dashboard" collapsed={collapsed} />
            <SidebarItem to="/Historique" Icon={History} label="Process History" collapsed={collapsed} />
          </>
        )}
        
        
        {hasRole(["USER"]) && (
          <>
            <SidebarItem to="/form" Icon={Folder} label="Available Forms" collapsed={collapsed} />
            <SidebarItem to="/processes" Icon={FileStack} label="My Requests" collapsed={collapsed} />
          </>
        )}
      </nav>

      
      <div className="mt-auto border-t border-indigo-900/50 pt-4">
        <button onClick={()=> {doLogout()}} className="w-full">
          <SidebarItem to="/logout" Icon={LogOut} label="Logout" collapsed={collapsed} />
        </button>
      </div>
    </div>
  );
}

function SidebarItem({
  to,
  Icon,
  label,
  collapsed,
}: {
  to: string;
  Icon: React.ElementType;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-2 rounded-lg hover:bg-indigo-800/50 transition-colors text-white no-underline group"
      style={{ textDecoration: 'none' }}
    >
      <Icon size={24} className="text-blue-300 group-hover:text-white transition-colors" />
      {!collapsed && <span className="text-md font-medium">{label}</span>}
    </Link>
  );
}