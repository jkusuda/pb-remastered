import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d4ed7a] p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
