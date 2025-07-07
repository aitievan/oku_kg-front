"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function CatalogMenu({ onClose, onBookSelect }) {
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/public/books/genres`
        );
        setGenres(response.data);

        if (response.data.length > 0) {
          handleGenreSelect(response.data[0].genreId);
        }
      } catch (error) {
        console.error("Жанрларды жүктөөдө ката:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = async (genreId) => {
    try {
      setIsLoading(true);
      setActiveGenre(genreId);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/public/books/genres/${genreId}`
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Китептерди жүктөөдө ката:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    if (onBookSelect) {
      onBookSelect(bookId);
    }
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end items-center p-4 border-b">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-500">Жанрлар жүктөлүүдө...</p>
          ) : genres.length === 0 ? (
            <p className="text-gray-500">Жанрлар табылган жок</p>
          ) : (
            genres.map((genre) => (
              <div
                key={genre.genreId}
                className={`p-3 cursor-pointer rounded-md ${
                  activeGenre === genre.genreId
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleGenreSelect(genre.genreId)}
              >
                {genre.name}
              </div>
            ))
          )}
        </div>

        <div className="w-2/3 p-4 overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-500">Китептер жүктөлүүдө...</p>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.bookId}
                  className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleBookClick(book.bookId)}
                >
                  {book.imageUrl && (
                    <div className="mb-2 w-full h-48 relative">
                      <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="font-semibold text-gray-800 truncate">
                    {book.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {book.author?.name || "Автор көрсөтүлгөн эмес"}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {book.discount ? (
                      <div className="flex items-center">
                        <span className="line-through text-gray-400 mr-2">
                          {book.price} сом
                        </span>
                        <span className="text-red-500 font-bold">
                          {book.discountPrice} сом
                          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{book.discount.discountPercentage}%
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">{book.price} сом</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <p className="text-lg mb-4">
                Китептерди көрүү үчүн сол жактан жанрды тандаңыз
              </p>
              <p className="text-sm">
                Жанрлардын ичинен кызыктуу китептерди таба аласыз
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}