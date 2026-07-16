import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

const getCloudinaryConfig = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  apiKey: process.env.CLOUDINARY_API_KEY?.trim(),
  apiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
  url: process.env.CLOUDINARY_URL?.trim(),
});

const getMissingCloudinaryVariables = () => {
  const { cloudName, apiKey, apiSecret, url } = getCloudinaryConfig();
  if (url) return [];

  return [
    !cloudName && 'CLOUDINARY_CLOUD_NAME',
    !apiKey && 'CLOUDINARY_API_KEY',
    !apiSecret && 'CLOUDINARY_API_SECRET',
  ].filter(Boolean);
};

const configureCloudinary = () => {
  const { cloudName, apiKey, apiSecret, url } = getCloudinaryConfig();
  if (url) {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'cloudinary:' || !parsedUrl.hostname || !parsedUrl.username || !parsedUrl.password) {
      throw new Error('CLOUDINARY_URL must use the format cloudinary://API_KEY:API_SECRET@CLOUD_NAME.');
    }

    cloudinary.config({
      cloud_name: parsedUrl.hostname,
      api_key: decodeURIComponent(parsedUrl.username),
      api_secret: decodeURIComponent(parsedUrl.password),
      secure: true,
    });
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
};

/**
 * Persists an uploaded image and returns the URL stored in MongoDB.
 * Cloudinary is required in production because Render's local filesystem is
 * temporary. Local development keeps using the supplied local URL.
 */
export const storeUploadedImage = async (file, { folder, localUrl }) => {
  if (!file) return null;

  const missingVariables = getMissingCloudinaryVariables();
  if (missingVariables.length > 0) {
    const hasAnyCloudinaryVariable = Object.values(getCloudinaryConfig()).some(Boolean);
    if (hasAnyCloudinaryVariable) {
      throw new Error(`Image storage is missing: ${missingVariables.join(', ')}. Add the missing value in the Render backend environment.`);
    }

    if (process.env.NODE_ENV === 'production') {
      console.warn('Image uploaded to temporary local storage. Configure Cloudinary for persistent production images.');
    }
    return localUrl;
  }

  try {
    // ESM imports run before dotenv is loaded in server.js, so configure here
    // after the environment is guaranteed to be available.
    configureCloudinary();
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `loran/${folder}`,
      resource_type: 'image',
    });

    // The local upload is only a short-lived staging file once Cloudinary owns it.
    await fs.unlink(file.path).catch(() => undefined);
    return result.secure_url;
  } catch (error) {
    await fs.unlink(file.path).catch(() => undefined);
    // Cloudinary's own rejection reason (e.g. "Invalid API key", "Invalid
    // Signature") is safe to surface — it never includes the secret itself —
    // and is the fastest way to pinpoint a credential mistake.
    const reason = error?.error?.message || error?.message || 'Unknown error';
    console.error('Cloudinary image upload failed:', reason);
    throw new Error(`Image upload failed: ${reason}`);
  }
};
