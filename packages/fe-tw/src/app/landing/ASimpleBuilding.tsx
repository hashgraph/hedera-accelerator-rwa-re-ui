import Link from "next/link";
import React from "react";

export function ASimpleBuilding() {
	return (
		<div className="flex flex-wrap items-center mt-32 text-slate-700">
			<div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
				<div className="text-slate-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
					<i className="fas fa-user-friends text-xl" />
				</div>
				<h3 className="text-3xl mb-2 font-semibold leading-normal">
					Join us on the journey
				</h3>
				<p className="text-lg font-light leading-relaxed mt-4 mb-4 text-slate-600">
					We've decided to not present the finished product, but to go through
					the overall journey with you, explaining some of the thought
					processes, standards, and choices we made along the way
				</p>
				<p className="text-lg font-light leading-relaxed mt-0 mb-4 text-slate-600">
					We start with a single building, and cover important topics like
					issuance, fractionization, governance, compliance, and rewards
				</p>
				Check out our&nbsp;
				<Link href="/" className="font-bold text-slate-700 mt-8">
					blog posts
				</Link>
				&nbsp;and&nbsp;
				<Link href="/" className="font-bold text-slate-700 mt-8">
					our <i className="fab fa-square-github" /> Repos
				</Link>
			</div>

			<div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
				<div className="relative flex flex-col min-w-0 break-words text-white w-full mb-6 shadow-lg rounded-lg bg-blue-500 ">
					<img
						alt="..."
						src="https://images.unsplash.com/photo-1551361415-69c87624334f?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						className="w-full align-middle rounded-t-lg"
					/>
					<blockquote className="relative p-8 mb-4">
						<h4 className="text-xl font-bold text-white">Demo Building</h4>
						<p className="text-md font-light mt-2 text-white ">
							Check out how all the different technologies mesh together on
							a&nbsp;
							<Link href="/dash/" className="font-bold  mt-8">
								single building
							</Link>
						</p>
					</blockquote>
				</div>
			</div>
		</div>
	);
}
