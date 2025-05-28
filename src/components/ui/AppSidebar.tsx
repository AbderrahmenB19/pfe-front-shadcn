import { Calendar, Inbox, Search, Settings } from "lucide-react"
import { Link } from "react-router-dom" // <-- Important for SPA navigation

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items (updated with your routes).
const items = [
  {
    title: "Form Builder",
    url: "/form-builder",
    icon: Calendar, // replaced Home icon with Calendar
  },
  {
    title: "Form Templates",
    url: "/form-templates",
    icon: Inbox,
  },
  {
    title: "Process Definition",
    url: "/process-definition",
    icon: Calendar,
  },
  {
    title: "Validator",
    url: "/validator",
    icon: Search,
  },
  {
    title: "Available Requests",
    url: "/form",
    icon: Settings,
  },
  {
    title: "My Requests",
    url: "/processes",
    icon: Calendar,
  },
  {
    title: "Historique",
    url: "/Historique",
    icon: Inbox,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}> {/* <-- Use Link instead of <a> */}
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
