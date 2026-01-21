'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CatalogueItem } from "@/app/types";
import { catalogueAPI } from '@/lib/api';
import ItemModal from '@/components/Catalogue/itemModal';


export default function CataloguePage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  
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

  const featured = [
    {
      _id: 'feat-senator',
      title: 'Senator',
      price: 120000,
      imageUrl: '/images/Hero.jpg',
      designer: { id: 'system', name: 'Loran' },
      featured: true,
      category: 'senator',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'feat-ankara-men',
      title: 'Ankara Men',
      price: 85000,
      imageUrl: '/images/designer-1.jpg',
      designer: { id: 'system', name: 'Loran' },
      featured: true,
      category: 'ankara-men',
      createdAt: new Date().toISOString(),
    },
  ];

  const displayItems = [...featured, ...filteredItems];

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></div>;

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Catalogue</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-900 via-pink-700 to-orange-600 bg-clip-text text-transparent"
        >
          Design Catalogue
        </motion.h1>
        <p className="text-center text-gray-800 font-semibold mb-8 text-lg">
          {displayItems.length} design{displayItems.length !== 1 ? 's' : ''} available
        </p>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search designs by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
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
              className="bg-white mt-3 p-6 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-sm font-semibold mb-2">Min Price (₦)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Max Price (₦)</label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Pills (Quick Filters) */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {['all', 'dress', 'shirt', 'suit', 'senator', 'ankara-men'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              categoryFilter === cat ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white' : 'bg-white text-gray-700 shadow hover:shadow-md'
            }`}
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
        {displayItems.map((item, i) => {
          const designerName = (typeof item.designer === 'object' && item.designer?.name) 
            ? item.designer.name 
            : (typeof item.designer === 'string' ? item.designer : 'Unknown');
          const designerId = (typeof item.designer === 'object' && item.designer?.id) 
            ? item.designer.id 
            : null;

          return (
            <motion.div
              key={item._id}
              variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0 } }}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white group"
            >
              {item.featured && (
                <motion.div 
                  className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Featured
                </motion.div>
              )}

              <motion.div 
                className="relative h-48 bg-gradient-to-br from-gray-100 to-white overflow-hidden"
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src={item.imageUrl?.startsWith('/images/') 
                    ? item.imageUrl 
                    : item.imageUrl?.startsWith('/') 
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}` 
                      : item.imageUrl || '/images/Hero.jpg'}
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
                <h3 className="font-semibold text-sm truncate text-gray-800">{item.title}</h3>
                <p className="text-lg font-bold text-pink-600 mt-1">${item.price}</p>

                {/* Designer Name */}
                {designerId ? (
                  <Link href={`/designers/${designerId}`} className="block mt-1">
                    <p className="text-xs text-indigo-600 hover:underline font-medium truncate">
                      {designerName}
                    </p>
                  </Link>
                ) : (
                  <p className="text-xs text-indigo-600 font-medium mt-1 truncate">
                    {designerName}
                  </p>
                )}

                {/* View Details Button (opens modal with Buy Now) */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs py-1.5 rounded-md font-semibold hover:opacity-90 transition mt-2"
                >
                  View
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            key={selectedItem._id}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}