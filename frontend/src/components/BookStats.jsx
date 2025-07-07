'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function BookStats() {
  const [bookCount, setBookCount] = useState(15297);
  return (
    <section className="relative w-full py-16 h-64 verflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/books-background.png"
          alt="Фон с книгами"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0" />
      </div>
      
     
    </section>
  );
}