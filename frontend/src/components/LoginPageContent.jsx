"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Login } from "@/service/auth/login";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";

export const LoginPageContent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = { email, password };

    const response = await Login(data);
    if (response && response.status >= 200 && response.status < 300) {
      setLoading(false);
      console.log(response);

      Cookies.set("token", response.data.token, { httpOnly: false });
      Cookies.set("role", response.data.role, { httpOnly: false });

      if (response.data.role === "ADMIN") {
        router.replace("/admin");
      } else if (response.data.role === "MANAGER") {
        router.replace("/manager"); 
      } else {
        router.replace("/profile"); 
      }
    } else {
      setLoading(false);
      console.log("no response");
      setError("непроизвольная ошибка");
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl bg-white rounded-lg shadow-md overflow-hidden w-full lg:w-1/3">
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Кайтып келишиңиз менен!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Улантуу үчүн, жеке баракчаңызга кириңиз
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type={!showPassword ? "password" : "text"}
              placeholder="Сыр сөз"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-3 top-[62px]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <Eye /> : <EyeOff />}
            </span>
            {error && <p className="text-red-500 text-start">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Жүктөлүүдө..." : "Кирүү"}
            </button>
          </form>

          <div className="flex justify-between text-sm text-blue-500 mt-4">
            <Link href="/register" className="hover:underline">
              Жеке баракчам жок
            </Link>
            {/* <Link href="/reset" className="hover:underline">
              Сыр сөздү унуттум
            </Link> */}
          </div>
        </div>
      </div>
      <div className="bg-inherit">
        <Image
          src="/reading-illustration.png"
          alt="Reading illustration"
          width={350}
          height={350}
          priority
        />
      </div>
    </div>
  );
};
