"use client";

export default function AdminDashboard() {
   return (
      <div className="bg-white p-6 rounded-lg">
         <h1 className="text-3xl font-semibold mb-4">Welcome to the Admin Dashboard</h1>
         <p className="text-gray-600">
            Use the sidebar to navigate to different admin functionalities like Token, Building, and
            Slice Management.
         </p>
         <ul className="list-none space-y-1 text-sm text-center lg:text-left mt-5">
            <li>
               <a
                  href="/admin/tokenmanagement"
                  className="link link-hover text-purple-700 font-bold"
               >
                  Token Management
               </a>
            </li>
            <li>
               <a
                  href="/admin/buildingmanagement"
                  className="link link-hover text-purple-700 font-bold"
               >
                  Building Management
               </a>
            </li>
            <li>
               <a
                  href="/admin/slicemanagement"
                  className="link link-hover text-purple-700 font-bold"
               >
                  Slice Management
               </a>
            </li>
         </ul>
      </div>
   );
}
