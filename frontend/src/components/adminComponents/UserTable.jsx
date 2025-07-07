import React, { useState } from "react";

export default function UserTable({ users, onBlockUser, onDeleteUser, loading }) {
  const [confirmAction, setConfirmAction] = useState({
    type: null,
    userId: null,
    blocked: null,
  });

  const handleConfirm = () => {
    if (confirmAction.type === "block") {
      onBlockUser(confirmAction.userId, confirmAction.blocked);
    } else if (confirmAction.type === "delete") {
      onDeleteUser(confirmAction.userId);
    }
    setConfirmAction({ type: null, userId: null, blocked: null });
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Имя пользователя</th>
            <th className="py-3 px-4 text-left">Верификация</th>
            <th className="py-3 px-4 text-left">Статус</th>
            <th className="py-3 px-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {loading ? (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Загрузка...
                </div>
              </td>
            </tr>
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.userId}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{user.userId}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.emailVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.emailVerified ? "Подтверждён" : "Не подтверждён"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Заблокирован" : "Активен"}
                  </span>
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  {confirmAction.userId === user.userId ? (
                    <>
                      <button
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                      >
                        Подтвердить
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: null,
                            userId: null,
                            blocked: null,
                          })
                        }
                        className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "block",
                            userId: user.userId,
                            blocked: !user.isBlocked,
                          })
                        }
                        className={`${
                          user.isBlocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-white py-1 px-2 rounded text-xs`}
                      >
                        {user.isBlocked ? "Разблокировать" : "Заблокировать"}
                      </button>
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            userId: user.userId,
                          })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-gray-500">
                Нет доступных пользователей
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}