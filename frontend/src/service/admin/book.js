import axios from 'axios';
import { api } from '../axios';

const API_URL = 'https://oku-kg.onrender.com/api/admin/books';

export const getBooks = async (token, page = 0, size = 10) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    return { content: [], totalPages: 0, pageNumber: 0, pageSize: size, totalElements: 0 };
  }
};
export const getBookById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении книги с id ${id}:`, error);
    throw error;
  }
};

export const addBook = async (bookData, token) => {
  try {
    const response = await axios.post(API_URL, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении книги:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении книги с id ${id}:`, error);
    throw error;
  }
};

export const deleteBook = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении книги с id ${id}:`, error);
    throw error;
  }
};