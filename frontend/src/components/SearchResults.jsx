'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchBooks } from '@/service/books/book';
import Link from 'next/link';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchBooks(query);
          setResults(searchResults || []);
        } catch (error) {
          console.error('Error searching books:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (query.trim().length < 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h2 className="text-xl font-medium">Издөө үчүн эки же андан көп символду киргизиңиз</h2>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h2 className="text-xl font-medium">Тилеке каршы мындай китеп табылган жок</h2>
          <p className="mt-2 text-gray-600">&quot;{query}&quot; боюнча издөө натыйжалары табылган жок</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">&quot;{query}&quot; боюнча издөө натыйжалары</h1>
      
      <div className="text-sm text-gray-600 mb-4">
        {results.length} китеп табылды
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((book) => (
          <Link 
            href={`/books/${book.bookId}`}
            key={book.bookId}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-full h-40 bg-gray-200">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">Сүрөт жок</span>
                </div>
              )}
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm line-clamp-2 h-10">{book.title}</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{book.author?.name}</p>
              <p className="text-sm font-semibold mt-1">{book.price}c</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}