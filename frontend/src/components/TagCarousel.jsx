"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TagCarousel() {
  const [tags, setTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/public/books/tags`
        );
        setTags(response.data);
      } catch (error) {
        console.error("Тегтерди жүктөөдө ката:", error);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tagId) => {
    router.push(`/tags/${tagId}`);
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto scrollbar-hide overflow-y-hidden flex items-center gap-4 pb-4">
        {tags.map((tag) => (
          <button
            key={tag.tagId}
            className="shrink-0 px-5 py-2 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-md bg-blue-100 text-blue-700 hover:bg-blue-300"
            onClick={() => handleTagClick(tag.tagId)}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}