import React, { useState } from "react";

export default function DiscountTable({
  discounts,
  onDelete,
  onEdit,
  formatDate,
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = (id) => {
    if (!id) {
      console.error("ID скидки не передан в handleConfirmDelete");
      return;
    }
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Баннер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Скидка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Период действия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((discount) => {
              const now = new Date();
              const start = new Date(discount.startDate);
              const end = new Date(discount.endDate);
              let status = "Неактивна";
              let statusClass = "bg-gray-100 text-gray-800";

              if (now >= start && now <= end) {
                status = "Активна";
                statusClass = "bg-green-100 text-green-800";
              } else if (now < start) {
                status = "Ожидает";
                statusClass = "bg-blue-100 text-blue-800";
              } else if (now > end) {
                status = "Завершена";
                statusClass = "bg-red-100 text-red-800";
              }

              return (
                <tr key={discount.discountId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {discount.discImage ? (
                        <img
                          src={discount.discImage}
                          alt="Баннер скидки"
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/default-banner.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">Нет баннера</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {discount.discountName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {discount.discountPercentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(discount.startDate)} -{" "}
                      {formatDate(discount.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirm === discount.discountId ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleConfirmDelete(discount.discountId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Подтвердить
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => onEdit(discount)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDeleteClick(discount.discountId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}