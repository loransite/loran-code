"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Palette, ChevronDown } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function RoleSwitcher() {
  const { availableRoles } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!availableRoles || availableRoles.length === 0) {
    return null;
  }

  const userRoles = availableRoles;

  // If only one role, show direct link
  if (userRoles.length === 1) {
    const role = userRoles[0];
    return (
      <Link
        href={`/dashboard/${role}`}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
      >
        {role === 'client' ? <User className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
        <span className="capitalize">{role} Dashboard</span>
      </Link>
    );
  }

  // If multiple roles, show dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
      >
        <User className="w-4 h-4" />
        <span>My Dashboards</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl overflow-hidden min-w-[200px] z-50"
          >
            {userRoles.includes('client') && (
              <Link
                href="/dashboard/client"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition text-gray-800 border-b"
              >
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-semibold">Client View</div>
                  <div className="text-xs text-gray-500">Browse & Buy Designs</div>
                </div>
              </Link>
            )}
            
            {userRoles.includes('designer') && (
              <Link
                href="/dashboard/designer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition text-gray-800"
              >
                <Palette className="w-5 h-5 text-pink-600" />
                <div>
                  <div className="font-semibold">Designer View</div>
                  <div className="text-xs text-gray-500">Manage Your Designs</div>
                </div>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
