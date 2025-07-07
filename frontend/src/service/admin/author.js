import axios from 'axios';

const API_URL = 'https://oku-kg.onrender.com/api/admin/authors';

export const getAuthors = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching authors:', error);
    return []; 
  }
};

export const getAuthorById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching author with id ${id}:`, error);
    throw error; 
  }
};
export const addAuthor = async (authorData, token) => {
  try {
    const response = await axios.post(API_URL, authorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении автора:', error);
    throw error;
  }
};
export const updateAuthor = async (id, authorData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, authorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении автора с id ${id}:`, error);
    throw error;
  }
};

export const deleteAuthor = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении автора с id ${id}:`, error);
    throw error;
  }
};
