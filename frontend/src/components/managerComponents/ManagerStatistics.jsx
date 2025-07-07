'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import OrderService from '@/service/manager/orderService'; 
import dynamic from 'next/dynamic';

const html2canvas = dynamic(() => import('html2canvas').then(mod => mod.default), { ssr: false });


const STATUS_COLORS = {
  'Доставлены': '#4CAF50', 
  'Отправлены': '#2196F3',  
  'В обработке': '#FF9800',  
  'Отменены': '#F44336',   
  'Забраны': '#9C27B0'      
};

export default function ManagerStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: getLastMonthDate(),
    endDate: getCurrentDate(),
  });
  const [pdfLoading, setPdfLoading] = useState(false);
  
  const statisticsRef = useRef(null);

  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function getLastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchStatistics();
  }, []); 

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrderStatistics(
        dateRange.startDate,
        dateRange.endDate
      );
      setStatistics(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err);
      setError('Не удалось загрузить статистику заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterClick = () => {
    fetchStatistics();
  };

  const exportToPDF = async () => {
    if (!statisticsRef.current) return;
    
    setPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
      
      const canvasElement = await html2canvas(statisticsRef.current, {
        scale: 2, 
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      if (!canvasElement || typeof canvasElement.toDataURL !== 'function') {
        throw new Error('html2canvas не смог создать корректный canvas элемент');
      }
      
      const imgData = canvasElement.toDataURL('image/png');
      
      pdf.setFontSize(18);
      pdf.text('Статистика заказов', pdfWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Период: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, pdfWidth / 2, 22, { align: 'center' });
      
      const imgWidth = pdfWidth - 20; 
      const imgHeight = (canvasElement.height * imgWidth) / canvasElement.width;
      
      let heightLeft = imgHeight;
      let position = 30; 
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      
      heightLeft -= (pdfHeight - position);
      while (heightLeft > 0) {
        position = pdfHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`Статистика_заказов_${dateRange.startDate}_${dateRange.endDate}.pdf`);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Не удалось сформировать PDF. Пожалуйста, попробуйте еще раз.');
    } finally {
      setPdfLoading(false);
    }
  };

  const prepareBarChartData = () => {
    if (!statistics) return [];
    
    return [
      { name: 'Доставлены', value: statistics.deliveredOrders, color: STATUS_COLORS['Доставлены'] },
      { name: 'Отправлены', value: statistics.shippedOrders, color: STATUS_COLORS['Отправлены'] },
      { name: 'В обработке', value: statistics.processingOrders, color: STATUS_COLORS['В обработке'] },
      { name: 'Отменены', value: statistics.cancelledOrders, color: STATUS_COLORS['Отменены'] },
      { name: 'Забраны', value: statistics.pickedUpOrders, color: STATUS_COLORS['Забраны'] },
    ];
  };

  const preparePieChartData = () => {
    if (!statistics) return [];
    
    return [
      { name: 'Доставлены', value: statistics.deliveredOrders, color: STATUS_COLORS['Доставлены'] },
      { name: 'Отправлены', value: statistics.shippedOrders, color: STATUS_COLORS['Отправлены'] },
      { name: 'В обработке', value: statistics.processingOrders, color: STATUS_COLORS['В обработке'] },
      { name: 'Отменены', value: statistics.cancelledOrders, color: STATUS_COLORS['Отменены'] },
      { name: 'Забраны', value: statistics.pickedUpOrders, color: STATUS_COLORS['Забраны'] },
    ].filter(item => item.value > 0); 
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
      <div className={`flex-shrink-0 rounded-full p-3 mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-6">Загрузка статистики...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>;
  }

  if (!statistics) {
    return <div className="text-center py-6">Нет данных для отображения</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold">Статистика заказов</h2>
        <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Дата начала
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Дата окончания
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleFilterClick}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Применить фильтр
            </button>
            <button
              onClick={exportToPDF}
              disabled={pdfLoading}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition flex items-center"
            >
              {pdfLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Подготовка...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Скачать PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div ref={statisticsRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Всего заказов" 
            value={statistics.totalOrders} 
            color="bg-blue-100 text-blue-500" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>} 
          />
          <StatCard 
            title="Завершенных заказов" 
            value={statistics.deliveredAndPickedUp} 
            color="bg-green-100 text-green-500" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>} 
          />
          <StatCard 
            title="В процессе" 
            value={statistics.shippedOrders + statistics.processingOrders} 
            color="bg-yellow-100 text-yellow-500" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>} 
          />
          <StatCard 
            title="Среднее время обработки" 
            value={`${statistics.averageProcessingTimeInHours.toFixed(1)} ч`} 
            color="bg-purple-100 text-purple-500" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Распределение заказов по статусам</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareBarChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} заказ(ов)`, 'Количество']}
                    labelFormatter={(label) => `Статус: ${label}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="value" name="Количество">
                    {prepareBarChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="#666" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Процентное соотношение статусов</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true} 
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {preparePieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} заказ(ов)`, name]}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}