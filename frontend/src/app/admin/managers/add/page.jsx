"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ManagerService from "@/service/admin/manager";
import ManagerForm from "@/components/adminComponents/ManagerForm";
import Cookies from "js-cookie";
import Link from "next/link";

export default function AddManagerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = Cookies.get("token");

  const handleSubmit = async (formData) => {
    if (!token) {
      setError("Необходима авторизация");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await ManagerService.registerManager(formData, token);
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/managers");
      }, 1500);
    } catch (err) {
      console.error("Ошибка при добавлении менеджера:", err);
      setError("Не удалось добавить менеджера. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Добавить менеджера</h1>
        <Link
          href="/admin/managers"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Назад к списку
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Менеджер успешно добавлен! Перенаправление...
        </div>
      )}

      <ManagerForm
        onSubmit={handleSubmit}
        buttonText={loading ? "Добавление..." : "Добавить менеджера"}
      />
    </div>
  );
}
