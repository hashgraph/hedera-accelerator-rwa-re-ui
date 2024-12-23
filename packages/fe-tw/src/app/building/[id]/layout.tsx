import LayoutClient from "@/components/Pages/LayoutClient/LayoutClient";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;

  return (
    <LayoutClient id={id}>
      {children}
    </LayoutClient>
  );
}
