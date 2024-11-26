import React from "react";

// components

export default function CardFinancials() {
	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-6">
				<div className="block w-full overflow-x-auto">
					<h3 className="font-semibold text-base text-slate-700 text-left">
						Financials
					</h3>
					{/* Projects table */}
					<table className="items-center  bg-transparent border-collapse table table-auto w-full">
						<tbody>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									%ge owned of overall property
								</th>
								<td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									50%
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									# of tokens
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									300,000 ($30M)
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									Token price
								</th>
								<td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									$30.50
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Direct Exposure
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									2,000 ($180k)
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Yield
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									7% (30d) 6% (120d)
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Treasury
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									5,000 Tokens ($450k) / 100,000 USDC
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
