"use client";
import React from "react";
//import PropTypes from "prop-types";

// components

import TableDropdown from "@/components/Dropdowns/TableDropdown";

export default function CardTable(props: PropTypes) {
   const { color } = { ...defaultProps, ...props };
   return (
      <>
         <div
            className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-sm ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
         >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
               <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full grow flex-1">
                     <h3
                        className={`font-semibold text-lg ${color === "light" ? "text-slate-700" : "text-white"}`}
                     >
                        Card Tables
                     </h3>
                  </div>
               </div>
            </div>
            <div className="block w-full overflow-x-auto">
               {/* Projects table */}
               <table className="items-center w-full bg-transparent border-collapse">
                  <thead>
                     <tr>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        >
                           Project
                        </th>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        >
                           Budget
                        </th>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        >
                           Status
                        </th>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        >
                           Users
                        </th>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        >
                           Completion
                        </th>
                        <th
                           className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${
                              color === "light"
                                 ? "bg-slate-50 text-slate-500 border-slate-100"
                                 : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
                           }`}
                        />
                     </tr>
                  </thead>
                  <tbody>
                     <tr className={`ml-3 ${color === "light" ? "text-slate-600" : "text-white"}`}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                           <img
                              src="/assets/img/bootstrap.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                           />{" "}
                           <span
                              className={`ml-3 font-bold ${color === "light" ? "text-slate-600" : "text-white"}`}
                           >
                              Argon Design System
                           </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           $2,500 USD
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <i className="fas fa-circle text-orange-500 mr-2" /> pending
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex">
                              <img
                                 src="/assets/img/team-1-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
                              />
                              <img
                                 src="/assets/img/team-2-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-3-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-4-470x470.png"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex items-center">
                              <span className="mr-2">60%</span>
                              <div className="relative w-full">
                                 <div className="overflow-hidden h-2 text-xs flex rounded-sm bg-red-200">
                                    <div
                                       style={{ width: "60%" }}
                                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                                    />
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                           <TableDropdown />
                        </td>
                     </tr>
                     <tr className={`ml-3 ${color === "light" ? "text-slate-600" : "text-white"}`}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                           <img
                              src="/assets/img/angular.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                           />{" "}
                           <span
                              className={`ml-3 font-bold ${color === "light" ? "text-slate-600" : "text-white"}`}
                           >
                              Angular Now UI Kit PRO
                           </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           $1,800 USD
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <i className="fas fa-circle text-emerald-500 mr-2" /> completed
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex">
                              <img
                                 src="/assets/img/team-1-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
                              />
                              <img
                                 src="/assets/img/team-2-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-3-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-4-470x470.png"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex items-center">
                              <span className="mr-2">100%</span>
                              <div className="relative w-full">
                                 <div className="overflow-hidden h-2 text-xs flex rounded-sm bg-emerald-200">
                                    <div
                                       style={{ width: "100%" }}
                                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                    />
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                           <TableDropdown />
                        </td>
                     </tr>
                     <tr className={`ml-3 ${color === "light" ? "text-slate-600" : "text-white"}`}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                           <img
                              src="/assets/img/sketch.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                           />{" "}
                           <span
                              className={`ml-3 font-bold ${color === "light" ? "text-slate-600" : "text-white"}`}
                           >
                              Black Dashboard Sketch
                           </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           $3,150 USD
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <i className="fas fa-circle text-red-500 mr-2" /> delayed
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex">
                              <img
                                 src="/assets/img/team-1-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
                              />
                              <img
                                 src="/assets/img/team-2-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-3-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-4-470x470.png"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex items-center">
                              <span className="mr-2">73%</span>
                              <div className="relative w-full">
                                 <div className="overflow-hidden h-2 text-xs flex rounded-sm bg-red-200">
                                    <div
                                       style={{ width: "73%" }}
                                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                                    />
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                           <TableDropdown />
                        </td>
                     </tr>
                     <tr className={`ml-3 ${color === "light" ? "text-slate-600" : "text-white"}`}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                           <img
                              src="/assets/img/react.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                           />{" "}
                           <span
                              className={`ml-3 font-bold ${color === "light" ? "text-slate-600" : "text-white"}`}
                           >
                              React Material Dashboard
                           </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           $4,400 USD
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <i className="fas fa-circle text-teal-500 mr-2" /> on schedule
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex">
                              <img
                                 src="/assets/img/team-1-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
                              />
                              <img
                                 src="/assets/img/team-2-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-3-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-4-470x470.png"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex items-center">
                              <span className="mr-2">90%</span>
                              <div className="relative w-full">
                                 <div className="overflow-hidden h-2 text-xs flex rounded-sm bg-teal-200">
                                    <div
                                       style={{ width: "90%" }}
                                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                                    />
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                           <TableDropdown />
                        </td>
                     </tr>
                     <tr className={`ml-3 ${color === "light" ? "text-slate-600" : "text-white"}`}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                           <img
                              src="/assets/img/vue.jpg"
                              className="h-12 w-12 bg-white rounded-full border"
                              alt="..."
                           />{" "}
                           <span
                              className={`ml-3 font-bold ${color === "light" ? "text-slate-600" : "text-white"}`}
                           >
                              React Material Dashboard
                           </span>
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           $2,200 USD
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <i className="fas fa-circle text-emerald-500 mr-2" /> completed
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex">
                              <img
                                 src="/assets/img/team-1-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm"
                              />
                              <img
                                 src="/assets/img/team-2-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-3-800x800.jpg"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                              <img
                                 src="/assets/img/team-4-470x470.png"
                                 alt="..."
                                 className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm -ml-4"
                              />
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                           <div className="flex items-center">
                              <span className="mr-2">100%</span>
                              <div className="relative w-full">
                                 <div className="overflow-hidden h-2 text-xs flex rounded-sm bg-emerald-200">
                                    <div
                                       style={{ width: "100%" }}
                                       className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                    />
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                           <TableDropdown />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
}

const defaultProps: PropTypes = {
   color: "light",
};

interface PropTypes {
   color?: "light" | "dark";
}
