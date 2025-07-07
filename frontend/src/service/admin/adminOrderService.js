import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getToken = () => {
  return Cookies.get('token');
}

const AdminOrderService = {
  getAllOrders: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  getOrdersByStatus: async (status, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders/status/${status}`, {
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

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/orders/${orderId}/status?newStatus=${newStatus}`,
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

  getCompletedOrders: async () => {
    try {
      const pickedUpPromise = axios.get(
        `${API_URL}/admin/orders/status/PICKED_UP`, 
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      const deliveredPromise = axios.get(
        `${API_URL}/admin/orders/status/DELIVERED`, 
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      
      const [pickedUpResponse, deliveredResponse] = await Promise.all([
        pickedUpPromise, 
        deliveredPromise
      ]);
      
      const completedOrders = [
        ...pickedUpResponse.data, 
        ...deliveredResponse.data
      ];
      
      return completedOrders;
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      throw error;
    }
  }
};

export default AdminOrderService;