import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://oku-kg.onrender.com/api";

export const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(
      `${API_URL}/admin/images/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке изображения:", error);
    throw error;
  }
};

export const getImageInfo = async (publicId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/images/info/${publicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении информации об изображении:", error);
    throw error;
  }
};

export const getAllImages = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/images/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка изображений:", error);
    throw error;
  }
};

export const deleteImage = async (publicId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/images/delete/${publicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении изображения:", error);
    throw error;
  }
};