'use client';

import React from 'react';
import AdminStatistics from '@/components/adminComponents/AdminStatistics';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
      
      <AdminStatistics />
      
    </div>
  );
}