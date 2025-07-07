"use client";

import React from "react";
import OrderTable from "@/components/managerComponents/OrderTable";

export default function MyOrders() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <OrderTable 
          orderType="my" 
          title="Заказы, назначенные мне" 
        />
      </div>
    </div>
  );
}