"use client";
import { useState, useEffect } from "react";

export default function ManagerForm({ initialData, onSubmit, buttonText = "Save" }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    phone: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const { password, ...restData } = initialData;
      setFormData({ ...formData, ...restData });
    }
  }, [initialData]);

  const validatePhone = (phone) => {
    return /^\+996\d{9}$/.test(phone);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email обязателен";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Некорректный email";
    
    if (!formData.username) newErrors.username = "Имя пользователя обязательно";
    
    if (!formData.phone) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Номер должен быть в формате +996XXXXXXXXX (12 цифр с кодом страны)";
    }
    
    if (!initialData && !formData.password) newErrors.password = "Пароль обязателен";
    else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" && !value.startsWith("+996") && value.length > 0) {
      setFormData({
        ...formData,
        [name]: "+996" + value.replace(/^\+996/, '')
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSubmit = { ...formData };
      if (initialData && !formData.password) {
        delete dataToSubmit.password;
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Номер телефона <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">+996</span>
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone.replace(/^\+996/, '')}
            onChange={handleChange}
            maxLength={9}
            className={`block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="XXX XXX XXX"
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        <p className="mt-1 text-xs text-gray-500">Формат: +996 XXX XXX XXX</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Имя пользователя
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {initialData ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль"}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}