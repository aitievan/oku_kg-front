import React, { useState, useEffect } from "react";
import { addDiscount, updateDiscount } from "@/service/admin/discount";
import { uploadDiscountBanner } from "@/service/admin/discountBanner";
import Cookies from "js-cookie";

export default function DiscountForm({
  initialData,
  afterSubmit,
  isEditMode,
}) {
  const token = Cookies.get('token');
  const [formData, setFormData] = useState({
    discountName: initialData?.discountName || "",
    discountPercentage: initialData?.discountPercentage || 0,
    discImage: initialData?.discImage || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "discountPercentage" 
      ? value.replace(/\D/g, "") 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: name === "discountPercentage" ? Number(numericValue) : value
    }));
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите файл изображения");
      return;
    }

    setUploadingBanner(true);
    setError(null);

    try {
      const response = await uploadDiscountBanner(file, token);
      
      if (!response.url) {
        throw new Error("Не удалось получить URL изображения");
      }

      setFormData(prev => ({
        ...prev,
        discImage: response.url
      }));
    } catch (err) {
      console.error("Ошибка загрузки баннера:", err);
      setError(err.message || "Ошибка при загрузке баннера");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.discImage) {
      setError("Необходимо загрузить баннер скидки");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        discountName: formData.discountName,
        discountPercentage: formData.discountPercentage,
        discImage: formData.discImage,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      if (isEditMode) {
        payload.discountId = initialData.discountId;
        await updateDiscount(token, initialData.discountId, payload);
      } else {
        await addDiscount(token, payload);
      }

      afterSubmit();
    } catch (error) {
      console.error("Ошибка:", error);
      setError(error.response?.data?.message || error.message || "Ошибка при сохранении скидки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountName">
            Название скидки
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="discountName"
            name="discountName"
            type="text"
            value={formData.discountName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPercentage">
            Процент скидки
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="discountPercentage"
            name="discountPercentage"
            type="text"
            value={formData.discountPercentage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
            Дата начала
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            Дата окончания
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4 col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Баннер скидки
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="file"
                id="bannerUpload"
                className="hidden"
                onChange={(e) => handleBannerUpload(e.target.files[0])}
                accept="image/*"
                disabled={uploadingBanner}
              />
              <label
                htmlFor="bannerUpload"
                className={`block w-full p-2 border rounded cursor-pointer text-center ${
                  uploadingBanner ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                {uploadingBanner ? "Загрузка..." : "Выберите баннер"}
              </label>
            </div>
            <div className="flex-1">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.discImage}
                onChange={(e) => setFormData(prev => ({...prev, discImage: e.target.value}))}
                placeholder="Или введите URL изображения"
              />
            </div>
          </div>
          {formData.discImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</p>
              <img 
                src={formData.discImage} 
                alt="Предпросмотр баннера" 
                className="max-w-full h-auto max-h-40 object-contain border rounded"
                onError={() => setError("Не удалось загрузить изображение")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-start mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isSubmitting || uploadingBanner}
        >
          {isSubmitting
            ? "Сохранение..."
            : isEditMode
            ? "Обновить скидку"
            : "Создать скидку"}
        </button>
      </div>
    </form>
  );
}