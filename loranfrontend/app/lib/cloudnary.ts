// lib/cloudinary.ts
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "loran_designs"); // ← Create this in Cloudinary

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");

  return data.secure_url; // ← Public URL
};