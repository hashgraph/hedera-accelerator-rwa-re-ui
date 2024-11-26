import React from "react";

// components

import { ASimpleBuilding } from "@/app/landing/ASimpleBuilding";
import { CTAs } from "@/app/landing/CTAs";
import { REIT20 } from "@/app/landing/REIT20";
import { REIT30 } from "@/app/landing/REIT30";
import Footer from "@/components/Footers/Footer";
import FENavbar from "@/components/Navbar/FENavbar";

export default function Landing() {
	return (
		<>
			<FENavbar linksForPage="regularUser" title="">
				<main>
					<div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
						<div
							className="absolute top-0 w-full h-full bg-center bg-cover"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
							}}
						>
							<span
								id="blackOverlay"
								className="w-full h-full absolute opacity-75 bg-black"
							/>
						</div>
						<div className="container relative mx-auto">
							<div className="items-center flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
									<div className="pr-12">
										<h1 className="text-white font-semibold text-5xl">
											Buildings <q>R</q> Us
										</h1>
										<p className="mt-4 text-lg text-slate-200">
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
									className="text-slate-200 fill-current"
									points="2560 0 2560 100 0 100"
								/>
							</svg>
						</div>
					</div>
					<section className="pb-20 bg-slate-200 -mt-24">
						<div className="container mx-auto px-4">
							<CTAs />
							<ASimpleBuilding />
						</div>
					</section>
					<REIT20 />
					<REIT30 />
				</main>
			</FENavbar>
			<Footer />
		</>
	);
}
