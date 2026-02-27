"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthForm from "./AuthForm";

export default function AuthModal() {
  const router = useRouter();

  function close() {
    router.push("/");
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute -top-3 -right-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full border-[2px] border-[#ccc] shadow-md text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <AuthForm />
      </div>
    </div>
  );
}
