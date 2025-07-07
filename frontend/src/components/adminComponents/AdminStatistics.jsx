"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import AdminStatisticsService from "@/service/admin/adminStatisticsService";
import dynamic from "next/dynamic";

const html2canvas = dynamic(
  () => import("html2canvas").then((mod) => mod.default),
  { ssr: false }
);

const STATUS_COLORS = {
  PENDING: "#FF9800", 
  PROCESSING: "#2196F3", 
  SHIPPED: "#9C27B0", 
  DELIVERED: "#4CAF50", 
  PICKED_UP: "#FF9800", 
  CANCELLED: "#F44336", 
  PAYMENT_FAILED: "#795548", 
};

export default function AdminStatistics() {
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
    return today.toISOString().split("T")[0];
  }

  function getLastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await AdminStatisticsService.getAdminStatistics(
        dateRange.startDate,
        dateRange.endDate
      );
      setStatistics(data);
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке статистики:", err);
      setError("Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterClick = () => {
    fetchStatistics();
  };

  const exportToPDF = async () => {
    if (!statisticsRef.current) return;

    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth =
        pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
      const pdfHeight =
        pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();

      const canvasElement = await html2canvas(statisticsRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      if (!canvasElement || typeof canvasElement.toDataURL !== "function") {
        throw new Error(
          "html2canvas не смог создать корректный canvas элемент"
        );
      }

      const imgData = canvasElement.toDataURL("image/png");

      pdf.setFontSize(18);
      pdf.text("Статистика магазина", pdfWidth / 2, 15, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(
        `Период: ${formatDate(dateRange.startDate)} - ${formatDate(
          dateRange.endDate
        )}`,
        pdfWidth / 2,
        22,
        { align: "center" }
      );

      const imgWidth = pdfWidth - 20; 
      const imgHeight = (canvasElement.height * imgWidth) / canvasElement.width;

      let heightLeft = imgHeight;
      let position = 30;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

      heightLeft -= pdfHeight - position;
      while (heightLeft > 0) {
        position = pdfHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(
        `Статистика_магазина_${dateRange.startDate}_${dateRange.endDate}.pdf`
      );
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert("Не удалось сформировать PDF. Пожалуйста, попробуйте еще раз.");
    } finally {
      setPdfLoading(false);
    }
  };

  const translateStatus = (status) => {
    const statusTranslations = {
      PENDING: "Ожидает",
      PROCESSING: "В обработке",
      SHIPPED: "Отправлен",
      DELIVERED: "Доставлен",
      PICKED_UP: "Забран",
      CANCELLED: "Отменен",
      PAYMENT_FAILED: "Ошибка оплаты",
    };
    return statusTranslations[status] || status;
  };

  const prepareOrderStatusData = () => {
    if (!statistics || !statistics.ordersByStatus) return [];
    
    return Object.entries(statistics.ordersByStatus)
      .filter(([status, count]) => status !== 'PENDING' && count > 0) 
      .map(([status, count]) => ({
        name: translateStatus(status),
        value: count,
        color: STATUS_COLORS[status],
        originalStatus: status
      }));
  };
  
  const prepareBarChartData = () => {
    if (!statistics || !statistics.ordersByStatus) return [];
    
    return Object.entries(statistics.ordersByStatus)
      .filter(([status]) => status !== 'PENDING') 
      .map(([status, count]) => ({
        name: translateStatus(status),
        value: count,
        color: STATUS_COLORS[status],
        originalStatus: status
      }));
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

  const ManagerCard = ({ manager, index }) => (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-bold mr-4">
          {index + 1}
        </div>
        <div>
          <h3 className="font-medium">{manager.email}</h3>
          <p className="text-sm text-gray-500">{manager.phone}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Выполнено заказов</p>
        <p className="font-bold text-lg">{manager.completedOrders}</p>
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
        <h2 className="text-xl font-bold">Статистика магазина</h2>
        <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Подготовка...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
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
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            }
          />
          <StatCard
            title="Общая выручка"
            value={`${statistics.totalRevenue.toFixed(2)} сом`}
            color="bg-green-100 text-green-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Всего книг"
            value={statistics.totalBooks}
            color="bg-yellow-100 text-yellow-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
          <StatCard
            title="Книги отсутствуют в наличии"
            value={statistics.outOfStockBooks}
            color="bg-red-100 text-red-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Всего пользователей"
            value={statistics.totalUsers}
            color="bg-indigo-100 text-indigo-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Верифицированные пользователи"
            value={statistics.verifiedUsers}
            color="bg-blue-100 text-blue-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />
          <StatCard
            title="Новые пользователи"
            value={statistics.newUsers}
            color="bg-teal-100 text-teal-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            }
          />
           <StatCard
            title="Среднее время обработки"
            value={`${statistics.averageProcessingTimeHours.toFixed(1)} ч`}
            color="bg-purple-100 text-purple-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">
              Распределение заказов по статусам
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareOrderStatusData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#666", fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} заказ(ов)`,
                      "Количество",
                    ]}
                    labelFormatter={(label) => `Статус: ${label}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Bar dataKey="value" name="Количество">
                    {prepareOrderStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">
              Процентное соотношение статусов
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareOrderStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {prepareOrderStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} заказ(ов)`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {statistics.topManagers && statistics.topManagers.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">Топ менеджеры</h3>
            <div className="space-y-4">
              {statistics.topManagers.map((manager, index) => (
                <ManagerCard
                  key={manager.email}
                  manager={manager}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
