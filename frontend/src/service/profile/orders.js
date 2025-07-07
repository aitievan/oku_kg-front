import { api } from '@/service/axios';

export const getUserOrders = async (token, page = 0, size = 5) => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders/my-orders`,
    {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getOrderById = async (orderId, token) => {
  try {
    const { data } = await api.get(`/user/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.error(`Ошибка при получении заказа #${orderId}:`, error);
    throw error;
  }
};

export const confirmOrderDelivery = async (orderId, token) => {
  try {
    const { data } = await api.put(`/user/orders/${orderId}/confirm-delivery`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.error(`Ошибка при подтверждении получения заказа #${orderId}:`, error);
    throw error;
  }
};