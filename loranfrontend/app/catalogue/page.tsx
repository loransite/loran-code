'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CatalogueItem } from "@/app/types";
import { catalogueAPI } from '@/lib/api';

type CatalogueCardItem = CatalogueItem & { image?: string };


export default function CataloguePage() {
  const router = useRouter();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      const res = await catalogueAPI.getAll();
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error('Failed to load catalogue:', err);
      setError('Failed to load catalogue. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...items];

    // Search filter
    if (searchQuery) {
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Price range filter
    if (priceRange.min) {
      result = result.filter(item => item.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(item => item.price <= parseFloat(priceRange.max));
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    setFilteredItems(result);
  }, [searchQuery, categoryFilter, priceRange, sortBy, items]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent" style={{ borderColor: "var(--highlight)", borderTopColor: "transparent" }}></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="p-6 max-w-md w-full text-center rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-xl font-semibold mb-2 status-error" style={{ fontFamily: "'Playfair Display', serif" }}>Error Loading Catalogue</h2>
        <p className="mb-4" style={{ color: "var(--muted)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 font-semibold transition"
          style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Subtle ambient background — no animated blobs */}
      <div className="fixed inset-0 -z-10" style={{ background: "var(--bg)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(232,220,192,0.03) 1px, transparent 1px), linear-gradient(90deg,rgba(232,220,192,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl md:text-6xl text-center mb-3"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--text)" }}
        >
          Design Catalogue
        </motion.h1>
        <p className="text-center mb-8 text-sm" style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          {filteredItems.length} design{filteredItems.length !== 1 ? 's' : ''} available
        </p>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search designs by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--highlight)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-sm transition"
            style={{ background: showFilters ? "var(--highlight)" : "var(--surface-2)", color: showFilters ? "#0E2A22" : "var(--text)", borderRadius: "3px", border: "1px solid var(--border)" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 text-sm transition"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>

          {(searchQuery || categoryFilter !== 'all' || priceRange.min || priceRange.max) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm transition"
              style={{ color: "var(--muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 p-6 rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 transition"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }}
                  >
                    <option value="all">All Categories</option>
                    <option value="dress">Dresses</option>
                    <option value="shirt">Shirts</option>
                    <option value="suit">Suits</option>
                    <option value="senator">Senator</option>
                    <option value="ankara-men">Ankara Men</option>
                    <option value="traditional">Traditional</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Min Price (₦)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 transition"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Max Price (₦)</label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 transition"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", outline: "none" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Pills (Quick Filters) */}
      <div className="flex justify-start sm:justify-center gap-3 mb-10 flex-nowrap sm:flex-wrap overflow-x-auto no-scrollbar pb-2">
        {['all', 'dress', 'shirt', 'suit', 'senator', 'ankara-men'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className="px-5 py-2 font-medium text-sm transition-all"
            style={{
              borderRadius: "999px",
              background: categoryFilter === cat ? "var(--highlight)" : "var(--surface)",
              color: categoryFilter === cat ? "#0E2A22" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <AnimatePresence>
        {filteredItems.map((item) => {
          const catalogueItem = item as CatalogueCardItem;
          const designerName = (typeof item.designer === 'object' && item.designer?.name) 
            ? item.designer.name 
            : (typeof item.designer === 'string' ? item.designer : 'Unknown');
          const designerId = (typeof item.designer === 'object' && item.designer?.id) 
            ? item.designer.id 
            : null;
          const imagePath = catalogueItem.image || item.imageUrl;

          return (
            <motion.div
              key={item._id}
              variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0 } }}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-2xl overflow-hidden transition-shadow group cursor-pointer"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              onClick={() => {
                if (designerId) router.push(`/designers/${designerId}`);
              }}
            >
              {item.featured && (
                <motion.div 
                  className="absolute top-2 left-2 text-white text-xs px-2 py-1 z-10"
                  style={{ background: "var(--accent)", borderRadius: "999px" }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Featured
                </motion.div>
              )}

              <motion.div 
                className="relative h-48 overflow-hidden"
                style={{ background: "var(--surface-2)" }}
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src={imagePath?.startsWith('/images/') 
                    ? imagePath
                    : imagePath?.startsWith('/') 
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${imagePath}` 
                      : imagePath || '/images/Hero.jpg'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>

              <motion.div 
                className="p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-medium text-sm truncate" style={{ color: "var(--text)" }}>{item.title}</h3>
                <p className="text-base font-semibold mt-1" style={{ color: "var(--highlight)", fontFamily: "'JetBrains Mono', monospace" }}>
                  ₦{item.price.toLocaleString()}
                </p>

                {/* Designer Name */}
                {designerId ? (
                  <Link href={`/designers/${designerId}`} className="block mt-1" onClick={e => e.stopPropagation()}>
                    <p className="text-xs font-medium truncate transition" style={{ color: "var(--muted)" }}>
                      {designerName}
                    </p>
                  </Link>
                ) : (
                  <p className="text-xs font-medium mt-1 truncate" style={{ color: "var(--muted)" }}>
                    {designerName}
                  </p>
                )}

                {/* Opens designer profile */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (designerId) router.push(`/designers/${designerId}`);
                  }}
                  className="w-full text-xs py-2 font-semibold transition mt-2"
                  style={{ background: "var(--highlight)", color: "#0E2A22", borderRadius: "3px" }}
                >
                  View Designer
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
}