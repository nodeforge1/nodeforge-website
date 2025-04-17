
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/utils";
import { LucideIcon, LayoutDashboard, Package, PlusCircle, Settings, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
};

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 group",
        active 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-primary/10 text-gray-700 hover:text-gray-900"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "" : "group-hover:animate-pulse")} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { logout } = useAuth(); // Auth function from context


  return (
    <div className=" z-50 flex h-full w-64 flex-col  p-4 shadow-sm animate-fade-in rounded-lg ">
      {/* <div className="flex h-14 items-center px-4 border-b mb-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">GG</span>
          </div>
          <span className="text-lg font-semibold">GadgetGalaxy</span>
        </Link>
      </div> */}
      
      <div className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href="/dashboard-home" 
            active={path === "/dashboard-home"} 
          />
          <SidebarItem 
            icon={Package} 
            label="Products" 
            href="/dashboard-home" 
            active={path === "/dashboard-home" || path.startsWith("/products/edit/")} 
          />
          <SidebarItem 
            icon={PlusCircle} 
            label="Add Product" 
            href="/products/new" 
            active={path === "/products/new"} 
          />
          <SidebarItem 
            icon={ShoppingCart} 
            label="Orders" 
            href="/orders" 
            active={path === "/orders"} 
          />
        </nav>
      </div>
      
      <div className="mt-auto border-t pt-4">
        <nav className="grid gap-1 px-2">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            href="/settings" 
          />
          <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
