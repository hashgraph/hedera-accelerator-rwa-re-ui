import { ReactNode, use } from "react";
import BuildingNavigation from "@/components/BuildingNavigation";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }> | { id: string };
};

export default function Layout({ children, params }: LayoutProps) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const { id } = resolvedParams;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-base-100 p-4">
        <BuildingNavigation id={id} />
      </header>
      <main className="p-4 flex-grow">{children}</main>
    </div>
  );
}
