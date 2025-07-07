"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import Wishlist from "@/components/Profile/Wishlist";
import Cart from "@/components/Profile/Cart";
import Link from "next/link";
import { api } from "@/service/axios";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const { push } = useRouter();
  const router = useRouter();

  const token = Cookies.get("token");
  const role = Cookies.get("role");

  const getUserData = async () => {
    setLoading(true);
    const response = await api.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response) {
      setLoading(false)
      setUser(response.data)
      console.log(response)
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    else{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (role === "MANAGER") {
      push("/manager");
    } else if (role === "ADMIN") {
      push("/admin");
    } else if (role === "USER") {
      push("/profile");
      getUserData();
    } else {
      push("/login");
      console.warn('error')
    }


    const storedWishlist = localStorage.getItem("wishlist");
    const storedCart = localStorage.getItem("cart");

    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const logout = () => {
    router.push("/login");
    localStorage.clear();

    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("authToken");

    setUser(null);
    setWishlist([]);
    setCart([]);

  };
  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl flex gap-6">
        <div className="w-2/3">
          <ProfileInfo user={user} onLogout={logout} />

         
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-blue-500 text-white rounded block mt-4 text-center"
          >
            ✏ Профильди өзгөртүү
          </Link>
      
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded block mt-2 text-center w-full hover:bg-red-600 transition"
          >
            🚪Аккаунттан чыгуу
          </button>
          <Wishlist wishlist={wishlist} />
        </div>
        <Cart cart={cart} />
      </div>
    </div>
  );
}
