'use client';

import React, { useState, useEffect } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { formatDate } from "@/utils/date";
import AdminOrderService from "@/service/admin/adminOrderService";
import Pagination from "@/components/Pagination"; 

export default function AdminOrderTable({ 
  orderType = "all", 
  status = null,
  title = "Заказы"
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentFilter, setCurrentFilter] = useState(status || "ALL");
  
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const statusOptions = [
    { value: "ALL", label: "Все" },
    { value: "PENDING", label: "В ожидании" },
    { value: "PROCESSING", label: "В обработке" },
    { value: "SHIPPED", label: "Отправлен" },
    { value: "DELIVERED", label: "Доставлен" },
    { value: "PICKED_UP", label: "Забрали" },
    { value: "CANCELLED", label: "Отменен" },
    { value: "PAYMENT_FAILED", label: "Платеж не выполнен" }
  ];

  useEffect(() => {
    fetchOrders();
  }, [orderType, status, currentFilter, currentPage, pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data;
      const apiPage = currentPage - 1; 
      
      if (currentFilter !== "ALL" && currentFilter !== null) {
        data = await AdminOrderService.getOrdersByStatus(currentFilter, apiPage, pageSize);
      } else if (orderType === 'completed') {
        data = await AdminOrderService.getCompletedOrders(apiPage, pageSize);
      } else {
        data = await AdminOrderService.getAllOrders(apiPage, pageSize);
      }
      
      if (data && Array.isArray(data.content)) {
        setOrders(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
        setTotalElements(data.length);
        console.warn('API вернуло данные без информации о пагинации');
      } else {
        console.error('Неожиданный формат данных:', data);
        setOrders([]);
        setTotalPages(1);
        setTotalElements(0);
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке заказов:", err);
      setError("Не удалось загрузить данные заказов. Пожалуйста, попробуйте позже.");
      setOrders([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page + 1); 
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await AdminOrderService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); 
      if (showModal) setShowModal(false);
      if (showStatusModal) setShowStatusModal(false);
    } catch (err) {
      console.error("Ошибка при изменении статуса заказа:", err);
      alert("Не удалось изменить статус заказа. Пожалуйста, попробуйте позже.");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "PENDING": "bg-yellow-500",
      "PROCESSING": "bg-blue-500",
      "SHIPPED": "bg-purple-500",
      "DELIVERED": "bg-green-500",
      "PICKED_UP": "bg-green-500",
      "CANCELLED": "bg-red-500",
      "PAYMENT_FAILED": "bg-red-600"
    };
    
    const statusOption = statusOptions.find(option => option.value === status);
    const statusText = statusOption ? statusOption.label : status;
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-white text-xs font-bold ${statusClasses[status] || "bg-gray-500"}`}>
        {statusText}
      </span>
    );
  };

  const getReceivedStatus = (received) => {
    return received ? (
      <span className="inline-block w-full px-2 py-1 rounded text-white text-xs font-bold bg-green-500 text-center">
        Подтверждено
      </span>
    ) : (
      <span className="inline-block w-full px-2 py-1 rounded text-white text-xs font-bold bg-gray-500 text-center">
        Не подтверждено
      </span>
    );
  };

  if (loading && orders.length === 0) {
    return <div className="p-4 text-center">Загрузка заказов...</div>;
  }

  if (error && orders.length === 0) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-sm">Фильтр по статусу:</label>
          <select
            id="statusFilter"
            value={currentFilter}
            onChange={(e) => {
              setCurrentFilter(e.target.value);
              setCurrentPage(1); 
            }}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading && <div className="text-center p-2">Обновление данных...</div>}
      
      {orders.length === 0 && !loading ? (
        <div className="text-center p-4 bg-gray-100 rounded">
          Заказы не найдены
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 border-b text-left w-[5%]">ID</th>
                  <th className="py-2 px-2 border-b text-left w-[15%]">Клиент</th>
                  <th className="py-2 px-2 border-b text-left w-[15%]">Менеджер</th>
                  <th className="py-2 px-2 border-b text-left w-[12%]">Дата</th>
                  <th className="py-2 px-2 border-b text-left w-[10%]">Сумма</th>
                  <th className="py-2 px-2 border-b text-left w-[10%]">Статус</th>
                  <th className="py-2 px-2 border-b text-left w-[12%]">Получение</th>
                  <th className="py-2 px-2 border-b text-left w-[12%]">Подтверждение</th>
                  <th className="py-2 px-2 border-b text-left w-[9%]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="py-2 px-2 border-b truncate">{order.orderId}</td>
                    <td className="py-2 px-2 border-b truncate" title={order.userEmail || "Не указан"}>
                      {order.userEmail || "Не указан"}
                    </td>
                    <td className="py-2 px-2 border-b truncate" title={order.managerEmail || "Не назначен"}>
                      {order.managerEmail || "Не назначен"}
                    </td>
                    <td className="py-2 px-2 border-b whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="py-2 px-2 border-b whitespace-nowrap">{order.discountedPrice} сом</td>
                    <td className="py-2 px-2 border-b text-center">{getStatusBadge(order.status)}</td>
                    <td className="py-2 px-2 border-b">
                      {order.selfPickup ? 
                        "Самовывоз" : 
                        <span className="whitespace-nowrap">Доставка ({order.deliveryCost || 0} сом)</span>
                      }
                    </td>
                    <td className="py-2 px-2 border-b text-center">
                      {getReceivedStatus(order.received)}
                    </td>
                    <td className="py-2 px-2 border-b">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Просмотреть детали"
                        >
                          <FaEye />
                        </button>
                        
                        <button
                          onClick={() => openStatusModal(order)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Изменить статус"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </>
      )}
      
      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Заказ #{selectedOrder.orderId}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-semibold">Email клиента:</p>
                <p>{selectedOrder.userEmail || "Не указан"}</p>
              </div>
              <div>
                <p className="font-semibold">Телефон клиента:</p>
                <p>{selectedOrder.phoneNumber || "Не указан"}</p>
              </div>
              <div>
                <p className="font-semibold">Email менеджера:</p>
                <p>{selectedOrder.managerEmail || "Не назначен"}</p>
              </div>
              <div>
                <p className="font-semibold">Телефон менеджера:</p>
                <p>{selectedOrder.managerPhone || "Не указан"}</p>
              </div>
              <div>
                <p className="font-semibold">Тип получения:</p>
                <p>{selectedOrder.selfPickup ? "Самовывоз" : "Доставка"}</p>
              </div>
              <div>
                <p className="font-semibold">Дата заказа:</p>
                <p>{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="font-semibold">Статус:</p>
                <p>{getStatusBadge(selectedOrder.status)}</p>
              </div>
              <div>
                <p className="font-semibold">Сумма:</p>
                <p>{selectedOrder.discountedPrice} сом</p>
              </div>
              <div>
                <p className="font-semibold">Подтверждение получения:</p>
                <p>{getReceivedStatus(selectedOrder.received)}</p>
              </div>
              {!selectedOrder.selfPickup && (
                <>
                  <div>
                    <p className="font-semibold">Стоимость доставки:</p>
                    <p>{selectedOrder.deliveryCost ? `${selectedOrder.deliveryCost} сом` : "Не указана"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Адрес доставки:</p>
                    <p>{selectedOrder.deliveryAddress || "Не указан"}</p>
                  </div>
                </>
              )}
              {selectedOrder.additionalNotes && (
                <div className="col-span-2">
                  <p className="font-semibold">Дополнительные примечания:</p>
                  <p>{selectedOrder.additionalNotes}</p>
                </div>
              )}
            </div>
            
            <h4 className="font-bold mb-2">Товары в заказе:</h4>
            {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Товар</th>
                    <th className="py-2 px-4 text-right">Кол-во</th>
                    <th className="py-2 px-4 text-right">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item) => (
                    <tr key={item.orderItemId} className="border-b">
                      <td className="py-2 px-4">{item.bookTitle}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">{item.price} сом</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="py-2 px-4" colSpan="2">Итого:</td>
                    <td className="py-2 px-4 text-right">{selectedOrder.discountedPrice} сом</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p className="mb-4">Информация о товарах отсутствует</p>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  openStatusModal(selectedOrder);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Изменить статус
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Изменение статуса заказа</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <p className="mb-4">Выберите новый статус для заказа #{selectedOrder.orderId}</p>
            
            <div className="mb-4">
              <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Статус заказа
              </label>
              <select
                id="orderStatus"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.filter(option => option.value !== "ALL").map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleStatusChange(selectedOrder.orderId, selectedStatus)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}