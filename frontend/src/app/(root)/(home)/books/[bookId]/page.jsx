'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookById } from '@/service/books/book';
import { addToCart } from '@/service/profile/cart'; 
import { addToWishlist } from '@/service/profile/wishlist'; 
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import Cookies from 'js-cookie'; 

export default function BookDetailPage({ params }) {
  const router = useRouter();
  const { bookId } = params;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    router.back();
  };

  
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setError("Book ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const bookIdNumber = Number(bookId);
        const bookData = await getBookById(bookIdNumber);
        setBook(bookData);
      } catch (err) {
        console.error(`Error fetching book with ID ${bookId}:`, err);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  
  const getToken = () => {
    return Cookies.get('token'); 
  };

  
  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(token, bookId);
      alert("Китеп ийгиликтүү корзинага кошулду!");
    } catch (error) {
      console.error("Корзинага кошуу убагында ката:", error);
      alert("Китепти корзинага кошуу мүмкүн эмес.");
    }
  };

  
  const handleAddToWishlist = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await addToWishlist(token, bookId);
      alert("Китеп ийгиликтүү вишлистке кошулду!");
    } catch (error) {
      console.error("Вишлистке кошуу убагында ката:", error);
      alert("Китепти вишлистке кошуу мүмкүн эмес.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Ката</h1>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Китеп табылган жок</h1>
        <p className="text-gray-500">Китеп мындай ID менен {bookId} жок же өчүрүлгөн</p>
      </div>
    );
  }

  const hasDiscount = book.discount && book.discount.discountPercentage > 0;
  
  
  const isBookAvailable = book.available !== false && book.stockQuantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        Артка кайтуу
      </button>
      <div className="flex flex-col md:flex-row gap-8">
      
        <div className="md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md">
            <img
              src={book.imageUrl || "/book2.png"}
              alt={book.title}
              className="object-cover w-full h-full"
              priority="true"
            />

            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                -{book.discount.discountPercentage}%
              </div>
            )}
          </div>
        </div>

      
        <div className="md:w-2/3 lg:w-3/4">
          <h1 className="text-2xl font-semibold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{book.author?.name || "Автор көрсөтүлгөн эмес"}</p>

          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genres.map((genre) => (
                <span key={genre.genreId} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

    
          <div className="mb-6">
            <div className="flex items-center gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-2xl font-bold text-red-500">{book.discountPrice}c</span>
                  <span className="text-lg line-through text-gray-400">{book.price}c</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{book.price}c</span>
              )}
            </div>

            <p className="mt-2 text-sm">
              {isBookAvailable ? (
                <span className="text-green-500">Сатыкта бар</span>
              ) : (
                <span className="text-red-500">Сатыкта жок</span>
              )}
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            {isBookAvailable ? (
              <button
                className="px-6 py-3 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Себетке  кошуу
              </button>
            ) : (
              <button
                className="px-6 py-3 bg-gray-300 text-gray-500 rounded-md flex items-center gap-2 cursor-not-allowed"
                disabled
              >
                <ShoppingCart size={20} />
                Сатыкта жок
              </button>
            )}

            <button
              className="px-6 py-3 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50"
              onClick={handleAddToWishlist}
            >
              <Heart size={20} />
              Вишлистке кошуу
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Маалымат</h2>
            <p className="text-gray-700 whitespace-pre-line">{book.description || "Маалымат жок"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}