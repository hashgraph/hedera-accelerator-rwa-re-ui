import React from "react";

export default function FooterAdmin() {
	return (
		<>
			<footer className="block py-4">
				<div className="container mx-auto px-4">
					<hr className="mb-4 border-b-1 border-slate-200" />
					<div className="flex flex-wrap items-center md:justify-between justify-center">
						<div className="w-full md:w-4/12 px-4">
							<div className="text-sm text-slate-500 font-semibold py-1 text-center md:text-left">
								Copyright © 2023 - {new Date().getFullYear()}{" "}
								<a
									href="https://hedera.com"
									className="text-slate-500 hover:text-slate-700 text-sm font-semibold py-1"
								>
									Hedera
								</a>
							</div>
						</div>
						<div className="w-full md:w-8/12 px-4">
							<ul className="flex flex-wrap list-none md:justify-end  justify-center">
								<li>
									<a
										href="https://hedera.com"
										className="text-slate-600 hover:text-slate-800 text-sm font-semibold block py-1 px-3"
									>
										Hedera
									</a>
								</li>
								<li>
									<a
										href="https://hedera.com/rwa"
										className="text-slate-600 hover:text-slate-800 text-sm font-semibold block py-1 px-3"
									>
										RWA
									</a>
								</li>
								<li>
									<a
										href="https://github.com/rwa-link-ui"
										className="text-slate-600 hover:text-slate-800 text-sm font-semibold block py-1 px-3"
									>
										<i className="fab fa-square-github" /> UI
									</a>
								</li>
								<li>
									<a
										href="https://github.com/rwa-link"
										className="text-slate-600 hover:text-slate-800 text-sm font-semibold block py-1 px-3"
									>
										<i className="fab fa-square-github" /> Smart Contracts
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
