'use client';

import { useEffect, useState } from 'react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}) {
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; 
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setLocalCurrentPage(page);
    onPageChange(page - 1); 
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange(newSize);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Строк на странице:</span>
        <select 
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded px-2 py-1 text-sm"
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          «
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          ‹
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          ›
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          »
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        Страница {currentPage} из {totalPages || 1}
      </div>
    </div>
  );
}