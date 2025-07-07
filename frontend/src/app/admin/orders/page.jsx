'use client';

import AdminOrderTable from "@/components/adminComponents/AdminOrderTable";

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Заказы</h1>
      <AdminOrderTable 
        orderType="all"
        title="Все заказы"
      />
    </div>
  );
}