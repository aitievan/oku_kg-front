import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ManagerService = {
  /**
   * Получить список всех менеджеров.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Array>} - Список менеджеров.
   */
  async getManagers(token,page=0,size=10) {
    try {
      const response = await axios.get(`${API_URL}/admin/managers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params:{
          page,
          size
        }
      });
      return response.data;
    } catch (err) {
      console.error("Ошибка при получении менеджеров:", err);
      throw new Error("Не удалось загрузить менеджеров. Пожалуйста, попробуйте снова.");
    }
  },

  /**
   * Получить данные одного менеджера по его ID.
   * @param {number} userId - ID менеджера.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Object>} - Данные менеджера.
   */
  async getManagerById(userId, token) {
  try {
    if (!userId) {
      throw new Error("ID менеджера не указан");
    }

    const managers = await this.getManagers(token);
    if (!managers || managers.length === 0) {
      throw new Error("Список менеджеров пуст");
    }

    const manager = managers.find((m) => Number(m.userId) === Number(userId));
    
    if (!manager) {
      throw new Error("Менеджер не найден");
    }

    return manager;
  } catch (err) {
    console.error("Ошибка при получении данных менеджера:", err);
    throw new Error("Не удалось загрузить данные менеджера. Пожалуйста, попробуйте снова.");
  }
},

  /**
   * Зарегистрировать нового менеджера.
   * @param {Object} managerData - Данные для регистрации менеджера.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Object>} - Ответ сервера.
   */
  async registerManager(managerData, token) {
    try {
      const response = await axios.post(
        `${API_URL}/admin/managers/register`,
        { ...managerData, role: "MANAGER" }, // Устанавливаем роль "manager"
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при регистрации менеджера:", err);
      throw new Error("Не удалось зарегистрировать менеджера. Пожалуйста, попробуйте снова.");
    }
  },

  /**
   * Обновить профиль менеджера.
   * @param {number} userId - ID менеджера.
   * @param {Object} profileData - Данные для обновления.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Object>} - Ответ сервера.
   */
  async updateManagerProfile(userId, profileData, token) {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/managers/${userId}/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при обновлении профиля менеджера:", err);
      throw new Error("Не удалось обновить профиль менеджера. Пожалуйста, попробуйте снова.");
    }
  },

  /**
   * Блокировка/разблокировка менеджера.
   * @param {number} userId - ID менеджера.
   * @param {boolean} blocked - Новый статус блокировки.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Object>} - Ответ сервера.
   */
  async blockManager(userId, blocked, token) {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/managers/${userId}/block-status?blocked=${blocked}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при блокировке/разблокировке менеджера:", err);
      throw new Error("Не удалось обновить статус менеджера. Пожалуйста, попробуйте снова.");
    }
  },

  /**
   * Удалить менеджера с предварительной очисткой связанных данных.
   * @param {number} userId - ID менеджера.
   * @param {string} token - Токен авторизации.
   * @returns {Promise<Object>} - Ответ сервера.
   */
  async deleteManager(userId, token) {
    try {
      if (!userId) {
        throw new Error("userId обязателен для выполнения запроса.");
      }
      
      try {
        await axios.delete(`${API_URL}/admin/email-tokens/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (tokenErr) {
        console.warn("Ошибка при удалении токенов верификации:", tokenErr);
      }
      
      const response = await axios.delete(`${API_URL}/admin/managers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (err) {
      console.error("Ошибка при удалении менеджера:", err);
      
      if (err.response && err.response.data && 
          (err.response.data.message?.includes("foreign key constraint") ||
           JSON.stringify(err.response.data).includes("foreign key constraint"))) {
        throw new Error("Не удалось удалить менеджера: существуют связанные данные. Обратитесь к администратору базы данных.");
      }
      
      throw new Error("Не удалось удалить менеджера. Пожалуйста, попробуйте снова.");
    }
  },
};

export default ManagerService;