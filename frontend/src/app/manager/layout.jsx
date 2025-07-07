"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SideBar from "../../components/managerComponents/SideBar";
import { Menu } from "lucide-react";

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    
    if (!token || role !== "MANAGER") {
      router.replace("/login");
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`
        fixed md:static top-0 left-0 z-40 
        w-64 h-full bg-[#1E2533] 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
      `}>
        <SideBar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto md:ml-0 relative">
        <button 
          className="md:hidden absolute top-4 right-4 z-50 bg-gray-100 p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>

        {children}
      </main>

      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}