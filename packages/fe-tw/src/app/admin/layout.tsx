import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="flex min-h-screen bg-white">
         <SidebarProvider>
            <AdminSidebar />

            <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto max-w-(--breakpoint-lg) sm:max-w-(--breakpoint-xl)">
               {children}
            </main>
         </SidebarProvider>
      </div>
   );
}
