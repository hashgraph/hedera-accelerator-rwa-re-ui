import Account from "@/components/Account/account";
import { Suspense } from "react";

export default function AccountPage() {
   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <Suspense>
            <Account />
         </Suspense>
      </div>
   );
}
