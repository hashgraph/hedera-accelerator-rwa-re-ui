"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import "./globals.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/landing");
  }, [router]);

  return null;
}
