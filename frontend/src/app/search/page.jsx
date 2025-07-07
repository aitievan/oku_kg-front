'use client';

import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}