import React, { useEffect, useState } from "react";
import { getUserOrders, confirmOrderDelivery } from "@/service/profile/orders";
import { formatDate } from "@/utils/date";

const OrderHistory = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = async (pageNum = page) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await getUserOrders(token, pageNum, size);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.pageNumber || 0);
    } catch (error) {
      console.error("Буюртмалар тарыхын жүктөөдө ката кетти:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleConfirmDelivery = async (orderId) => {
    if (window.confirm("Буюртманы алганыңызды ырастайсызбы?")) {
      setProcessingOrderId(orderId);
      try {
        await confirmOrderDelivery(orderId, token);
        fetchOrders();
      } catch (error) {
        console.error("Жеткирүүнү ырастоодо ката кетти:", error);
      } finally {
        setProcessingOrderId(null);
      }
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Иштетүү баскычында",
      PROCESSING: "Иштелүүдө",
      CONFIRMED: "Ырасталган",
      SHIPPED: "Жөнөтүлгөн",
      DELIVERED: "Жеткирилген",
      CANCELLED: "Жокко чыгарылган",
      COMPLETED: "Аяктаган",
      PICKED_UP: "Алынды",
      PAYMENT_FAILED: "Төлөм аткарылбады",
    };
    return statusMap[status] || status;
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">Сизде буюртмалар жок</div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-200 rounded-md overflow-hidden"
        >
          <div
            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
            onClick={() => toggleOrderDetails(order.orderId)}
          >
            <div>
              <div className="font-medium">Буюртма #{order.orderId}</div>
              <div className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  order.status === "COMPLETED" || order.status === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {getStatusText(order.status)}
              </span>
              <span className="ml-4 font-semibold">{order.totalAmount}с</span>
              <svg
                className={`ml-2 w-5 h-5 transition-transform ${
                  expandedOrder === order.orderId ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {expandedOrder === order.orderId && (
            <div className="p-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <span className="text-sm text-gray-500">Алуу ыкмасы:</span>
                  <div>{order.selfPickup ? "Өзүм алып кетем" : "Жеткирүү"}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Телефон:</span>
                  <div>{order.phoneNumber || "Көрсөтүлгөн эмес"}</div>
                </div>
                {!order.selfPickup && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      Жеткирүү дареги:
                    </span>
                    <div>{order.deliveryAddress || "Көрсөтүлгөн эмес"}</div>
                  </div>
                )}
                {order.additionalNotes && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      Кошумча маалымат:
                    </span>
                    <div>{order.additionalNotes}</div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h4 className="font-medium mb-2">Буюртмадагы товарлар:</h4>
                <div className="space-y-2">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex justify-between border-b border-gray-100 pb-2"
                    >
                      <div>
                        <div>{item.bookTitle}</div>
                        <div className="text-sm text-gray-500">
                          {item.quantity} даана × {item.price}с
                        </div>
                      </div>
                      <div className="font-medium">
                        {item.quantity * item.price}с
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <div className="text-sm">
                    Жалпы суммасы:{" "}
                    <span className="font-bold">{order.totalAmount}с</span>
                  </div>
                  {order.deliveryCost > 0 && (
                    <div className="text-xs text-gray-500">
                      Жеткирүү кошулган: {order.deliveryCost}с
                    </div>
                  )}
                </div>

                {(order.status === "PICKED_UP" ||
                  order.status === "DELIVERED") &&
                  !order.received && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDelivery(order.orderId);
                      }}
                      disabled={processingOrderId === order.orderId}
                      className={`px-4 py-1 rounded text-sm ${
                        processingOrderId === order.orderId
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {processingOrderId === order.orderId
                        ? "Иштетүүдө..."
                        : "Алгандыгын ырастоо"}
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0 || isLoading}
            className={`px-3 py-1 rounded ${
              page === 0 || isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            &lt;
          </button>
          
          {[...Array(totalPages).keys()].map((pageNum) => {
        
            const isVisible = 
              totalPages <= 5 || 
              pageNum === 0 || 
              pageNum === totalPages - 1 || 
              Math.abs(pageNum - page) <= 1;
            
            const showEllipsis = 
              !isVisible && 
              (pageNum === page - 2 || pageNum === page + 2) &&
              totalPages > 5;
              
            if (!isVisible && !showEllipsis) return null;
            
            if (showEllipsis) {
              return (
                <span key={`ellipsis-${pageNum}`} className="px-2">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handleChangePage(pageNum)}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  page === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
          
          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1 || isLoading}
            className={`px-3 py-1 rounded ${
              page >= totalPages - 1 || isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
      
      {isLoading && orders.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {totalElements > 0 && (
        <div className="text-center text-sm text-gray-500">
          Жалпы: {totalElements} буюртма
        </div>
      )}
    </div>
  );
};

export default OrderHistory;