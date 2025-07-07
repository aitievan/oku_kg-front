"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ManagerService from "@/service/admin/manager";
import ManagerForm from "@/components/adminComponents/ManagerForm";
import Cookies from "js-cookie";
import Link from "next/link";

export default function EditManagerPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token || !userId) return;

    console.log("Fetching manager with ID:", userId);
    fetchManager();
  }, [token, userId]);

  const fetchManager = async () => {
    try {
      if (!userId || !token) {
        console.error("userId или token отсутствуют");
        setError("Некорректный запрос");
        setLoading(false);
        return;
      }

      const data = await ManagerService.getManagerById(userId, token);
      if (!data) {
        throw new Error("Менеджер не найден");
      }

      setManager(data);
    } catch (err) {
      console.error("Ошибка при загрузке данных менеджера:", err);
      setError(
        "Не удалось загрузить данные менеджера. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (!token) {
      setError("Необходима авторизация");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await ManagerService.updateManagerProfile(userId, formData, token);
      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/managers");
      }, 1500);
    } catch (err) {
      console.error("Ошибка при обновлении данных менеджера:", err);
      setError(
        "Не удалось обновить данные менеджера. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !manager) {
    return (
      <div className="text-center py-10">Загрузка данных менеджера...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Редактирование менеджера</h1>
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
          Данные менеджера успешно обновлены! Перенаправление...
        </div>
      )}

      {manager ? (
        <ManagerForm
          initialData={manager}
          onSubmit={handleSubmit}
          buttonText={loading ? "Сохранение..." : "Сохранить изменения"}
        />
      ) : (
        <div className="text-center py-4">
          <p className="text-red-500">Менеджер не найден</p>
        </div>
      )}
    </div>
  );
}
