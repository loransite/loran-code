// components/Designer/DashboardLayout.tsx
"use client";

import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  user: { fullName: string; role: string };
}

export default function DashboardLayout({ children, user }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-xl">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
            Loran Designer Studio
          </h1>
          <div className="flex items-center gap-6">
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.fullName}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full backdrop-blur-sm transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  );
}