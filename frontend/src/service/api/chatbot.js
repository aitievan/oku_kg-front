import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oku-kg.onrender.com/api';

const getToken = () => {
  return Cookies.get('token');
};

const getHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  };
};

const startChat = async () => {
  try {
    const response = await axios.get(`${apiUrl}/public/chatbot/start`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Ошибка при запуске чата:", error);
    throw error;
  }
};

const getNodeById = async (nodeId) => {
  try {
    const response = await axios.get(`${apiUrl}/public/chatbot/node/${nodeId}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении узла ${nodeId}:`, error);
    throw error;
  }
};

const getAllNodes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/public/chatbot/all`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении всех узлов:", error);
    throw error;
  }
};

const chatbotService = {
  startChat,
  getNodeById,
  getAllNodes
};

export default chatbotService;