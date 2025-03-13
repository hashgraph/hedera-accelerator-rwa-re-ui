import { ASimpleBuilding } from "@/app/landing/ASimpleBuilding";
import { CTAs } from "@/app/landing/CTAs";
import { REIT20 } from "@/app/landing/REIT20";
import { REIT30 } from "@/app/landing/REIT30";
import Link from "next/link";
import React from "react";

export default function Landing() {
  return (
    <main className="relative overflow-hidden min-h-screen bg-[#F8F4FE]">
      {/*
        Background “bubbles” for a soft, pastel vibe (similar to the screenshot):
        One big purple bubble near the top-left, one greenish near the bottom-right.
      */}
      <div
        className="
          absolute 
          -top-36 
          -left-36 
          w-[700px] 
          h-[700px] 
          rounded-full
          bg-gradient-to-r 
          from-purple-300 
          via-purple-200 
          to-indigo-300
          opacity-30 
          blur-3xl 
          z-0
        "
      />
      <div
        className="
          absolute 
          -bottom-36 
          -right-36 
          w-[800px] 
          h-[800px] 
          rounded-full
          bg-gradient-to-r 
          from-green-200 
          via-cyan-200 
          to-blue-300
          opacity-40 
          blur-3xl 
          z-0
        "
      />

      {/* Hero Section */}
      <div className="relative z-10 h-screen flex flex-col justify-between text-center">
        {/* Centered Hero text & button */}
        <div className="flex-grow flex items-center justify-center flex-col px-6">
          <h1 className="text-black font-bold text-5xl mb-4">
            Buildings <q>R</q> Us
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Building a REIT using web3 technologies
          </p>
          <Link href="/explorer">
            <button className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-purple-600 text-white rounded-full hover:bg-purple-700">
              Explore
            </button>
          </Link>
        </div>

        {/* Scroll-down hint */}
        <div className="mb-8 text-center slow-bounce">
          <p className="text-gray-700 text-sm mb-4">Scroll to Explore</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <CTAs />
          <ASimpleBuilding />
        </div>
      </section>
      <REIT20 />
      <REIT30 />
    </main>
  );
}
