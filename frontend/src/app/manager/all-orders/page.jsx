"use client";

import React from "react";
import OrderTable from "@/components/managerComponents/OrderTable";

export default function UnassignedOrders() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Нераспределенные заказы</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <OrderTable 
          orderType="unassigned" 
          title="Доступные для обработки заказы" 
        />
      </div>
    </div>
  );
}