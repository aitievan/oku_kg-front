'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import OrderService from '@/service/manager/orderService'; 
import ManagerStatistics from '@/components/managerComponents/ManagerStatistics';
export default function ManagerDashboard() {
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    
    console.log('Manager page loaded with:', { token: !!token, role });
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await OrderService.getUserProfile();
        setUserData({
          email: profileData.email || '',
          phone: profileData.phone || '',
          username: profileData.username || '',
          role: role
        });
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="p-8">

      {loading ? (
        <div className="text-center py-4">Загрузка данных профиля...</div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded mb-6 text-red-700">{error}</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Информация о менеджере</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Имя пользователя:</p>
              <p className="font-medium">{userData.username || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Email:</p>
              <p className="font-medium">{userData.email || 'Не указано'}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Телефон:</p>
              <p className="font-medium">{userData.phone || 'Не указано'}</p>
            </div>
          </div>
        </div>
      )}
      
      <ManagerStatistics />
    </div>
  );
}