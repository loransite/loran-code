'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CatalogueItem } from "@/app/types";
import { catalogueAPI } from '@/lib/api';

export default function CataloguePage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    catalogueAPI.getAll()
      .then(res => setItems(res.data))
      .catch((err) => {
        console.error('Failed to load catalogue:', err);
        setError('Failed to load catalogue. Please ensure the backend is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter by category if items have it, otherwise show all
  const filtered = items.filter(item => 
    filter === 'all' || (item.category ? item.category === filter : true)
  );

  // Featured items to surface in the catalogue
  const featured = [
    {
      _id: 'feat-senator',
      title: 'Senator',
      price: 120000,
      imageUrl: '/images/Hero.jpg',
      designer: { id: 'system', name: 'Loran' },
      featured: true,
    },
    {
      _id: 'feat-ankara-men',
      title: 'Ankara Men',
      price: 85000,
      imageUrl: '/images/designer-1.jpg',
      designer: { id: 'system', name: 'Loran' },
      featured: true,
    },
  ];

  const displayItems = [...featured, ...filtered];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold text-center mb-8"
      >
        Design Catalogue
      </motion.h1>

      {/* Filters */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {['all', 'dress', 'shirt', 'suit', 'senator', 'ankara men'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              filter === cat ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white' : 'bg-white text-gray-700 shadow hover:shadow-md'
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
              className="relative rounded-lg overflow-hidde              # Add your GitHub remote (replace with your repo URL)
              git remote add origin https://github.com/YOUR_USERNAME/loran.git
              
              # Verify the remote is set
              git remote -v
              
              # Push to GitHub
              git branch -M main
              git push -u origin mainn shadow-md hover:shadow-xl transition-shadow bg-white group"
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
              >
                <Image
                  src={item.imageUrl?.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}` : item.imageUrl}
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

                {/* View Details Button */}
                {designerId ? (
                  <Link href={`/designers/${designerId}`} className="block mt-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs py-1.5 rounded-md font-semibold hover:opacity-90 transition"
                    >
                      View
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs py-1.5 rounded-md font-semibold hover:opacity-90 transition mt-2"
                  >
                    View
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}