import { User } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import SearchBox from "./SearchBox";

const Header = () => {
  return (
    <header className="bg-white">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-[#1d98ff] text-xl font-medium">
            OKU.KG
          </Link>

          <Suspense fallback={<div>Load ...</div>}>
            <SearchBox />
          </Suspense>
          <Link
            href={"/profile"}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
