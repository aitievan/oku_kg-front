import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const UserService = {
  async getUsers(token,page=0,size=10) {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
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
      console.error("Ошибка при получении пользователей:", err);
      throw new Error("Не удалось загрузить пользователей. Пожалуйста, попробуйте снова.");
    }
  },

  async blockUser(userId, blocked, token) {
    try {
      if (!userId || blocked === undefined) {
        throw new Error("userId и blocked обязательны для выполнения запроса.");
      }

      const response = await axios.patch(
        `${API_URL}/admin/users/${userId}/block-status?blocked=${blocked}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при блокировке/разблокировке пользователя:", err);
      throw new Error("Не удалось обновить статус пользователя. Пожалуйста, попробуйте снова.");
    }
  },

  async deleteUser(userId, token) {
    try {
      if (!userId) {
        throw new Error("userId обязателен для выполнения запроса.");
      }

      const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      throw new Error("Не удалось удалить пользователя. Пожалуйста, попробуйте снова.");
    }
  },
};

export default UserService;