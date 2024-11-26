import React from "react";

// components

export default function CardDemographics() {
	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-6">
				<div className="block w-full overflow-x-auto">
					<h3 className="font-semibold text-base text-slate-700 text-left">
						Demographics
					</h3>
					{/* Projects table */}
					<table className="items-center  bg-transparent border-collapse table table-auto w-full">
						<tbody>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Constructed
								</th>
								<td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									1980
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									Type
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									Hi-Rise
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									# Floors
								</th>
								<td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left">
									20
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Location
								</th>
								<td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									USA / IL / Chicago
								</td>
							</tr>
							<tr className="odd:bg-white even:bg-gray-100 ">
								<th className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Location Type
								</th>
								<td className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left">
									Inner Urban
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
