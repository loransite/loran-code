"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  activeRole: string;
  designerStatus?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  rating?: number;
  totalReviews?: number;
  height?: number;
  bmi?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: string | null;
  availableRoles: string[];
  isLoggedIn: boolean;
  login: (data: { user: User; token: string; availableRoles: string[] }) => void;
  logout: () => void;
  switchRole: (role: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchLatestProfile = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            const updatedUser = { 
              ...data, 
              id: data._id,
              activeRole: activeRole // Preserve current activeRole
            };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            sessionStorage.setItem('availableRoles', JSON.stringify(updatedUser.roles || []));
            setUser(updatedUser);
            setAvailableRoles(updatedUser.roles || []);
          } else if (res.status === 401) {
            logout();
          }
        } catch (error) {
          console.error("Failed to refresh profile:", error);
        }
      }
    };

    try {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
      const storedAvailableRoles = sessionStorage.getItem('availableRoles');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Use the activeRole from the stored user data, or fallback to first role
        const activeRoleFromStorage = parsedUser.activeRole || (parsedUser.roles && parsedUser.roles[0]) || 'client';
        
        setActiveRole(activeRoleFromStorage);
        // Store in sessionStorage for direct access
        sessionStorage.setItem('activeRole', activeRoleFromStorage);
        setAvailableRoles(storedAvailableRoles ? JSON.parse(storedAvailableRoles) : (parsedUser.roles || []));
        
        // Fetch background update to verify/refresh status (approved/roles etc)
        fetchLatestProfile();
      } else {
        // If there's no token and the user is not on a public page, redirect to login
        const publicPaths = ['/login', '/signup', '/forgot-password', '/'];
        if (!publicPaths.includes(pathname) && !pathname.startsWith('/reset-password') && !pathname.startsWith('/catalogue')) {
           // router.push('/login');
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state from sessionStorage", error);
      logout();
    }
  }, [pathname]);

  const login = (data: { user: User; token: string; availableRoles: string[] }) => {
    try {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('availableRoles', JSON.stringify(data.availableRoles));

      setToken(data.token);
      setUser(data.user);
      setActiveRole(data.user.activeRole);
      setAvailableRoles(data.availableRoles);

      // Store activeRole in sessionStorage for direct access
      sessionStorage.setItem('activeRole', data.user.activeRole);

      // Redirect to home page instead of dashboard
      router.push('/');
    } catch (error) {
      console.error("Failed to save auth state to sessionStorage", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('availableRoles');

    setUser(null);
    setToken(null);
    setActiveRole(null);
    setAvailableRoles([]);
    router.push('/login');
  };

  const switchRole = async (role: string) => {
    if (user && availableRoles.includes(role)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/switch-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role })
        });

        if (res.ok) {
          const data = await res.json();
          // Update both token and state with new active role
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify({ ...data.user, id: data.user._id || data.user.id }));
          sessionStorage.setItem('availableRoles', JSON.stringify(data.user.roles || []));
          
          setToken(data.token);
          setActiveRole(data.user.activeRole);
          setUser({ ...data.user, id: data.user._id || data.user.id });
          setAvailableRoles(data.user.roles || []);

          // Store activeRole in sessionStorage
          sessionStorage.setItem('activeRole', data.user.activeRole);

          // Navigate to appropriate dashboard
          if (role === 'designer') {
            router.push('/dashboard/designer');
          } else if (role === 'admin') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard/client');
          }
        } else {
          const err = await res.json();
          alert(err.message || 'Failed to switch role');
        }
      } catch (error) {
        console.error("Switch role error:", error);
        alert('An error occurred while switching roles');
      }
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    activeRole,
    availableRoles,
    isLoggedIn: !!token,
    login,
    logout,
    switchRole,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
