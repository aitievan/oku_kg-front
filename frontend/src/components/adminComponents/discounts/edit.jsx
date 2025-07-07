"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import DiscountForm from "../../../components/DiscountForm";
import Link from "next/link";
import { getDiscountById } from "@/service/admin/discount";

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [discount, setDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchDiscount();
  }, [id, token]);

  const fetchDiscount = async () => {
    setIsLoading(true);
    try {
      const data = await getDiscountById(token, id);
      setDiscount(data);
      setError(null);
    } catch (err) {
      console.error(`Ошибка загрузки скидки с ID ${id}:`, err);
      setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных скидки");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push("/admin/discounts");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchDiscount}
            className="mt-2 text-blue-600 hover:underline"
          >
            Попробовать снова
          </button>
        </div>
        <Link
          href="/admin/discounts"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Вернуться к списку скидок
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Редактирование скидки</h1>
        <Link
          href="/admin/discounts"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Назад к списку
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DiscountForm
          initialData={discount}
          token={token}
          afterSubmit={handleSuccess}
          isEditMode={true}
        />
      </div>
    </div>
  );
}