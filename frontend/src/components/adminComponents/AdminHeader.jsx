"use client";

import { logout } from "@/service/admin/logout";

export default function AdminHeader() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex-grow"></div>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={logout}
      >
        Выйти
      </button>
    </header>
  );
}