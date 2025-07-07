'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchBooks } from '@/service/books/book';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length >= 2) {
      setIsSearching(true);
      setShowResults(true);
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(trimmedValue);
      }, 300);
    } else {
      setResults([]);
      setShowResults(value.length > 0); 
      setIsSearching(false);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const performSearch = async (searchQuery) => {
    try {
      const searchResults = await searchBooks(searchQuery);
      setResults(searchResults || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const navigateToSearchPage = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      navigateToSearchPage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-1 max-w-xl mx-auto px-4 relative" ref={searchRef}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Китеп издөө"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={navigateToSearchPage}
          type="button"
        >
          <Search className="text-gray-400" size={20} />
        </button>
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Издөө...</div>
          ) : results.length > 0 ? (
            <div>
              {results.slice(0, 5).map((book) => (
                <Link
                  href={`/books/${book.bookId}`}
                  key={book.bookId}
                  className="flex items-center p-3 hover:bg-gray-100 border-b last:border-b-0"
                  onClick={() => setShowResults(false)}
                >
                  <div className="w-10 h-14 bg-gray-200 mr-3 relative flex-shrink-0">
                    {book.imageUrl && (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{book.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{book.author?.name}</p>
                    <p className="text-xs font-semibold">{book.price}c</p>
                  </div>
                </Link>
              ))}

              {results.length > 5 && (
                <button
                  onClick={navigateToSearchPage}
                  className="w-full block p-3 text-center text-blue-500 hover:bg-gray-100"
                  type="button"
                >
                  Баардык жыйынтыктарды чыгаруу ({results.length})
                </button>
              )}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">Тилеке каршы мындай китеп табылган жок</div>
          ) : (
            <div className="p-4 text-center text-gray-500">Издөө үчүн эки же андан көп символду киргизиңиз</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;