"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { Register } from "@/service/auth/register";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmMessage, setShowEmailConfirmMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!email || !password || !confirmPassword) {
      setError("Бардык талаалар толтурулууга тийиш!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Сыр сөздөр дал келбейт!");
      return;
    }

  
    setShowEmailConfirmMessage(true);

    setLoading(true);
    setError("");

    const data = { email, password };

    try {
      const response = await Register(data);

      if (response && response.status >= 200 && response.status < 300) {
        Cookies.set("token", response.data.token, { httpOnly: false });
        router.replace("/profile");
      } else {
        throw new Error("Катталуу учурунда ката кетти");
      }
    } catch (err) {
      setError(err.message);
      
      setShowEmailConfirmMessage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl bg-white rounded-lg shadow-md overflow-hidden w-full lg:w-1/3">
        <div className="p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Кош келдиңиз!
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Улантуу үчүн, жеке баракчаңызды түзүңүз
          </p>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative">
              <input
                type={!showPassword ? "password" : "text"}
                placeholder="Сыр сөз"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            <div className="relative">
              <input
                type={!showConfirmPassword ? "password" : "text"}
                placeholder="Сыр сөзүңүздү тастыктаңыз"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {!showConfirmPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Жүктөлүүдө..." : "Катталуу"}
            </button>

        
            {showEmailConfirmMessage && (
              <p className="text-center text-base font-bold text-red-600 mt-3 bg-red-50 p-3 rounded-md border border-red-200">
                Каттоону аяктоо үчүн, сизге почтанызга жөнөтүлгөн активдештирүү шилтемесин басыңыз.
              </p>
            )}
          </form>

          <div className="text-center text-sm text-blue-500 mt-4">
            <Link href="/login" className="hover:underline">
              Жеке баракчам бар
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-inherit">
        <Image
          src="/reading-illustration.svg"
          alt="Reading illustration"
          width={350}
          height={350}
          priority
        />
      </div>
    </div>
  );
}