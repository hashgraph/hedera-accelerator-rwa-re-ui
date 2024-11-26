import React from "react";

export default function Footer() {
	return (
		<>
			<footer className="relative bg-slate-200 pt-8 pb-6 text-black">
				<div
					className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
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
						<polygon
							className="text-slate-200 fill-current"
							points="2560 0 2560 2560 0 100"
						/>
					</svg>
				</div>
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap text-center lg:text-left">
						<div className="w-full lg:w-6/12 px-4">
							<h4 className="text-3xl font-semibold">Let's keep in touch!</h4>
							<h5 className="text-lg mt-0 mb-2 text-slate-600">
								Find us on any of these platforms, we respond 1-2 business days.
							</h5>
							<div className="mt-6 lg:mb-0 mb-6">
								<button
									className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
									type="button"
								>
									<i className="fab fa-twitter" />
								</button>

								<button
									className="bg-white text-blue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
									type="button"
								>
									<i className="fab fa-discord" />
								</button>
								<button
									className="bg-white text-slate-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
									type="button"
								>
									<i className="fab fa-github" />
								</button>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="flex flex-wrap items-top mb-6">
								<div className="w-full lg:w-4/12 px-4 ml-auto">
									<span className="block uppercase text-slate-500 text-sm font-semibold mb-2">
										Useful Links
									</span>
									<ul className="list-unstyled">
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://hedera.com"
											>
												About Us
											</a>
										</li>
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://hedera.com/blog"
											>
												Blog
											</a>
										</li>
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://www.github.com/hashgraph/xyz"
											>
												Github
											</a>
										</li>
									</ul>
								</div>
								<div className="w-full lg:w-4/12 px-4">
									<span className="block uppercase text-slate-500 text-sm font-semibold mb-2">
										Other Resources
									</span>
									<ul className="list-unstyled">
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://github.com/hashgraph/repo/blob/main/LICENSE.md"
											>
												ASL License
											</a>
										</li>
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://headera.com/terms"
											>
												Terms & Conditions
											</a>
										</li>
										<li>
											<a
												className="text-slate-600 hover:text-slate-800 font-semibold block pb-2 text-sm"
												href="https://hedera.com/privacy"
											>
												Privacy Policy
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<hr className="my-6 border-slate-300" />
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-5/12 px-4 mx-auto text-center">
							<div className="text-sm text-slate-500 font-semibold py-1">
								Copyright © 2023 - {new Date().getFullYear()} by{" "}
								<a
									href="https://www.headera.com"
									className="text-slate-500 hover:text-slate-800"
								>
									Hedrea
								</a>
								.
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-5/12 px-4 mx-auto text-center">
							<div className="text-sm text-slate-500 py-1">
								Images sourced from&nbsp;
								<a
									href="https://www.unsplash.com"
									className="text-slate-500 hover:text-slate-800 font-semibold "
								>
									Unsplash
								</a>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-5/12 px-4 mx-auto text-center">
							<div className="text-sm text-slate-500 py-1">
								Templates sourced from&nbsp;
								<a
									href="https://www.creative-tim.com"
									className="text-slate-500 hover:text-slate-800 font-semibold "
								>
									Creative-Tim
								</a>{" "}
								(notus)
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
