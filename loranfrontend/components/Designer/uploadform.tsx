'use client';

import React, { Dispatch, SetStateAction } from 'react';
import axios from 'axios';

interface UploadFormProps {
  file: File | null;
  title: string;
  price: string;
  description: string;
  category: string;
  setFile: Dispatch<SetStateAction<File | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setPrice: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  setUploading: Dispatch<SetStateAction<boolean>>;
  onUpload: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  file,
  title,
  price,
  description,
  category,
  setFile,
  setTitle,
  setPrice,
  setDescription,
  setCategory,
  setUploading,
  onUpload,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !price || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload');
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designs`, // Correct URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onUpload();
      setFile(null);
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        <option value="dress">Dress</option>
        <option value="shirt">Shirt</option>
        <option value="suit">Suit</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload Design
      </button>
    </form>
  );
};