import { type ReactNode } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  BookA,
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  Settings,
  Bell,
  Search,
  LogOut,
  Activity,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: "overview" | "categories" | "users" | "products";
  onNavigate: (page: "overview" | "categories" | "users" | "products") => void;
}

const navigationItems = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "users" as const,
    label: "User Management",
    icon: Users,
    badge: "12",
  },
  {
    id: "categories" as const,
    label: "Categories",
    icon: FolderTree,
    badge: null,
  },
  {
    id: "products" as const,
    label: "Product Management",
    icon: Package,
    badge: "3",
  },
];

export function AdminLayout({
  children,
  currentPage,
  onNavigate,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
              <BookA className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="tracking-tight">Auctionary</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-accent/10 border border-accent/30 text-accent"
                    : "hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-accent" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/50 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}

          <Separator className="my-4" />

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 border border-transparent transition-all">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Settings</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 border border-transparent transition-all">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Activity Logs</span>
          </button>
        </nav>

        {/* Admin User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-accent/30">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm">Admin User</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border bg-card/30 backdrop-blur">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users, products, transactions..."
                  className="pl-10 h-11 bg-background border-border"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Badge className="bg-success/20 text-success border-success/50">
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
