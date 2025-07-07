'use client';

import React, { useState, useEffect } from "react";
import { FaEdit, FaCheckCircle, FaEye, FaTruck } from "react-icons/fa";
import { formatDate } from "@/utils/date";
import OrderService from "@/service/manager/orderService";
import Pagination from "@/components/Pagination";

export default function OrderTable({ 
  orderType = "all",
  status = null,
  title = "Заказы"
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [showDeliveryCostModal, setShowDeliveryCostModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const statusOptions = [
    { value: "PENDING", label: "В ожидании" },
    { value: "PROCESSING", label: "В обработке" },
    { value: "SHIPPED", label: "Отправлен" },
    { value: "DELIVERED", label: "Доставлен" },
    { value: "PICKED_UP", label: "Забрали заказ" },
    { value: "CANCELLED", label: "Отменен" },
    { value: "PAYMENT_FAILED", label: "Платеж не выполнен" }
  ];

  useEffect(() => {
    fetchOrders();
  }, [orderType, status, currentPage, pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data;
      const page = currentPage - 1;
      switch (orderType) {
        case 'unassigned':
          data = await OrderService.getUnassignedOrders(page, pageSize);
          break;
        case 'my':
          data = await OrderService.getMyOrders(page, pageSize);
          break;
        case 'status':
          if (!status) throw new Error('Status is required for status type');
          data = await OrderService.getOrdersByStatus(status, page, pageSize);
          break;
        default:
          data = await OrderService.getUnassignedOrders(page, pageSize);
      }
      
      if (data && data.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages || 1);
      } else {
        setOrders(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке заказов:", err);
      setError("Не удалось загрузить данные заказов. Пожалуйста, попробуйте позже.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId) => {
    try {
      await OrderService.assignOrderToMe(orderId);
      fetchOrders(); 
    } catch (err) {
      console.error("Ошибка при назначении заказа:", err);
      alert("Не удалось назначить заказ. Пожалуйста, попробуйте позже.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      fetchOrders(); 
      if (showModal) setShowModal(false);
      if (showStatusModal) setShowStatusModal(false);
    } catch (err) {
      console.error("Ошибка при изменении статуса заказа:", err);
      alert("Не удалось изменить статус заказа. Пожалуйста, попробуйте позже.");
    }
  };

  const handleSetDeliveryCost = async (orderId) => {
    try {
      await OrderService.setDeliveryCost(orderId, deliveryCost);
      fetchOrders(); 
      setShowDeliveryCostModal(false);
    } catch (err) {
      console.error("Ошибка при установке стоимости доставки:", err);
      alert("Не удалось установить стоимость доставки. Пожалуйста, попробуйте позже.");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const openDeliveryCostModal = (order) => {
    setSelectedOrder(order);
    setDeliveryCost(order.deliveryCost || 0);
    setShowDeliveryCostModal(true);
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
      <span className={`px-2 py-1 rounded text-white text-xs font-bold ${statusClasses[status] || "bg-gray-500"}`}>
        {statusText}
      </span>
    );
  };

  const canMoveToNextStage = (status, selfPickup) => {
    switch (status) {
      case "PENDING":
        return "PROCESSING"; 
      case "PROCESSING":
        return "SHIPPED"; 
      case "SHIPPED":
        return selfPickup ? "PICKED_UP" : "DELIVERED"; 
      default:
        return null;
    }
  };

  const getNextStageButtonText = (status, selfPickup) => {
    switch (status) {
      case "PENDING":
        return "Начать обработку";
      case "PROCESSING":
        return "Отметить как отправленный";
      case "SHIPPED":
        return selfPickup ? "Отметить как полученный" : "Отметить как доставленный";
      default:
        return "";
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page + 1); 
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  if (loading) {
    return <div className="p-4 text-center">Загрузка заказов...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {orders.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded">
          Заказы не найдены
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Клиент</th>
                <th className="py-2 px-4 border-b text-left">Дата</th>
                <th className="py-2 px-4 border-b text-left">Сумма</th>
                <th className="py-2 px-4 border-b text-left">Статус</th>
                <th className="py-2 px-4 border-b text-left">Доставка</th>
                <th className="py-2 px-4 border-b text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{order.orderId}</td>
                  <td className="py-2 px-4 border-b">{order.userEmail || "Не указан"}</td>
                  <td className="py-2 px-4 border-b">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4 border-b">{order.discountedPrice} сом</td>
                  <td className="py-2 px-4 border-b">{getStatusBadge(order.status)}</td>
                  <td className="py-2 px-4 border-b">
                    {order.selfPickup ? "Самовывоз" : (order.deliveryCost ? `${order.deliveryCost} сом` : "Доставка")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Просмотреть детали"
                      >
                        <FaEye />
                      </button>
                      
                      {orderType === 'unassigned' && (
                        <button
                          onClick={() => handleAssignOrder(order.orderId)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Взять заказ"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      
                      {(orderType === 'my' || orderType === 'status') && (
                        <button
                          onClick={() => openStatusModal(order)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Изменить статус"
                        >
                          <FaEdit />
                        </button>
                      )}
                      
                      {!order.selfPickup && (orderType === 'my' || orderType === 'status') && 
                       order.status !== "DELIVERED" && order.status !== "PICKED_UP" && 
                       order.status !== "CANCELLED" && order.status !== "PAYMENT_FAILED" && (
                        <button
                          onClick={() => openDeliveryCostModal(order)}
                          className="p-1 text-purple-600 hover:text-purple-800"
                          title="Установить стоимость доставки"
                        >
                          <FaTruck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
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
                <p className="font-semibold">Телефон:</p>
                <p>{selectedOrder.phoneNumber || "Не указан"}</p>
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
              {orderType === 'unassigned' && (
                <button
                  onClick={() => {
                    handleAssignOrder(selectedOrder.orderId);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Взять заказ
                </button>
              )}
              
              {(orderType === 'my' || orderType === 'status') && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    openStatusModal(selectedOrder);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Изменить статус
                </button>
              )}
              
              {!selectedOrder.selfPickup && (orderType === 'my' || orderType === 'status') && 
               selectedOrder.status !== "DELIVERED" && selectedOrder.status !== "PICKED_UP" && 
               selectedOrder.status !== "CANCELLED" && selectedOrder.status !== "PAYMENT_FAILED" && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    openDeliveryCostModal(selectedOrder);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Установить стоимость доставки
                </button>
              )}
              
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

      {showDeliveryCostModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Стоимость доставки</h3>
              <button
                onClick={() => setShowDeliveryCostModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <p className="mb-4">Установите стоимость доставки для заказа #{selectedOrder.orderId}</p>
            
            <div className="mb-4">
              <label htmlFor="deliveryCost" className="block text-sm font-medium text-gray-700 mb-1">
                Стоимость доставки (сом)
              </label>
              <input
                type="text"
                id="deliveryCost"
                value={deliveryCost}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '.').replace(/[^\d.]/g, '');
                  const parts = value.split('.');
                  const sanitizedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : value;
                  setDeliveryCost(sanitizedValue === '' ? 0 : parseFloat(sanitizedValue));
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleSetDeliveryCost(selectedOrder.orderId)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowDeliveryCostModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Отмена
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
                {statusOptions.map(option => (
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