import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react"; // Import icons for the toggle button

type DashboardProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with responsive behavior */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform bg-white ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile header with toggle button */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b p-4 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </header>

        <main className="p-4 sm:p-6">
          <div className="animate-slide-up">{children}</div>
        </main>
      </div>
    </div>
  );
}