"use client";

import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { name: "Книги", href: "/admin/books" },
  { name: "Пользователи", href: "/admin/users" },
  { name: "Менеджеры", href: "/admin/managers" },
  { name: "Заказы", href: "/admin/orders" },
  { name: "Скидки", href: "/admin/discounts" },
];

export default function SideBar() {
  const [active, setActive] = useState(null);

  return (
    <div className="w-64 bg-white shadow-lg h-full p-4">
      <Link href="/admin">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 cursor-pointer hover:underline">
          Админ-панель
        </h2>
      </Link>
      
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            <Link
              href={item.href}
              className={`block px-4 py-2 rounded text-gray-700 hover:bg-gray-200 ${
                active === index ? "bg-gray-300" : ""
              }`}
              onClick={() => setActive(index)}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
