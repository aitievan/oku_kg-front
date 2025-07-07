"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import BookCard from "@/components/BookCard";
import Link from "next/link";

export default function TagBooks() {
  const { tagId } = useParams();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    const fetchBooksByTag = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/public/books/tags/${tagId}`
        );

        if (Array.isArray(response.data)) {
          setBooks(response.data);
          
          // Если у вас есть возможность получить имя тега:
          if (response.data.length > 0 && response.data[0].tagName) {
            setTagName(response.data[0].tagName);
          }
        } else {
          console.error("Неверный формат ответа:", response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки книг по тегу:", error);
      }
    };

    fetchBooksByTag();
  }, [tagId]);

  return (
    <div className="container mx-auto p-4">
    <div className="mb-6">
      <Link href="/" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Башкы бетке кайтуу
      </Link>
        {tagName && <h1 className="text-2xl font-bold">Книги по тегу: {tagName}</h1>}
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <div
              key={book.bookId}
              className="cursor-pointer"
              onClick={() => router.push(`/books/${book.bookId}`)}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Азырынча бел тег боюнча китептер жок.</p>
      )}
    </div>
  );
}