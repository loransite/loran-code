import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

const hasCloudinaryConfig = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME
  && process.env.CLOUDINARY_API_KEY
  && process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Persists an uploaded image and returns the URL stored in MongoDB.
 * Cloudinary is required in production because Render's local filesystem is
 * temporary. Local development keeps using the supplied local URL.
 */
export const storeUploadedImage = async (file, { folder, localUrl }) => {
  if (!file) return null;

  if (!hasCloudinaryConfig()) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Image uploaded to temporary local storage. Configure Cloudinary for persistent production images.');
    }
    return localUrl;
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: `loran/${folder}`,
    resource_type: 'image',
  });

  // The local upload is only a short-lived staging file once Cloudinary owns it.
  await fs.unlink(file.path).catch(() => undefined);
  return result.secure_url;
};
