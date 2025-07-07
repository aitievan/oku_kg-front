"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProfileInfo({ user }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const avatarColor = useMemo(() => {
    if (!user?.username) return "bg-blue-500";
    
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500"
    ];
    
    const hash = user.username.split("").reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    return colors[hash % colors.length];
  }, [user?.username]);
  
  const initials = useMemo(() => {
    if (!user?.username) return "U";
    
    const parts = user.username.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.username[0].toUpperCase();
  }, [user?.username]);
  
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("cart");
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  return (
    <div className="relative flex items-center gap-4 mb-4">
      <div
        className={`w-16 h-16 ${avatarColor} rounded-full cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="text-white text-xl font-bold">
          {initials}
        </span>
      </div>


      <p className="text-lg font-semibold">
        {user?.username || "Имя не указано"}
      </p>

      {menuOpen && (
        <div className="absolute top-16 left-0 bg-white shadow-lg rounded-lg p-4 w-64 border border-gray-300 z-10">
          <h3 className="text-lg font-semibold text-gray-800">Профиль</h3>
          <p className="text-sm text-gray-600">
            <strong>Аты-жөнү:</strong> {user?.username || "Көрсөтүлбөгөн"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {user?.email || "Көрсөтүлбөгөн"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Туулган күнү:</strong> {user?.birthDate || "Көрсөтүлбөгөн"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Пол:</strong>{" "}
            {user?.gender === null
              ? "Көрсөтүлбөгөн"
              : user?.gender === true
              ? "Эркек"
              : "Аял"}
          </p>

          <button
            onClick={() => router.push("/profile/edit")}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ✏ Өзгөртүү
          </button>
          
          <button
            onClick={logout}
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🚪 Чыгуу
          </button>
          
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ❌ Жабуу
          </button>
        </div>
      )}
      
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-0" 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}