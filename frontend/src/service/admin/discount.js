import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const validateDiscountData = (discountData) => {
  if (!discountData.discountName || !discountData.discountName.trim()) {
    throw new Error('Название скидки обязательно');
  }
  if (isNaN(discountData.discountPercentage) || discountData.discountPercentage < 0 || discountData.discountPercentage > 100) {
    throw new Error('Процент скидки должен быть числом от 0 до 100');
  }
  if (!discountData.discImage) {
    throw new Error('Изображение скидки обязательно');
  }
  if (!discountData.startDate || !discountData.endDate) {
    throw new Error('Даты начала и окончания обязательны');
  }
  if (new Date(discountData.startDate) > new Date(discountData.endDate)) {
    throw new Error('Дата начала должна быть раньше даты окончания');
  }
};

export const getDiscounts = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/discounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!Array.isArray(response.data)) {
      throw new Error('Некорректный формат данных скидок');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw new Error(error.response?.data?.message || 'Не удалось загрузить скидки');
  }
};

export const getDiscountById = async (token, discountId) => {
  if (!discountId) {
    throw new Error('ID скидки обязательно');
  }

  try {
    const response = await axios.get(`${API_URL}/admin/discounts/${discountId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data || !response.data.discountId) {
      throw new Error('Скидка не найдена');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching discount with ID ${discountId}:`, error);
    throw new Error(error.response?.data?.message || `Не удалось загрузить скидку с ID ${discountId}`);
  }
};

export const addDiscount = async (token, discountData) => {
  try {
    validateDiscountData(discountData);
    
    const response = await axios.post(`${API_URL}/admin/discounts`, 
      {
        discountName: discountData.discountName.trim(),
        discountPercentage: Number(discountData.discountPercentage),
        discImage: discountData.discImage,
        startDate: discountData.startDate,
        endDate: discountData.endDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.data || !response.data.discountId) {
      throw new Error('Не удалось создать скидку');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error adding discount:', error);
    throw new Error(error.response?.data?.message || error.message || 'Не удалось добавить скидку');
  }
};

export const updateDiscount = async (token, discountId, discountData) => {
  if (!discountId) {
    throw new Error('ID скидки обязательно');
  }

  try {
    validateDiscountData(discountData);
    
    const response = await axios.put(
      `${API_URL}/admin/discounts/${discountId}`, 
      {
        discountName: discountData.discountName.trim(),
        discountPercentage: Number(discountData.discountPercentage),
        discImage: discountData.discImage,
        startDate: discountData.startDate,
        endDate: discountData.endDate
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.data || !response.data.discountId) {
      throw new Error('Не удалось обновить скидку');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error updating discount with ID ${discountId}:`, error);
    throw new Error(error.response?.data?.message || error.message || `Не удалось обновить скидку с ID ${discountId}`);
  }
};

export const deleteDiscount = async (token, discountId) => {
  if (!discountId) {
    throw new Error('ID скидки обязательно');
  }

  try {
    const response = await axios.delete(
      `${API_URL}/admin/discounts/${discountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error('Не удалось удалить скидку');
    }
    
    return { success: true, discountId };
  } catch (error) {
    console.error(`Error deleting discount with ID ${discountId}:`, error);
    throw new Error(error.response?.data?.message || `Не удалось удалить скидку с ID ${discountId}`);
  }
};