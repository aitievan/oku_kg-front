"use client";

import { useState, useEffect } from "react";
import ManagerService from "@/service/admin/manager";
import ManagerTable from "@/components/adminComponents/ManagerTable";
import Cookies from "js-cookie";
import Link from "next/link";

export default function ManagersPage() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(0); 
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(Cookies.get("token") || "");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchManagers();
    }
  }, [token, currentPage, pageSize]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const data = await ManagerService.getManagers(token, currentPage, pageSize);
      
      if (data.content) {
        setManagers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        setManagers(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке менеджеров:", err);
      setError(
        "Не удалось загрузить менеджеров. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlockManager = async (userId, blocked) => {
    try {
      await ManagerService.blockManager(userId, blocked, token);
      setManagers(
        managers.map((manager) =>
          manager.userId === userId
            ? { ...manager, isBlocked: blocked }
            : manager
        )
      );
      setError(null);
    } catch (err) {
      console.error("Ошибка при блокировке/разблокировке менеджера:", err);
      setError(
        "Не удалось обновить статус менеджера. Пожалуйста, попробуйте снова."
      );
    }
  };

  const handleDeleteManager = async (userId) => {
    try {
      await ManagerService.deleteManager(userId, token);
      
      if (managers.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchManagers();
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при удалении менеджера:", err);
      setError("Не удалось удалить менеджера. Пожалуйста, попробуйте снова.");
    }
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); 
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление менеджерами</h1>
        <Link
          href="/admin/managers/add"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Добавить менеджера
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && managers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Загрузка менеджеров...</p>
        </div>
      ) : (
        <>
          <ManagerTable
            managers={managers}
            onBlockManager={handleBlockManager}
            onDeleteManager={handleDeleteManager}
            loading={loading}
          />
        
        {totalPages > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Показано <span className="font-medium">{managers.length}</span> из{" "}
                <span className="font-medium">{totalElements}</span> менеджеров
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="px-2 py-1 border rounded text-sm bg-white"
                >
                  <option value="5">5 на странице</option>
                  <option value="10">10 на странице</option>
                  <option value="20">20 на странице</option>
                  <option value="50">50 на странице</option>
                </select>
                
                <div className="flex space-x-1">
                 
                  <button
                    onClick={() => handlePageChange(0)}
                    disabled={currentPage === 0}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    «
                  </button>
                  
                 
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    ‹
                  </button>
                  
                
                  {(() => {
                    const pageNumbers = [];
                    const maxVisiblePages = 5;
                    
                    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(0, endPage - maxVisiblePages + 1);
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === i
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    }
                    
                    return pageNumbers;
                  })()}
                  
                
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage >= totalPages - 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    ›
                  </button>
                  
            
                  <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage >= totalPages - 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}