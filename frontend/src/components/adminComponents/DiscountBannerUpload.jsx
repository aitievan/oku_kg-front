import { useState } from "react";
import Cookies from "js-cookie";
import { uploadDiscountBanner } from "@/service/admin/discountBanner";

export function DiscountBannerUpload({ onBannerUploaded, currentBannerUrl }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentBannerUrl || "");

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение");
      return;
    }
    
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    
    setUploading(true);
    setError("");

    try {
      const token = Cookies.get("token");
      
      const response = await uploadDiscountBanner(file, token);
      
      const bannerUrl = response.url;
      
      URL.revokeObjectURL(localPreview);
      
      setPreview(bannerUrl);
      
      onBannerUploaded(bannerUrl);
    } catch (err) {
      console.error("Ошибка при загрузке баннера:", err);
      setError("Не удалось загрузить баннер. Пожалуйста, попробуйте снова.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="relative border border-gray-300 rounded-md p-2 flex items-center justify-center w-full">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleBannerUpload}
            disabled={uploading}
            accept="image/*"
          />
          <span className="text-sm">
            {uploading ? "Загрузка..." : "Выберите баннер"}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {preview && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</p>
          <div className="relative w-full h-40 border rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Предпросмотр баннера"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Рекомендуемый размер: 1440x500px
          </p>
        </div>
      )}
    </div>
  );
}