import axios from 'axios';

const API_URL = 'https://oku-kg.onrender.com/api/admin/genres';

export const getGenres = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении жанров:', error);
    return [];
  }
};

export const getGenreById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении жанра с id ${id}:`, error);
    throw error;
  }
};

export const addGenre = async (genreData, token) => {
  try {
    const response = await axios.post(API_URL, genreData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении жанра:', error);
    throw error;
  }
};

export const updateGenre = async (id, genreData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, genreData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении жанра с id ${id}:`, error);
    throw error;
  }
};

export const deleteGenre = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении жанра с id ${id}:`, error);
    throw error;
  }
};