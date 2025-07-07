import axios from 'axios';

const AdminStatisticsService = {
  /**
   * @param {string} startDate - Начальная дата в формате YYYY-MM-DD
   * @param {string} endDate - Конечная дата в формате YYYY-MM-DD
   * @returns {Promise} - Промис с данными статистики
   */
  getAdminStatistics: async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/statistics`, 
        {
          params: { startDate, endDate },
          headers: {
            'Authorization': `Bearer ${
              typeof window !== 'undefined' ? 
              document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1") : ''
            }`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статистики админа:', error);
      throw error;
    }
  }
};

export default AdminStatisticsService;