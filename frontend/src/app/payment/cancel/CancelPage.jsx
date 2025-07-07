'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
    }
  }, [sessionId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Төлөм токтотулду
        </h1>
        <p className="text-gray-600 mb-6">
          Төлөм процесси токтотулган. Кайра аракет кылып көрүңүз же себетти текшериңиз.
        </p>
        <a
          href="/profile"
          className="inline-block w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Себетке кайтуу
        </a>
      </div>
    </div>
  );
}
