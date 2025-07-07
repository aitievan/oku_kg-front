import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://oku-kg.onrender.com/api";

export const uploadDiscountBanner = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_URL}/admin/discount-banners/upload`,
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
    console.error("Ошибка при загрузке баннера скидки:", error);
    throw error;
  }
};

export const getDiscountBannerInfo = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/discount-banners/info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении информации о баннере скидки:", error);
    throw error;
  }
};

export const getAllDiscountBanners = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/discount-banners/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка баннеров скидок:", error);
    throw error;
  }
};

export const deleteDiscountBanner = async (token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/discount-banners/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении баннера скидки:", error);
    throw error;
  }
};