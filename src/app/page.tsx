'use client'
import UserManager from '@/components/UserManager';
import { useEffect } from 'react';

export default function Home() {
  useEffect(()=>{
    console.log("Home Screen Loaded")
  },[])
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <UserManager />
      <p>
        Home Screen
      </p>
    </div>
  );
}
