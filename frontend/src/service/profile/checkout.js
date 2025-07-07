import { api } from '@/service/axios';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Метод не разрешен' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    const { data } = await api.post('/user/orders/create', req.body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!data?.sessionId) {
      throw new Error('Не удалось создать сессию оплаты');
    }

    res.status(200).json({ 
      success: true,
      sessionId: data.sessionId 
    });
    
  } catch (error) {
    console.error('Ошибка в API checkout:', error);
    res.status(500).json({ 
      success: false,
      message: error.response?.data?.message || error.message || 'Ошибка сервера' 
    });
  }
}