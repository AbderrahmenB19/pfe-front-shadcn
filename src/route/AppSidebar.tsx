
import { Button } from "@/components/ui/button";
import {  Folder, LogOut, FileText, GitBranch, ShieldCheck, FileStack, History, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { doLogout } from "@/auth/KeycloakService";

export function AppSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (collapsed: boolean) => void; }) {
  return (
    <div style={{backgroundColor:"black"}}className={`fixed top-0 left-0 h-screen  text-white border-r p-4 flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 z-50`}>
     
      <div className="flex justify-between items-center mb-6">
        {!collapsed && <> 
          <img src="./image.png" width={30} height={30}/> <span className="text-xl font-bold">M-V-S</span>
        </>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-gray-700"
        >
          {collapsed ? <ArrowRight/> : <ArrowLeft/>}
        </Button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 flex flex-col gap-4 overflow-y-auto">
        
        <SidebarItem to="/form-templates" Icon={FileText} label="Form Templates" collapsed={collapsed} />
        <SidebarItem to="/process-definition" Icon={GitBranch} label="Process Definition" collapsed={collapsed} />
        <SidebarItem to="/validator" Icon={ShieldCheck} label="Validator" collapsed={collapsed} />
        <SidebarItem to="/form" Icon={Folder} label="Available Forms" collapsed={collapsed} />
        <SidebarItem to="/processes" Icon={FileStack} label="My Requests" collapsed={collapsed} />
        <SidebarItem to="/Historique" Icon={History} label="Historique" collapsed={collapsed} />
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button onClick={()=> {doLogout()}}>
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
      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition-colors text-white no-underline group"
      style={{ textDecoration: 'none' }}
    >
      <Icon size={24} className="text-white group-hover:text-gray-300" />
      {!collapsed && <span className="text-md">{label}</span>}
    </Link>
  );
}