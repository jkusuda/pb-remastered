"use client";

import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

function LoginContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d4ed7a] p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#d4ed7a] p-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
