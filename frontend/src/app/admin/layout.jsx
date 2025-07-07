"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminHeader from "@/components/adminComponents/AdminHeader";
import SideBar from "../../components/adminComponents/SideBar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "ADMIN") {
      router.replace("/login"); 
    } else {
      setIsLoading(false); 
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
    
      <SideBar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
