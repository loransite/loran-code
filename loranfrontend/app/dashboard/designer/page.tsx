// pages/designer/dashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { UploadForm } from '@/components/Designer/uploadform';

const DesignerDashboard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchMine = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designs/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesigns(res.data || []);
    } catch (err) {
      console.error('Failed to load your designs', err);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMine();
  }, [token]);

  const handleUpload = async () => {
    if (!file || !title || !price || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);

    try {
      setUploading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      alert('Design uploaded!');
      fetchMine();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Designs</h1>

      {loading ? (
        <p>Loading your designs...</p>
      ) : designs.length === 0 ? (
        <p>No designs yet. Upload one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {designs.map((d: any) => (
            <div key={d._id || d.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-64 w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${d.imageUrl}`}
                  alt={d.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{d.title}</h3>
                <p className="text-gray-600">${d.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Upload New Design</h2>
        {uploading && <p className="text-blue-600 mb-4">Uploading...</p>}

        <UploadForm
          file={file}
          title={title}
          price={price}
          description={description}
          category={category}
          setFile={setFile}
          setTitle={setTitle}
          setPrice={setPrice}
          setDescription={setDescription}
          setCategory={setCategory}
          setUploading={setUploading}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
};

export default DesignerDashboard;