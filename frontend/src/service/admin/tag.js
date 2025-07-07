import axios from 'axios';

const API_URL = 'https://oku-kg.onrender.com/api/admin/tags';

export const getTags = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении тегов:', error);
    return [];
  }
};

export const getTagById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении тега с id ${id}:`, error);
    throw error;
  }
};

export const addTag = async (tagData, token) => {
  try {
    const response = await axios.post(API_URL, tagData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении тега:', error);
    throw error;
  }
};

export const updateTag = async (id, tagData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, tagData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении тега с id ${id}:`, error);
    throw error;
  }
};

export const deleteTag = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении тега с id ${id}:`, error);
    throw error;
  }
};
