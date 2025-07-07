'use client';

import { useState, useEffect, useRef } from 'react';
import { getBooksByTagName } from '@/service/books/book';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewBooks() {
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchNewBooks = async () => {
      try {
        const books = await getBooksByTagName('жаңы китептер');
        setNewBooks(books);
      } catch (error) {
        console.error('Жаңы китептерди жүктөөдө ката:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewBooks();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      const container = carouselRef.current;
      if (!container) return;
      
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setShowControls(hasOverflow);
    };

    checkOverflow();
    
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [newBooks]);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('div')?.offsetWidth;
    if (!cardWidth) return;

    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    
    const newPosition = scrollPosition + scrollAmount;
    
    if (direction === 'left') {
      const targetPosition = Math.max(0, newPosition);
      container.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
      setScrollPosition(targetPosition);
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetPosition = Math.min(maxScroll, newPosition);
      container.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
      setScrollPosition(targetPosition);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Жаңы китептер</h2>
          
          {showControls && (
            <div className="flex space-x-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                aria-label="Предыдущие книги"
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition"
                aria-label="Следующие книги"
                disabled={carouselRef.current && scrollPosition >= carouselRef.current.scrollWidth - carouselRef.current.clientWidth}
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          )}
        </div>
        
        {newBooks.length === 0 ? (
          <p className="text-center text-gray-500">Жаңы китептер табылган жок</p>
        ) : (
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
          >
            {newBooks.map((book) => (
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