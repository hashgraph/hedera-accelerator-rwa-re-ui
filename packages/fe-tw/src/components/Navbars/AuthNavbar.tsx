"use client";
import React from "react";

// components

import type { Links } from "@/types/nav";
import Link from "next/link";
import PagesDropdown from "@/components/Dropdowns/PagesDropdown";
import { openWalletConnectModal } from "@/services/wallets/walletconnect/WalletConnectClient";
import { useWalletInterface } from "@/services/useWalletInterface";
import { connectToMetamask } from "@/services/wallets/metamask/MetaMaskClient";
import TokenBalance from "@/components/TokenBalance/TokenBalance";

export default function Navbar({
	/*	transparent,*/
	title,
	links,
}: { transparent?: boolean; title?: string; links: Links }) {
	const [navbarOpen, setNavbarOpen] = React.useState(false);
	const { accountId, walletInterface } = useWalletInterface();

	return (
		<>
			<nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
				<div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
						<Link
							className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
							href="/"
						>
							{title || "BRU"}
						</Link>
						<button
							className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
							type="button"
							onClick={() => setNavbarOpen(!navbarOpen)}
						>
							<i className="text-white fas fa-bars" />
						</button>
					</div>
					<div
						className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none${navbarOpen ? " block rounded shadow-lg" : " hidden"}`}
						id="example-navbar-warning"
					>
						<ul className="flex flex-col lg:flex-row list-none mr-auto">
							<li className="flex items-center">
								<a
									className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
									href="https://www.example.comm/lr"
								>
									<i className="lg:text-slate-200 text-slate-400 far fa-file-alt text-lg leading-lg mr-2" />{" "}
									Blogs
								</a>
							</li>
							<TokenBalance />
						</ul>
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
							<li className="flex items-center">
								{accountId ? (
									<button
										type="button"
										className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
										onClick={(e) => {
											walletInterface.disconnect();
										}}
									>
										[ {accountId} ] Disconnect
									</button>
								) : (
									<>
										<button
											type="button"
											className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
											onClick={(e) => {
												openWalletConnectModal();
											}}
										>
											WalletConnect
										</button>

										<button
											type="button"
											className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
											onClick={(e) => {
												connectToMetamask();
											}}
										>
											Metamask
										</button>
									</>
								)}
							</li>

							<li className="flex items-center">
								<PagesDropdown links={links} />
							</li>

							<li className="flex items-center">
								<a
									className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
									href="https://twitter.com/intent/tweet?ur%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level.%20"
									target="_blank"
									rel="noreferrer"
								>
									<i className="lg:text-slate-200 text-slate-400 fab fa-twitter text-lg leading-lg " />
									<span className="lg:hidden inline-block ml-2">Tweet</span>
								</a>
							</li>
							<li className="flex items-center">
								<a
									className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
									href="https://twitter.com/intent/tweet?ur%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level.%20"
									target="_blank"
									rel="noreferrer"
								>
									<i className="lg:text-slate-200 text-slate-400 fab fa-discord text-lg leading-lg " />
									<span className="lg:hidden inline-block ml-2">Discord</span>
								</a>
							</li>

							<li className="flex items-center">
								<a
									className="lg:text-white lg:hover:text-slate-200 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
									href="https://github.com/creativetimofficial/notus-react?ref=nr-auth-navbar"
									target="_blank"
									rel="noreferrer"
								>
									<i className="lg:text-slate-200 text-slate-400 fab fa-github text-lg leading-lg " />
									<span className="lg:hidden inline-block ml-2">Star</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
}
