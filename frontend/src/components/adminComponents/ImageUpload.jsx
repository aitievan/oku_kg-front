import { useState } from "react";
import Cookies from "js-cookie";
import { uploadImage } from "@/service/admin/image";

export function ImageUpload({ onImageUploaded, currentImageUrl }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentImageUrl || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение");
      return;
    }
    
    setUploading(true);
    setError("");

    try {
      const token = Cookies.get("token");
      
      const response = await uploadImage(file, token);

      const imageUrl = response.url;
      
      setPreview(imageUrl);
      
      onImageUploaded(imageUrl);
    } catch (err) {
      console.error("Ошибка при загрузке изображения:", err);
      setError("Не удалось загрузить изображение. Пожалуйста, попробуйте снова.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="relative border border-gray-300 rounded-md p-2 flex items-center justify-center">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
            disabled={uploading}
            accept="image/*"
          />
          <span className="text-sm">
            {uploading ? "Загрузка..." : "Выберите изображение"}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {preview && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</p>
          <div className="relative w-32 h-40 border rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Предпросмотр обложки"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}