import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
import { DollarSign } from 'lucide-react';
export function FullScreenLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-3 text-xl font-semibold">
        <div className="p-3 bg-blue-500 rounded-full text-white animate-bounce">
          <DollarSign className="h-8 w-8" />
        </div>
        <span className="text-2xl font-bold">Loading FloatFlow...</span>
      </div>
    </div>
  );
}
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-blue-50/50 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}