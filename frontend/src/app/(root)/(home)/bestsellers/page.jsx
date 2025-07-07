"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBooksByTagName } from "@/service/books/book";
import { addToCart } from "@/service/profile/cart";
import { addToWishlist, removeFromWishlist } from "@/service/profile/wishlist";
import BookCard from "@/components/BookCard";
import Cookies from "js-cookie";

export default function BestsellersPage() {
  const router = useRouter();
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const books = await getBooksByTagName("бестселлер");

        const token = Cookies.get("token");
        if (token) {
          const updatedBooks = books.map((book) => ({
            ...book,
            isInWishlist: false,
            wishlistAttempts: 0,
          }));
          setBestsellers(updatedBooks);
        } else {
          setBestsellers(books);
        }

        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки бестселлеров:", error);
        setError("Не удалось загрузить книги");
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const handleAddToCart = async (book) => {
    const token = Cookies.get("token");

    if (!token) {
      alert("Сураныч, аккаунтка кириңиз.");
      return;
    }

    try {
      await addToCart(token, book.bookId);
      alert("Китеп ийгиликтүү корзинага кошулду!");
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
      alert("Китепти корзинага кошуу мүмкүн эмес.");
    }
  };

  const handleWishlistToggle = async (book, newWishlistState) => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setBestsellers((prevBooks) =>
      prevBooks.map((b) =>
        b.bookId === book.bookId ? { ...b, isInWishlist: newWishlistState } : b
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Башкы бетке кайтуу
        </Link>
      </div>
      {bestsellers.length === 0 ? (
        <div className="text-center text-gray-500">
          Бестселлерлер табылган жок
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bestsellers.map((book) => (
            <BookCard
              key={book.bookId}
              book={book}
              onCartAdd={() => handleAddToCart(book)}
              onWishlistToggle={(book, newState) =>
                handleWishlistToggle(book, newState)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
