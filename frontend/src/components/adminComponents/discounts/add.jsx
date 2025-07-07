"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DiscountForm from "../../components/DiscountForm";
import Link from "next/link";

export default function AddDiscountPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  const handleSuccess = () => {
    router.push("/admin/discounts");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Добавление новой скидки</h1>
        <Link
          href="/admin/discounts"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Назад к списку
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <DiscountForm
          token={token}
          afterSubmit={handleSuccess}
          isEditMode={false}
        />
      </div>
    </div>
  );
}