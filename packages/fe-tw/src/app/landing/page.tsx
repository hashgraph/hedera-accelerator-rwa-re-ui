import React from "react";
import { ASimpleBuilding } from "@/app/landing/ASimpleBuilding";
import { CTAs } from "@/app/landing/CTAs";
import { REIT20 } from "@/app/landing/REIT20";
import { REIT30 } from "@/app/landing/REIT30";

export default function Landing() {
  return (
    <main style={{ backgroundColor: "#F9F3F8" }}>
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col justify-between text-center">
        <div className="flex-grow flex items-center justify-center flex-col px-6">
          <h1 className="text-black font-bold text-5xl mb-4">
            Buildings <q>R</q> Us
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            How would you build a REIT using web3 technologies?
          </p>
          <button className="bg-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 transition">
            Explore
          </button>
        </div>
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
      <section className="pb-20">
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

