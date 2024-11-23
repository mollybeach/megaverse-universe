/**
 * @title Home Page
 * @fileoverview Home page component
 * @path /app/page.tsx
 */

"use client"; 
import React from "react";
import MainContent from '@/components/MainContent';
import { Hero } from "@/components/Hero";

const Home: React.FC = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-6 gap-8 bg-white dark:bg-gray-900 text-black dark:text-white"> {/* Updated for dark mode */}
      <Hero />
      <MainContent />
    </div>
  );
}

export default Home;