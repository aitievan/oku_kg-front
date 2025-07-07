"use client";

import { useState, useEffect, Suspense } from "react";
import { getBookById, updateBook } from "@/service/admin/book";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import BookForm from "@/components/BookForm";

export default function EditBookPage() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError("ID книги не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookData = await getBookById(bookId, token);
        setBook(bookData);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке книги:", error);
        setError("Не удалось загрузить данные книги");
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, token]);

  const handleSubmit = async (bookData) => {
    try {
      await updateBook(bookId, bookData, token);
      router.push("/admin/books");
    } catch (error) {
      console.error("Ошибка при обновлении книги:", error);
      setError("Не удалось обновить книгу");
    }
  };

  if (loading) {
    return <div className="p-6">Загрузка данных книги...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">Редактировать книгу</h1>
        {book && (
          <BookForm
            initialData={book}
            onSubmit={handleSubmit}
            buttonText="Сохранить изменения"
            isEditMode={true}
          />
        )}
    </div>
  );
}
