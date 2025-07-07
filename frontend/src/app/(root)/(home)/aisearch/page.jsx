'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Издөө сурамжын киргизиңиз');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/public/books/smart-search`,
        {
          params: { query: searchQuery },
        }
      );

      setSearchResults(response.data);
    } catch (err) {
      setError('Издөөдө ката кетти. Кайра аракет кылыңыз.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Акылдуу Издөө
        </h1>

      
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Акылдуу издөө кызматы</h2>
          <p className="text-gray-700 mb-4">
            Издөө тилкесине китеп жөнүндө ой-пикирлериңизди жазыңыз. Мисалы:
          </p>
          <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
            <li>«Балалыгын айылда өткөргөн бала жөнүндө китеп издеп жатам»</li>
            <li>«Кыргыз тилинде фантастика жанрындагы китеп»</li>
            <li>«Мугалимдер үчүн методикалык колдонмо»</li>
          </ul>

       
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Китеп, автор же темада издөө..."
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg sm:rounded-l-none mt-2 sm:mt-0 hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Издөөдө...' : 'Издөө'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Так издөө</h3>
            <p className="text-gray-600">
              Китептин аталышын, авторун же темасын так аныктап, керектүү китепти тез табыңыз.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Темалар боюнча издөө</h3>
            <p className="text-gray-600">
              Жөн гана темалар боюнча жаңы жана кызыктуу китептерди табыңыз.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Толук сүрөттөмө</h3>
            <p className="text-gray-600">
              Издөө тилкесине китеп жөнүндө толук маалыматты киргизиңиз.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Жыйынтыктар жүктөлүүдө...</p>
          </div>
        ) : (
          <>
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Издөө натыйжалары: {searchResults.length} китеп табылды
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((book) => (
                    <div
                      key={book.bookId}
                      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/books/${book.bookId}`}>
                        <div className="w-full h-64 relative bg-gray-100">
                          {book.imageUrl ? (
                            <img
                              src={book.imageUrl}
                              alt={book.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Сүрөт жок
                            </div>
                          )}
                          
                          {book.discountPrice && book.discountPrice < book.price && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{Math.round(((book.price - book.discountPrice) / book.price) * 100)}%
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{book.title}</h3>
                          
                         
                          <div className="flex items-center mb-2">
                            {book.discountPrice && book.discountPrice < book.price ? (
                              <>
                                <span className="font-bold text-lg text-red-600">{book.discountPrice} сом</span>
                                <span className="text-gray-500 line-through ml-2">{book.price} сом</span>
                              </>
                            ) : (
                              <span className="font-bold text-lg">{book.price} сом</span>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {book.author?.name || "Белгисиз автор"}
                            </span>
                            <span className="text-blue-500 hover:underline text-sm">
                              Толугураак
                            </span>
                          </div>

                          
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">
                  Сиздин суранычыңыз боюнча эч нерсе табылган жок. 
                  <br />
                  Башка сөздөрдү колдонуп көрүңүз.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}