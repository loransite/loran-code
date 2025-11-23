"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "client") {
      router.push("/");
    } else {
      setUser(parsedUser);
    }
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>
      {user ? <p>Welcome {user.fullName}! View your custom orders here.</p> : null}
      {/* You can later map client orders here */}
    </div>
  );
}
