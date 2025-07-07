"use client";
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CatalogMenu = dynamic(() => import("./CatalogMenu"), {
  ssr: false,
  loading: () => <p>Жүктөлүүдө...</p>,
});

export default function Navbar() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const router = useRouter();

  const handleBookSelect = (bookId) => {
    setIsCatalogOpen(false);
    router.push(`/books/${bookId}`);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-3">
          <ul className="flex space-x-8 relative">
            <li className="relative">
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={`text-gray-700 hover:text-blue-500 focus:outline-none transition-colors duration-200 ${
                  isCatalogOpen ? "text-blue-500" : ""
                }`}
              >
                Каталог
              </button>
              {isCatalogOpen && (
                <div
                  className="fixed inset-x-0 top-[57px] bottom-0 bg-white shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-7xl mx-auto h-full">
                    <CatalogMenu
                      onClose={() => setIsCatalogOpen(false)}
                      onBookSelect={handleBookSelect}
                    />
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link
                href="/bestsellers"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-200"
              >
                Бестселлер
              </Link>
            </li>
            <li>
              <Link
                href="/aisearch"
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
              >
                Акылдуу издөө
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isCatalogOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsCatalogOpen(false)}
        />
      )}
    </nav>
  );
}
