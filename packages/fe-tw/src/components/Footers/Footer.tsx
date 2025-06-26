"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export const Footer = () => {
   const pathname = usePathname();
   const isOnAdminPage = pathname.includes("/admin") || pathname.includes("/building/");

   return (
      <>
         <footer
            className="relative bg-white border-t border-border"
            style={{
               paddingLeft: isOnAdminPage ? 256 : 0,
            }}
         >
            <div className="w-full px-6 py-4">
               <div className="flex flex-wrap justify-between items-start">
                  <div className="w-full lg:w-4/12 px-2 mb-4 lg:mb-0">
                     <h5 className="text-sm font-semibold mb-3 text-foreground">Stay Connected</h5>
                     <div className="flex space-x-2">
                        <Button
                           size="sm"
                           variant="outline"
                           type="button"
                           onClick={() => window.open("https://twitter.com/hedera", "_blank")}
                        >
                           <i className="fab fa-twitter mr-1" />
                           Twitter
                        </Button>
                        <Button
                           size="sm"
                           type="button"
                           variant="outline"
                           onClick={() =>
                              window.open("https://discord.com/invite/E7Hhx2adVF", "_blank")
                           }
                        >
                           <i className="fab fa-discord mr-1" />
                           Discord
                        </Button>
                        <Button
                           size="sm"
                           type="button"
                           variant="outline"
                           onClick={() => window.open("https://github.com/hashgraph", "_blank")}
                        >
                           <i className="fab fa-github mr-1" />
                           GitHub
                        </Button>
                     </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-2 mb-4 lg:mb-0">
                     <div className="text-center">
                        <h5 className="text-sm font-semibold mb-3 text-foreground">Stay Updated</h5>
                        <Button
                           variant="outline"
                           type="button"
                           onClick={() => window.open("https://hedera.com/blog", "_blank")}
                        >
                           Visit Our Blog
                        </Button>
                     </div>
                  </div>

                  <div className="w-full lg:w-4/12 px-2">
                     <h5 className="text-sm font-semibold mb-3 text-foreground">Resources</h5>
                     <ul className="list-none space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <li>
                           <a
                              target="_blank"
                              href="https://hedera.com"
                              className="text-muted-foreground hover:text-primary transition-colors text-sm"
                           >
                              About Hedera
                           </a>
                        </li>
                        <li>
                           <a
                              target="_blank"
                              href="https://docs.hedera.com"
                              className="text-muted-foreground hover:text-primary transition-colors text-sm"
                           >
                              Documentation
                           </a>
                        </li>
                        <li>
                           <a
                              target="_blank"
                              href="https://github.com/hashgraph/hedera-services/blob/main/LICENSE"
                              className="text-muted-foreground hover:text-primary transition-colors text-sm"
                           >
                              License
                           </a>
                        </li>
                        <li>
                           <a
                              target="_blank"
                              href="https://hedera.com/terms-of-use"
                              className="text-muted-foreground hover:text-primary transition-colors text-sm"
                           >
                              Terms of Use
                           </a>
                        </li>
                        <li>
                           <a
                              target="_blank"
                              href="https://hedera.com/privacy-policy"
                              className="text-muted-foreground hover:text-primary transition-colors text-sm"
                           >
                              Privacy Policy
                           </a>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Copyright Section */}
               <div className="text-center text-muted-foreground text-xs mt-4 pt-3 border-t border-border">
                  © {new Date().getFullYear()} Hedera Hashgraph, LLC. All rights reserved.
               </div>
            </div>
         </footer>
      </>
   );
};
