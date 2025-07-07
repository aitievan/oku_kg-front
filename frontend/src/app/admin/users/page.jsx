"use client";

import { useState, useEffect } from "react";
import UserService from "@/service/admin/users";
import UserTable from "@/components/adminComponents/UserTable";
import Cookies from "js-cookie";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
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
      fetchUsers();
    }
  }, [token, currentPage, pageSize]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers(token, currentPage, pageSize);
      setUsers(data.content || data); 
      
      if (data.totalPages !== undefined) {
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
     
        setTotalPages(1);
        setTotalElements(data.length);
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке пользователей:", err);
      setError(
        "Не удалось загрузить пользователей. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, blocked) => {
    try {
      await UserService.blockUser(userId, blocked, token);
      setUsers(
        users.map((user) =>
          user.userId === userId ? { ...user, isBlocked: blocked } : user
        )
      );
    } catch (err) {
      console.error("Ошибка при блокировке/разблокировке пользователя:", err);
      setError(
        "Не удалось обновить статус пользователя. Пожалуйста, попробуйте снова."
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await UserService.deleteUser(userId, token);
      setUsers(users.filter((user) => user.userId !== userId));
      
      if (users.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers();
      }
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      setError(
        "Не удалось удалить пользователя. Пожалуйста, попробуйте снова."
      );
    }
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0); 
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Показано <span className="font-medium">{users.length}</span> из{" "}
          <span className="font-medium">{totalElements}</span> пользователей
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
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
            
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {number + 1}
              </button>
            ))}
            
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
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Загрузка пользователей...</p>
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onBlockUser={handleBlockUser}
            onDeleteUser={handleDeleteUser}
          />
          {totalPages > 0 && <Pagination />}
        </>
      )}
    </div>
  );
}