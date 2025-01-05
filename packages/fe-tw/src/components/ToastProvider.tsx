"use client";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return <Toaster position="top-right" reverseOrder={false} />;
}
