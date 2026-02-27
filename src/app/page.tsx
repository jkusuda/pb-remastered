import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import AuthModal from "@/components/auth/AuthModal";
import { createClient } from "@/lib/supabase/server";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ modal?: string }>;
}) {
  return <HomeContent searchParamsPromise={searchParams} />;
}

async function HomeContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ modal?: string }>;
}) {
  const [{ modal }, supabase] = await Promise.all([
    searchParamsPromise,
    createClient(),
  ]);

  const { data: { user } } = await supabase.auth.getUser();
  const showModal = modal === "login" && !user;

  return (
    <div className="scanlines fixed inset-0 w-screen h-screen bg-[#d4ed7a] flex flex-col items-center justify-center overflow-hidden">
      {showModal && <AuthModal />}
      <div className="corner-tl fixed top-6 left-6 w-12 h-12 opacity-18 border-t-4 border-l-4 border-[#3a5a00]" />
      <div className="corner-tr fixed top-6 right-6 w-12 h-12 opacity-18 border-t-4 border-r-4 border-[#3a5a00]" />
      <div className="corner-bl fixed bottom-6 left-6 w-12 h-12 opacity-18 border-b-4 border-l-4 border-[#3a5a00]" />
      <div className="corner-br fixed bottom-6 right-6 w-12 h-12 opacity-18 border-b-4 border-r-4 border-[#3a5a00]" />

      <LandingNav isLoggedIn={!!user} />
      <LandingHero isLoggedIn={!!user} />

      <svg className="pokeball-deco fixed bottom-[-120px] left-1/2 -translate-x-1/2 w-[280px] h-[280px] opacity-8 pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" stroke="#3a5a00" strokeWidth="4" fill="none" />
        <path d="M 2 50 L 98 50" stroke="#3a5a00" strokeWidth="4" />
        <circle cx="50" cy="50" r="14" stroke="#3a5a00" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="6" fill="#3a5a00" />
        <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#3a5a00" opacity="0.3" />
      </svg>
    </div>
  );
}