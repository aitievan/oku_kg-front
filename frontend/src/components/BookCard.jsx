'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/service/profile/cart';
import { addToWishlist, removeFromWishlist } from '@/service/profile/wishlist';

export default function BookCard({ book, onWishlistToggle, onCartAdd }) {
  const router = useRouter();
  const {
    bookId,
    title,
    author,
    price,
    discountPrice,
    imageUrl,
    discount,
    stockQuantity,
    available = true, 
    isInWishlist: initialIsInWishlist = false
  } = book;

  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  const hasDiscount = discount && discount.discountPercentage > 0;
  const discountPercent = hasDiscount ? discount.discountPercentage : 0;

  const validImageUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
    ? imageUrl
    : "/book2.png";

  const isBookAvailable = available !== false && stockQuantity > 0;

  const getToken = () => Cookies.get('token');

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isBookAvailable) return;
    
    const token = getToken();
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(token, bookId);
      onCartAdd?.(book);
      alert("Китеп ийгиликтүү себетке кошулду!");
    } catch (error) {
      console.error("Себетке кошуу убагында ката:", error);
      alert("Китепти себетке кошуу мүмкүн эмес.");
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    const token = getToken();
    
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      if (isInWishlist) {
        await removeFromWishlist(token, bookId);
        alert("Китеп ийгиликтүү вишлисттен алынды!");
      } else {
        await addToWishlist(token, bookId);
        alert("Китеп ийгиликтүү вишлистке кошулду!");
      }
      
      setIsInWishlist(!isInWishlist);
      onWishlistToggle?.(book, !isInWishlist);
    } catch (error) {
      console.error("Вишлистте операция убагында ката:", error);
      alert("Вишлистте бул китеп бар, операция аткарылган жок.");
    }
  };

  return (
    <div className="flex flex-col">
      <Link href={`/books/${book.bookId}`} passHref>
        <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-2 shadow-sm cursor-pointer">
          <div className="aspect-[3/4] w-full">
            <Image
              src={validImageUrl}
              alt={title || "Китептин мукабасы"}
              width={300}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm z-10">
              -{discountPercent}%
            </div>
          )}
          
          {!isBookAvailable && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-80 text-white px-2 py-1 text-sm text-center">
              Сатыкта жок
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col">
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{title || "Китептин аталышы"}</h3>
        <p className="text-xs text-gray-500 mb-1">{author?.name || "Автор"}</p>

        <div className="flex items-center justify-between mt-1">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-sm font-semibold text-red-500">{discountPrice}с</p>
                <p className="text-xs line-through text-gray-400">{price}с</p>
              </>
            ) : (
              <p className="text-sm font-semibold">{price}с</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-1"
              onClick={handleWishlistToggle}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist ? "red" : "none"} stroke={isInWishlist ? "red" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            <button
              className={`p-1 ${!isBookAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={!isBookAvailable}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}