"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    birthDate: "",
    gender: null, 
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        username: storedUser.username || "",
        birthDate: storedUser.birthDate || "",
        gender: storedUser.gender, 
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === "gender") {
      const genderValue = value === "" ? null : value === "true";
      setForm({ ...form, gender: genderValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    fetch("https://oku-kg.onrender.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form), 
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Өзгөртүлгөн профиль:", data);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/profile");
      })
      .catch((err) => console.error("Профильди жаңылоодо ката кетти:", err));
  };

  if (!user) return <p className="text-center mt-10">Жүктөлүүдө...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Профильди өзгөртүү</h2>

        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={user?.email || ""}
          className="w-full border p-2 rounded mb-4 bg-gray-200 cursor-not-allowed"
          disabled
        />

        <label className="block mb-2">Колдонуучунун аты-жөнү:</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Туулган күнү:</label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Жынысы:</label>
        <select
          name="gender"
          value={form.gender === null ? "" : String(form.gender)}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Көрсөтүлбөгөн</option>
          <option value="true">Эркек</option>
          <option value="false">Аял</option>
        </select>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Артка кайтуу
          </button>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Сактоо 
          </button>
        </div>
      </form>
    </div>
  );
}