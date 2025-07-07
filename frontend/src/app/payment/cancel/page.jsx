import { Suspense } from 'react';
import CancelPage from './CancelPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Жүктөлүүдө...</div>}>
      <CancelPage />
    </Suspense>
  );
}
