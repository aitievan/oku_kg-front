'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addBook } from '@/service/book';
import { getCookie } from 'cookies-next';
import BookForm from '@/components/admin/books/BookForm';

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (bookData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = getCookie("token");
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      await addBook(bookData, token);
      router.push('/admin/books');
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Book</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <BookForm 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}