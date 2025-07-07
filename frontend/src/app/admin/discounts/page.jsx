"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DiscountTable from "../../../components/adminComponents/DiscountTable";
import DiscountForm from "../../../components/adminComponents/DiscountForm";
import { getDiscounts, deleteDiscount } from "@/service/admin/discount";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchDiscounts();
  }, [token]);

  async function fetchDiscounts() {
    setIsLoading(true);
    try {
      const data = await getDiscounts(token);
      setDiscounts(data || []);
      setError(null);
    } catch (error) {
      console.error("Ошибка загрузки скидок:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Ошибка при загрузке скидок"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID скидки не определен");
      return;
    }
    console.log("Deleting discount with ID:", id);
    if (window.confirm("Вы уверены, что хотите удалить эту скидку?")) {
      try {
        await deleteDiscount(token, id);
        setDiscounts((prevDiscounts) =>
          prevDiscounts.filter(
            (discount) => (discount.discountId || discount.id) !== id
          )
        );
      } catch (error) {
        console.error("Ошибка удаления скидки:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Ошибка при удалении скидки"
        );
      }
    }
  };
  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingDiscount(null);
    setIsFormVisible(true);
  };

  const cancelForm = () => {
    setIsFormVisible(false);
    setEditingDiscount(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление скидками</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
          <button
            onClick={fetchDiscounts}
            className="mt-2 text-blue-600 hover:underline"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {!isFormVisible ? (
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
        >
          Добавить скидку
        </button>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingDiscount
              ? "Редактирование скидки"
              : "Добавление новой скидки"}
          </h2>
          <DiscountForm
            initialData={editingDiscount}
            token={token}
            afterSubmit={() => {
              fetchDiscounts();
              setIsFormVisible(false);
            }}
            isEditMode={!!editingDiscount}
          />
          <button
            onClick={cancelForm}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Отмена
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-8">
          <p>Загрузка...</p>
        </div>
      ) : discounts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Скидки не найдены</p>
        </div>
      ) : (
        <DiscountTable
          discounts={discounts}
          onDelete={handleDelete}
          onEdit={handleEdit}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
