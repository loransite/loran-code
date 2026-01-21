"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, User, ChevronDown, Shield, Palette, UserCircle, LogOut, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "../lib/AuthContext"; // Import useAuth

const UploadForm = dynamic(() => import("./AI/UploadForm"), { ssr: false });
const Preview = dynamic(() => import("./AI/Preview"), { ssr: false });
const ResultsPanel = dynamic(() => import("./AI/ResultsPanel"), { ssr: false });
const HistoryList = dynamic(() => import("./AI/HistoryList"), { ssr: false });

function Icon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      );
    case "catalog":
      return (
        <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      );
    case "designers":
      return (
        <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
        </svg>
      );
    case "ai":
      return (
        <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [aiOpen, setAiOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const { isLoggedIn, activeRole, logout, token, availableRoles, switchRole, user } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn && activeRole === 'client' && token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/client`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const orders = data.orders || data || [];
          setOrderCount(orders.length);
        })
        .catch(err => console.error('Failed to fetch orders:', err));
    } else {
      setOrderCount(0);
    }
  }, [isLoggedIn, activeRole, token]);

  const handleLogout = () => {
    logout();
  };

  const handleResult = (res: any) => {
    setResult(res);
    if (res.processedImageUrl) setImageSrc(res.processedImageUrl);
    try {
      const raw = localStorage.getItem("aiHistory");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ id: Date.now().toString(), createdAt: new Date().toISOString(), thumbnail: res.processedImageUrl || null, result: res });
      localStorage.setItem("aiHistory", JSON.stringify(arr.slice(0, 20)));
    } catch (e) {
      console.warn("Failed to write ai history", e);
    }
  };

  const handleLoadHistory = (res: any) => {
    setResult(res);
    if (res.processedImageUrl) setImageSrc(res.processedImageUrl);
  };

  const handleUpdateBBox = (idx: number, bbox: any) => {
    setResult((prev: any) => {
      if (!prev) return prev;
      const copy = { ...prev };
      copy.measurements = copy.measurements.map((m: any, i: number) => (i === idx ? { ...m, bbox } : m));
      return copy;
    });
  };

  useEffect(() => {
    if (!aiOpen) {
      setResult(null);
      setImageSrc(null);
    }
  }, [aiOpen]);

  const menuVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <>
      <motion.nav className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-lg fixed top-0 left-0 w-full z-50" initial="hidden" animate="visible" variants={menuVariants}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="text-white font-extrabold text-2xl tracking-wide">
            <Link href="/">LORAN</Link>
          </motion.div>

          <div className="hidden md:flex space-x-6 text-white font-medium items-center">
            <Link href="/" className="flex items-center hover:text-gray-200 transition"><Icon name="home" />Home</Link>
            <Link href="/about" className="flex items-center hover:text-gray-200 transition">
              <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            <Link href="/catalogue" className="flex items-center hover:text-gray-200 transition"><Icon name="catalog" />Catalogue</Link>
            <Link href="/designers" className="flex items-center hover:text-gray-200 transition"><Icon name="designers" />Designers</Link>

            <button onClick={() => setAiOpen(true)} className="flex items-center text-white hover:text-gray-200 transition">
              <Icon name="ai" />AI Try-On
            </button>

            {isLoggedIn && (
              <Link href="/order" className="flex items-center hover:text-gray-200 transition">
                <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
              </Link>
            )}

            {activeRole === 'client' && (
              <>
                <Link href="/reviews" className="flex items-center hover:text-gray-200 transition">
                  <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Reviews
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-5">
            {isLoggedIn ? (
              <>
                {/* Unified Role Switcher */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all font-bold text-sm"
                  >
                    <UserCircle size={18} />
                    <span>My Role: <span className="capitalize text-yellow-300">{activeRole}</span></span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${roleMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {roleMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
                      >
                        <div className="p-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-2">Switch Workspace</p>
                        </div>
                        <div className="py-2">
                          {availableRoles?.map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                switchRole(role);
                                setRoleMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                                activeRole === role 
                                  ? 'bg-blue-50 text-blue-700 font-extrabold' 
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${
                                  role === 'admin' ? 'bg-red-100 text-red-600' :
                                  role === 'designer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {role === 'admin' ? <Shield size={14} /> : 
                                   role === 'designer' ? <Palette size={14} /> : <User size={14} />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="capitalize leading-tight font-semibold">{role} Panel</span>
                                  {role === 'designer' && user?.designerStatus === 'pending' && (
                                    <span className="text-[10px] text-orange-500 font-bold">Application Pending</span>
                                  )}
                                </div>
                              </div>
                              {activeRole === role && <CheckCircle size={14} className="text-blue-500" />}
                            </button>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-100 p-3 bg-gray-50 flex flex-col gap-2">
                          <Link 
                            href={!activeRole ? '/login' : activeRole === 'client' ? '/dashboard/client' : activeRole === 'designer' ? '/dashboard/designer' : '/dashboard/admin'}
                            className="w-full text-center py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors shadow-md"
                            onClick={() => setRoleMenuOpen(false)}
                          >
                            Open Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold border border-transparent hover:border-red-100"
                          >
                            <LogOut size={14} />
                            Logout Account
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-gray-200 transition">Login</Link>
                <Link href="/signup" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition">Sign Up</Link>
              </>
            )}

            {isLoggedIn && activeRole === 'client' && (
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <Link href="/dashboard/client">
                  <ShoppingCart className="text-white cursor-pointer" size={24} />
                  {orderCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {orderCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl focus:outline-none">
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-indigo-700 text-white flex flex-col items-center space-y-3 py-4">
            <Link href="/" className="flex items-center"><Icon name="home" />Home</Link>
            <Link href="/about" className="flex items-center">
              <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
            <Link href="/catalogue" className="flex items-center"><Icon name="catalog" />Catalogue</Link>
            <Link href="/designers" className="flex items-center"><Icon name="designers" />Designers</Link>
            
            <button onClick={() => setAiOpen(true)} className="flex items-center hover:text-gray-200 transition"><Icon name="ai" />AI Try-On</button>

            {isLoggedIn && (
              <Link href="/order" className="flex items-center hover:text-gray-200 transition">
                <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
              </Link>
            )}

            {isLoggedIn && activeRole === 'client' && (
              <>
                <Link href="/reviews" className="flex items-center hover:text-gray-200 transition">
                  <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Reviews
                </Link>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="w-full px-6 flex flex-col gap-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <p className="text-[10px] uppercase font-bold text-white/60 mb-3 tracking-widest text-center">My Account Roles</p>
                  <div className="flex flex-col gap-2">
                    {availableRoles.map(role => (
                      <button 
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setIsOpen(false);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                          activeRole === role 
                            ? 'bg-white text-blue-700 shadow-lg' 
                            : 'bg-white/5 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="capitalize">{role} Dashboard</span>
                          {role === 'designer' && user?.designerStatus === 'pending' && (
                            <span className="text-[10px] text-yellow-300 opacity-90">Application Pending</span>
                          )}
                        </div>
                        {activeRole === role && <CheckCircle size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <Link 
                  href={!activeRole ? '/login' : activeRole === 'client' ? '/dashboard/client' : activeRole === 'designer' ? '/dashboard/designer' : '/dashboard/admin'}
                  className="w-full text-center py-4 bg-yellow-400 text-blue-900 font-black rounded-2xl shadow-xl transform active:scale-95 transition-all text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Open {activeRole?.charAt(0).toUpperCase() + (activeRole?.slice(1) || '')} Dashboard
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-2 text-white/80 font-bold py-2 hover:text-white"
                >
                  <LogOut size={18} /> Logout Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full px-10">
                <Link href="/login" className="w-full text-center py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Login</Link>
                <Link href="/signup" className="w-full text-center py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* AI Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center p-6">
          <div className="fixed inset-0 bg-black/50" onClick={() => setAiOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto z-70 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center"><Icon name="ai" /> AI Measurement Studio</h2>
              <button onClick={() => setAiOpen(false)} className="text-gray-600 hover:text-gray-900">Close</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                {/* @ts-ignore dynamic imports */
                UploadForm && <UploadForm onResult={handleResult} onPreview={(u: string) => setImageSrc(u)} />}
                {/* @ts-ignore */}
                {HistoryList && <HistoryList onLoad={handleLoadHistory} />}
              </div>

              <div className="lg:col-span-2 space-y-6">
                {/* @ts-ignore */}
                {Preview && <Preview src={imageSrc} measurements={result?.measurements || []} onUpdate={handleUpdateBBox} />}
                {/* @ts-ignore */}
                {ResultsPanel && <ResultsPanel measurements={result?.measurements || []} metadata={result?.metadata} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}