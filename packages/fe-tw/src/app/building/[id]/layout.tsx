import BuildingLayout from "@/components/Buildings/BuildingLayout/BuildingLayout";
import type { ReactNode } from "react";

type LayoutProps = {
   children: ReactNode;
   params: Promise<{ id: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
   const { id } = await params;

   return <BuildingLayout id={id}>{children}</BuildingLayout>;
}
