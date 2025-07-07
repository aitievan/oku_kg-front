'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/service/axios';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace('/');
      return;
    }

    api.get(`/user/payments/confirm?sessionId=${sessionId}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error("Ошибка получения заказа:", err);
        router.replace('/');
      });
  }, [sessionId, router]);
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Төлөм ийгиликтүү аяктады!
        </h1>
        <p className="text-gray-600 mb-6">
          Почтаңызга буюртма боюнча кененирээк маалымат жиберилди.
        </p>

        {order ? (
          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="text-gray-700 mb-2">
              📦 Заказ номери: <strong>{order.orderId}</strong>
            </p>
            <p className="text-gray-700">
              💰 Жалпы сумма: <strong>{order.discountedPrice} сом</strong>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Буюртмаңыз боюнча маалымат жүктөлүүдө...</p>
        )}

        <a
          href="/profile"
          className="inline-block w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Профилге кайтуу
        </a>
      </div>
    </div>
  );
}