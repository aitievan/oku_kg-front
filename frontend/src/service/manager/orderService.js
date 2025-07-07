import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getToken = () => {
  return Cookies.get('token');
}

const OrderService = {
  getUnassignedOrders: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/manager/orders/unassigned`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unassigned orders:', error);
      throw error;
    }
  },

  getOrdersByStatus: async (status, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/manager/orders/status/${status}`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  },
  
  getMyOrders: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/manager/orders/my-orders`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/manager/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  getOrderStatistics: async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `${API_URL}/manager/orders/statistics?startDate=${startDate}&endDate=${endDate}`, 
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${API_URL}/manager/orders/${orderId}/status?newStatus=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status to ${newStatus}:`, error);
      throw error;
    }
  },

  setDeliveryCost: async (orderId, deliveryCost) => {
    try {
      const response = await axios.post(
        `${API_URL}/manager/orders/${orderId}/delivery-cost?deliveryCost=${deliveryCost}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error setting delivery cost for order ${orderId}:`, error);
      throw error;
    }
  },

  assignOrderToMe: async (orderId) => {
    try {
      const response = await axios.post(
        `${API_URL}/manager/orders/${orderId}/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error assigning order ${orderId}:`, error);
      throw error;
    }
  },

  getCompletedOrders: async (page = 0, size = 10) => {
    try {
      const largerSize = size * 3;
      const pickedUpPromise = axios.get(
        `${API_URL}/manager/orders/status/PICKED_UP`, 
        { 
          params: { page: 0, size: largerSize }, 
          headers: { Authorization: `Bearer ${getToken()}` } 
        }
      );
      
      const deliveredPromise = axios.get(
        `${API_URL}/manager/orders/status/DELIVERED`, 
        { 
          params: { page: 0, size: largerSize }, 
          headers: { Authorization: `Bearer ${getToken()}` } 
        }
      );
      
      const [pickedUpResponse, deliveredResponse] = await Promise.all([
        pickedUpPromise, 
        deliveredPromise
      ]);
      
      const pickedUpContent = Array.isArray(pickedUpResponse.data) 
        ? pickedUpResponse.data 
        : (pickedUpResponse.data.content || []);
        
      const deliveredContent = Array.isArray(deliveredResponse.data) 
        ? deliveredResponse.data 
        : (deliveredResponse.data.content || []);
      
      let allCompletedOrders = [...pickedUpContent, ...deliveredContent];
      
      allCompletedOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; 
      });
      
      const totalElements = allCompletedOrders.length;
      
      const totalPages = Math.ceil(totalElements / size);
      
      const startIndex = page * size;
      const endIndex = Math.min(startIndex + size, totalElements);
      
      const paginatedOrders = allCompletedOrders.slice(startIndex, endIndex);
      
      return {
        content: paginatedOrders,
        totalPages: totalPages,
        totalElements: totalElements,
        size: size,
        number: page,
        numberOfElements: paginatedOrders.length
      };
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      throw error;
    }
  }
};

export default OrderService;