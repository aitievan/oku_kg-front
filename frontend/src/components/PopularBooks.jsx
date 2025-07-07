'use client';

import { useState, useEffect, useRef } from 'react';
import { getBooksByTagName } from '@/service/books/book';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PopularBooks() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const books = await getBooksByTagName('көп окулгандар');
        setPopularBooks(books);
      } catch (error) {
        console.error('Популярдуу китептерди жүктөөдө ката:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('div')?.offsetWidth + 16; 
    if (!cardWidth) return;

    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    const newPosition = scrollPosition + scrollAmount;

    if (newPosition >= 0 && newPosition <= container.scrollWidth - container.clientWidth) {
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    } else if (newPosition < 0) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      setScrollPosition(0);
    } else {
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: 'smooth'
      });
      setScrollPosition(container.scrollWidth - container.clientWidth);
    }
  };

  const hasMoreItems = carouselRef.current && 
    popularBooks.length > 0 && 
    carouselRef.current.scrollWidth > carouselRef.current.clientWidth;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Көп окулгандар</h2>
          
          {hasMoreItems && (
            <div className="flex space-x-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                aria-label="Предыдущие книги"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                aria-label="Следующие книги"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          )}
        </div>
        
        {popularBooks.length === 0 ? (
          <p className="text-center text-gray-500">Популярдуу китептер табылган жок</p>
        ) : (
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
          >
            {popularBooks.map((book) => (
              <div key={book.bookId} className="flex-shrink-0 w-36 sm:w-44 md:w-52 mr-4 snap-start">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}