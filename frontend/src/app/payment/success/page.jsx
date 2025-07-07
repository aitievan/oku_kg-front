import { Suspense } from 'react';
import SuccessPage from './SuccessPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Жүктөлүүдө...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
