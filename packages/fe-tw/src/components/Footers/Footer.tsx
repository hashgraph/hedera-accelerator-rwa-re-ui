"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export const Footer = () => {
   const pathname = usePathname();
   const isOnAdminPage = pathname.includes('/admin') || pathname.includes('/building/');

   return (
      <>
         <footer
            className="relative pt-12 pb-8 text-black"
            style={{
               paddingLeft: isOnAdminPage ? 256 : 0,
               background: "linear-gradient(to top, #F8F4FE 70%, #FFFFFF 100%)",
            }}
         >
            {/* Gradient SVG */}
            <div
               className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
               style={{ transform: "translateZ(0)" }}
            >
               {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
               <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
               >
                  <polygon className="text-white fill-current" points="2560 0 2560 100 0 100" />
               </svg>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4">
               <div className="flex flex-wrap justify-between items-start">
                  {/* Social Media Section */}
                  <div className="w-full lg:w-3/12 px-4 mb-8 lg:mb-0">
                     <h5 className="text-base font-semibold mb-4 text-center lg:text-left">
                        Stay in the loop
                     </h5>
                     <div className="flex justify-center lg:justify-start space-x-4">
                        <Button
                           variant="outline"
                           type="button"
                        >
                           <i className="fab fa-twitter" />
                        </Button>
                        <Button
                           variant="outline"
                           type="button"
                        >
                          <i className="fab fa-discord" />
                        </Button>
                        <Button
                           variant="outline"
                           type="button"
                        >
                           <i className="fab fa-github" />
                        </Button>
                     </div>
                  </div>

                  {/* Newsletter Signup Section */}
                  <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0 flex justify-center">
                     <div className="text-center">
                        <h5 className="text-base font-semibold mb-4">Newsletter</h5>
                        <form className="flex flex-row justify-center">
                           <Input
                              type="email"
                              placeholder="Your email address"
                           />
                           <Button
                              variant="outline"
                              type="button"
                              className="ml-5"
                           >
                              Subscribe
                           </Button>
                        </form>
                     </div>
                  </div>

                  {/* Useful Links Section */}
                  <div className="w-full lg:w-3/12 px-4 lg:pl-12">
                     <h5 className="text-base font-semibold mb-4 text-center lg:text-left">
                        Useful Links
                     </h5>
                     <ul className="list-none space-y-1 text-sm text-center lg:text-left">
                        <li>
                           <a href="https://hedera.com" className="link link-hover text-gray-700">
                              About Us
                           </a>
                        </li>
                        <li>
                           <a
                              href="https://hedera.com/blog"
                              className="link link-hover text-gray-700"
                           >
                              Blog
                           </a>
                        </li>
                        <li>
                           <a
                              href="https://github.com/hashgraph/repo/blob/main/LICENSE.md"
                              className="link link-hover text-gray-700"
                           >
                              ASL License
                           </a>
                        </li>
                        <li>
                           <a
                              href="https://headera.com/terms"
                              className="link link-hover text-gray-700"
                           >
                              Terms & Conditions
                           </a>
                        </li>
                        <li>
                           <a
                              className="link link-hover text-gray-700"
                              href="https://hedera.com/privacy"
                           >
                              Privacy Policy
                           </a>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Divider */}
               <hr className="my-6 border-gray-300" />

               {/* Copyright Section */}
               <div className="text-center text-gray-500 text-sm font-semibold">
                  Copyright © {new Date().getFullYear()} by{" "}
                  <a href="https://www.hashgraph.com" className="text-gray-700 hover:text-gray-900">
                     Hashgraph
                  </a>
                  .
               </div>
            </div>
         </footer>
      </>
   );
};
