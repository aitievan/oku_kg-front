"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBox, FaSearch, FaClipboardCheck, FaClipboardList, FaUserAlt, FaInbox, FaSignOutAlt } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { logout } from "@/service/admin/logout";


export default function SideBar() {
  const pathname = usePathname();
  
  const menuItems = [
    {
      title: "Все заказы",
      icon: <FaInbox className="mr-2" />,
      path: "/manager/all-orders",
    },
    {
      title: "Мои заказы",
      icon: <FaClipboardList className="mr-2" />,
      path: "/manager/my-orders",
    },
    
    {
      title: "Завершенные",
      icon: <FaClipboardCheck className="mr-2" />,
      path: "/manager/completed",
    },
  
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-semibold border-b border-gray-700 bg-gray-900">
       <Link href="/manager">
        <h2 className="text-xl font-bold text-white mb-4 cursor-pointer hover:underline">
          Менеджер-панель
        </h2>
       </Link>
      </div>
      <nav className="flex flex-col flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Link href={item.path} key={index}>
              <div
                className={`flex items-center py-3 px-4 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.title}
              </div>
            </Link>
          );
        })}
      </nav>
      <button
        className="flex items-center py-3 px-4 text-gray-300 hover:bg-red-700 cursor-pointer"
        onClick={logout}
      >
         <FaSignOutAlt className="mr-2" />
        Выйти
      </button>
      <div className="p-4 border-t border-gray-700 text-sm">
      </div>
    </div>
  );
}