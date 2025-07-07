"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import BookTable from "../../../components/adminComponents/BookTable";
import BookForm from "../../../components/adminComponents/BookForm";
import axios from "axios";
import Pagination from "../../../components/Pagination";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0
  });
  
  const token = Cookies.get("token");

  const fetchBooks = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://oku-kg.onrender.com/api/admin/books",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, size }
        }
      );
      
      if (response.data && response.data.content) {
        setBooks(response.data.content);
        setPagination({
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки книг:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooks(pagination.pageNumber, pagination.pageSize);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту книгу?")) {
      try {
        await axios.delete(`https://oku-kg.onrender.com/api/admin/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        fetchBooks(pagination.pageNumber, pagination.pageSize);
      } catch (error) {
        console.error("Ошибка удаления книги:", error);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (bookData) => {
    try {
      const selectedGenres = [...bookData.selectedGenres];
      const selectedTags = [...bookData.selectedTags];

      delete bookData.selectedGenres;
      delete bookData.selectedTags;

      let bookId;

      if (editingBook) {
        await axios.put(
          `https://oku-kg.onrender.com/api/admin/books/${editingBook.bookId}`,
          bookData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        bookId = editingBook.bookId;

      } else {
        const response = await axios.post(
          "https://oku-kg.onrender.com/api/admin/books",
          bookData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        bookId = response.data.bookId; 
      }

      for (const genreId of selectedGenres) {
        try {
          await axios.post(
            `https://oku-kg.onrender.com/api/admin/books/${bookId}/genre/${genreId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (genreError) {
          console.error(`Ошибка при добавлении жанра ${genreId}:`, genreError);
        }
      }

      for (const tagId of selectedTags) {
        try {
          await axios.post(
            `https://oku-kg.onrender.com/api/admin/books/${bookId}/tag/${tagId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (tagError) {
          console.error(`Ошибка при добавлении тега ${tagId}:`, tagError);
        }
      }

      fetchBooks(pagination.pageNumber, pagination.pageSize);

      setIsFormVisible(false);
    } catch (error) {
      console.error("Ошибка при сохранении книги:", error);
    }
  };

  const cancelForm = () => {
    setIsFormVisible(false);
    setEditingBook(null);
  };

  const handlePageChange = (page) => {
    fetchBooks(page, pagination.pageSize);
  };

  const handlePageSizeChange = (size) => {
    fetchBooks(0, size); 
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление книгами</h1>

      {!isFormVisible ? (
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
        >
          Добавить книгу
        </button>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingBook ? "Редактирование книги" : "Добавление новой книги"}
          </h2>
          <BookForm
            initialData={editingBook}
            onSubmit={handleFormSubmit}
            buttonText={editingBook ? "Обновить" : "Добавить"}
            isEditMode={!!editingBook}
          />
          <button
            onClick={cancelForm}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Отмена
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
         
          <BookTable 
            books={books} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
          
       
          <Pagination
            currentPage={pagination.pageNumber + 1} 
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      )}
    </div>
  );
}