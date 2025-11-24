// frontend/types/index.ts

// Designer info (used in catalogue)
export interface Designer {
  id: string;
  name: string;
}

// Designer profile (for profile pages)
export interface DesignerProfile {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  totalDesigns: number;
  joinedAt: string; // ISO string from DB
}

// Catalogue item (from /api/catalogue)
export interface CatalogueItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  designer: Designer;
  category?: string;
  featured?: boolean;
  createdAt: string;
}

// Design item (from /api/designs - has different structure)
export interface Design {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  image?: string; // fallback for older designs
  description: string;
  category?: string;
  designer: string; // designer ID
  designerName?: string; // designer name (optional)
  createdAt: string;
}

// User type (from auth)
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'client' | 'designer' | 'admin';
}

// Order type
export interface Order {
  _id: string;
  userId: string;
  catalogueId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'confirmed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  total: number;
  designerId?: string;
  measurements?: {
    height?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    sleeveLength?: number;
    notes?: string;
  };
  measurementMethod?: 'ai' | 'manual';
  shipping?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  paymentReference?: string;
  paymentMethod?: string;
  metadata?: any;
  notified?: { admin?: boolean; designer?: boolean };
  createdAt: string;
  updatedAt?: string;
}