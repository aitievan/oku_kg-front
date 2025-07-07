import React, { useState } from "react";
import Link from "next/link";

export default function ManagerTable({
  managers,
  onBlockManager,
  onDeleteManager,
  loading = false
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleBlockClick = (manager) => {
    if (!manager.userId) {
      console.error("ID пользователя отсутствует:", manager);
      return;
    }
    onBlockManager(manager.userId, !manager.isBlocked);
  };

  const toggleRowExpand = (userId) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  const LoadingComponent = () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
      <span className="text-gray-500">Загрузка...</span>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white hidden md:table rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Username</th>
            <th className="py-3 px-4 text-left">Телефон</th>
            <th className="py-3 px-4 text-left">Верификация</th>
            <th className="py-3 px-4 text-left">Статус</th>
            <th className="py-3 px-4 text-left">Действие</th>
          </tr>
        </thead>
        <tbody className="text-gray-600">
          {loading ? (
            <tr>
              <td colSpan="7" className="py-6 text-center">
                <LoadingComponent />
              </td>
            </tr>
          ) : managers?.length > 0 ? (
            managers.map((manager) => (
              <TableRow 
                key={manager.userId}
                manager={manager}
                handleBlockClick={handleBlockClick}
                confirmDelete={confirmDelete}
                setConfirmDelete={setConfirmDelete}
                onDeleteManager={onDeleteManager}
                isMobile={false}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-6 text-center text-gray-500">
                Нет доступных менеджеров
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <LoadingComponent />
          </div>
        ) : managers?.length > 0 ? (
          managers.map((manager) => (
            <div 
              key={manager.userId} 
              className="bg-white p-4 rounded-lg shadow"
              onClick={() => toggleRowExpand(manager.userId)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{manager.username}</h3>
                  <p className="text-sm text-gray-500">{manager.email}</p>
                </div>
                <StatusBadge isBlocked={manager.isBlocked} />
              </div>
              
              {expandedRow === manager.userId && (
                <div className="mt-3 space-y-2">
                  <DetailRow label="ID" value={manager.userId} />
                  <DetailRow label="Телефон" value={manager.phone || "Не указан"} />
                  <DetailRow 
                    label="Верификация" 
                    value={
                      <VerificationBadge isVerified={manager.emailVerified} />
                    } 
                  />
                  
                  <div className="flex space-x-2 pt-2">
                    <Link
                      href={`/admin/managers/edit/${manager.userId}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockClick(manager);
                      }}
                      className={`${
                        manager.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white py-1 px-2 rounded text-xs`}
                    >
                      {manager.isBlocked ? "Разблокировать" : "Блокировать"}
                    </button>
                    {confirmDelete === manager.userId ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteManager(manager.userId);
                            setConfirmDelete(null);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                        >
                          Подтвердить
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(null);
                          }}
                          className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs"
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(manager.userId);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            Нет доступных менеджеров
          </div>
        )}
      </div>
    </div>
  );
}


const TableRow = ({ manager, handleBlockClick, confirmDelete, setConfirmDelete, onDeleteManager, isMobile }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">{manager.userId}</td>
      <td className="py-3 px-4">{manager.email}</td>
      <td className="py-3 px-4">{manager.username}</td>
      <td className="py-3 px-4">{manager.phone || "Не указан"}</td>
      <td className="py-3 px-4">
        <VerificationBadge isVerified={manager.emailVerified} />
      </td>
      <td className="py-3 px-4">
        <StatusBadge isBlocked={manager.isBlocked} />
      </td>
      <td className="py-3 px-4 flex space-x-2">
        <Link
          href={`/admin/managers/edit/${manager.userId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
        >
          Изменить
        </Link>
        <button
          onClick={() => handleBlockClick(manager)}
          className={`${
            manager.isBlocked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white py-1 px-2 rounded text-xs`}
        >
          {manager.isBlocked ? "Разблокировать" : "Блокировать"}
        </button>
        {confirmDelete === manager.userId ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteManager(manager.userId);
                setConfirmDelete(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
            >
              Подтвердить
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(null);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs"
            >
              Отмена
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(manager.userId)}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
          >
            Удалить
          </button>
        )}
      </td>
    </tr>
  );
};

const StatusBadge = ({ isBlocked }) => (
  <span
    className={`px-2 py-1 rounded text-xs ${
      isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
    }`}
  >
    {isBlocked ? "Заблокирован" : "Активен"}
  </span>
);

const VerificationBadge = ({isVerified }) => (
  <span
    className={`px-2 py-1 rounded text-xs ${
      isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {isVerified ? "Подтвержден" : "Не подтвержден"}
  </span>
);

const DetailRow = ({ label, value }) => (
  <div className="flex text-sm">
    <span className="text-gray-500 w-24">{label}:</span>
    <span>{value}</span>
  </div>
);