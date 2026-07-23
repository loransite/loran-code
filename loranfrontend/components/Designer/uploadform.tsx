'use client';

import React, { Dispatch, SetStateAction } from 'react';

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
  categories?: string[];
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
  categories = [],
}) => {
  const defaultCategories = ['dress', 'shirt', 'suit', 'general'];
  const availableCategories = Array.from(new Set([...defaultCategories, ...categories]));
  // This form only validates and delegates to the parent's onUpload, which
  // already performs the POST request, success alert, list refresh, and
  // field reset. Previously this handler ALSO sent its own POST request
  // before calling onUpload(), so every submission created two identical
  // catalogue entries — the reported "product shows twice" bug.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !price || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    onUpload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload Design
      </button>
    </form>
  );
};