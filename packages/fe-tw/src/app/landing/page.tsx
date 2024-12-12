import React from "react";

import { ASimpleBuilding } from "@/app/landing/ASimpleBuilding";
import { CTAs } from "@/app/landing/CTAs";
import { REIT20 } from "@/app/landing/REIT20";
import { REIT30 } from "@/app/landing/REIT30";

export default function Landing() {
  return (
    <main style={{ backgroundColor: "#F9F3F8" }}>
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
        <div className="container mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-black font-semibold text-5xl">
                  Buildings <q>R</q> Us
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                  How would you build a REIT using web3 technologies?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <title>Title</title>
            <polygon
              className="text-gray-300 fill-current"
              points="2560 0 2560 100 0 100"
            />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-20 -mt-24">
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
