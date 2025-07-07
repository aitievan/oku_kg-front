import axios from 'axios';
import { getBookById } from '@/service/books/book';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const getWishlist = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/wishlist`, getConfig(token));
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении вишлиста:', error);
    throw error;
  }
};

export const getWishlistWithBookDetails = async (token) => {
  try {
    const wishlistItems = await getWishlist(token);

    const itemsWithDetails = await Promise.all(
      wishlistItems.map(async (item) => {
        try {
          const bookDetails = await getBookById(item.bookId);
          return {
            ...item,
            ...bookDetails, 
          };
        } catch (error) {
          console.error(`Не удалось получить детали книги ${item.bookId}:`, error);
          return item; 
        }
      })
    );

    return itemsWithDetails;
  } catch (error) {
    console.error('Ошибка при получении вишлиста с деталями:', error);
    throw error;
  }
};

export const addToWishlist = async (token, bookId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/wishlist/${bookId}`,
      {},
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при добавлении книги с ID ${bookId} в вишлист:`, error);
    throw error;
  }
};

export const removeFromWishlist = async (token, bookId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/wishlist/${bookId}`,
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении книги с ID ${bookId} из вишлиста:`, error);
    throw error;
  }
};

export const clearWishlist = async (token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/wishlist/clear`,
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при очистке вишлиста:', error);
    throw error;
  }
};