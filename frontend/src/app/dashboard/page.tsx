"use client";

import React from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please login to access the dashboard");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-8">Welcome to the Dashboard!</p>
      <div className="mb-8">
        <p>This is a simple and presentable UI for test purposes.</p>
      </div>
      <Link 
        href="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Home
      </Link>
    </div>
  );
};

export default Dashboard;