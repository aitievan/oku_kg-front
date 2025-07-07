"use client";

import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { formatDate } from "@/utils/date";
import OrderService from "@/service/manager/orderService";

export default function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchCompletedOrders();
  }, [page, size]); 

  const fetchCompletedOrders = async () => {
    setLoading(true);
    try {
      const completedOrders = await OrderService.getCompletedOrders(page, size);
      
      const orderContent = Array.isArray(completedOrders) 
        ? completedOrders 
        : (completedOrders.content || []);
      
      if (!Array.isArray(completedOrders)) {
        if (completedOrders.totalPages) {
          setTotalPages(completedOrders.totalPages);
        }
        if (completedOrders.totalElements) {
          setTotalElements(completedOrders.totalElements);
        }
      }
      
      const sortedOrders = [...orderContent].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA; 
      });
      
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке завершенных заказов:", err);
      setError("Не удалось загрузить данные заказов. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "PICKED_UP": "bg-green-500",
      "DELIVERED": "bg-green-500",
    };
    
    const statusText = {
      "PICKED_UP": "Забрали заказ",
      "DELIVERED": "Доставлен",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-white text-xs font-bold ${statusClasses[status] || "bg-gray-500"}`}>
        {statusText[status] || status}
      </span>
    );
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Загрузка заказов...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Завершенные заказы</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Заказы, подтвержденные клиентами</h2>
        {orders.length === 0 ? (
          <div className="text-center p-4 bg-gray-100 rounded">
            Завершенные заказы не найдены
          </div>
        ) : (
          <>
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
                    <th className="py-2 px-4 border-b text-left">Подтверждение</th>
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
                        {order.selfPickup ? "Самовывоз" : (order.deliveryCost ? `${order.deliveryCost} сом` : "Не указана")}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.received ? (
                          <span className="px-2 py-1 rounded bg-green-500 text-white text-xs font-bold">
                            Подтверждено
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-yellow-500 text-white text-xs font-bold">
                            Не подтверждено
                          </span>
                        )}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Страница {page + 1} из {totalPages || 1} 
                (показано {orders.length} из {totalElements || orders.length} заказов)
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0); 
                  }}
                  className="border rounded py-1 px-2 text-sm"
                >
                  <option value={5}>5 строк на странице</option>
                  <option value={10}>10 строк на странице</option>
                  <option value={20}>20 строк на странице</option>
                  <option value={50}>50 строк на странице</option>
                </select>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(0)}
                    disabled={page === 0}
                    className={`px-3 py-1 border rounded ${
                      page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                    }`}
                    title="Первая страница"
                  >
                    «
                  </button>
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className={`px-3 py-1 border rounded ${
                      page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                    className={`px-3 py-1 border rounded ${
                      page >= totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    Вперед
                  </button>
                  <button
                    onClick={() => setPage(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className={`px-3 py-1 border rounded ${
                      page >= totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
                    }`}
                    title="Последняя страница"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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
              <div>
                <p className="font-semibold">Подтверждение клиента:</p>
                <p>{selectedOrder.received ? "Подтверждено" : "Не подтверждено"}</p>
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
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}