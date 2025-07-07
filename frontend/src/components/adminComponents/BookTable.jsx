import React from "react";
export default function BookTable({ books, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Изображение</th>
            <th className="py-2 px-4 border-b">Название</th>
            <th className="py-2 px-4 border-b">Автор</th>
            <th className="py-2 px-4 border-b">Цена</th>
            <th className="py-2 px-4 border-b">Количество</th>
            <th className="py-2 px-4 border-b">Действия</th>
          </tr>
        </thead>
        <tbody>
          {books && books.length > 0 ? (
            books.map((book) => (
              <tr key={book.bookId}>
                <td className="py-2 px-4 border-b">{book.bookId}</td>
                <td className="py-2 px-4 border-b">
                  {book.imageUrl ? (
                    <div className="w-16 h-20 overflow-hidden rounded-md">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-gray-500 text-xs">Нет изображения</span>
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{book.title}</td>
                <td className="py-2 px-4 border-b">
                  {book.author ? book.author.name : "Не указан"}
                </td>
                <td className="py-2 px-4 border-b">{book.price}</td>
                <td className="py-2 px-4 border-b">{book.stockQuantity}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => onDelete(book.bookId)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                Книги не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}