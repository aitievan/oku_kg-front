import axios from 'axios';
import { getBookById } from '@/service/books/book';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const getCart = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/cart/items`, getConfig(token));
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    throw error;
  }
};

export const getCartWithBookDetails = async (token) => {
  try {
    const cartItems = await getCart(token);

    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
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
    console.error('Ошибка при получении корзины с деталями:', error);
    throw error;
  }
};

export const addToCart = async (token, bookId, quantity = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/cart/add`,
      { bookId, quantity },
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при добавлении книги с ID ${bookId} в корзину:`, error);
    throw error;
  }
};

export const increaseCartItem = async (token, cartItemId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/cart/increase/${cartItemId}`,
      {},
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при увеличении количества книги с ID ${cartItemId} в корзине:`, error);
    throw error;
  }
};

export const decreaseCartItem = async (token, cartItemId) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/cart/decrease/${cartItemId}`,
      {},
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при уменьшении количества книги с ID ${cartItemId} в корзине:`, error);
    throw error;
  }
};

export const removeFromCart = async (token, cartItemId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/cart/remove/${cartItemId}`,
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении книги с ID ${cartItemId} из корзины:`, error);
    throw error;
  }
};

export const clearCart = async (token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/cart/clear`,
      getConfig(token)
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    throw error;
  }
};