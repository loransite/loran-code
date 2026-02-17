"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Share2, 
  Copy, 
  Download, 
  Instagram, 
  Facebook, 
  Twitter,
  Mail,
  MessageCircle,
  CheckCircle,
  User,
  MapPin,
  Award,
  Palette,
  Star
} from "lucide-react";

type Designer = {
  _id: string;
  fullName: string;
  email: string;
  brandName?: string;
  bio?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  yearsExperience?: number;
  expertiseLevel?: string;
  rating?: number;
  portfolioCount?: number;
};

export default function DesignerProfileShare() {
  const router = useRouter();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "designer") {
        alert("Designer access only");
        router.push("/");
        return;
      }

      // Fetch designer profile
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/designers/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setDesigner(data.designer || data);
          setLoading(false);
        })
        .catch(() => {
          setDesigner(user);
          setLoading(false);
        });
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/designers/${designer?._id}` 
    : "";

  const generateProfileText = () => {
    if (!designer) return "";
    
    return `👗 ${designer.brandName || designer.fullName}

${designer.bio || "Professional Fashion Designer"}

✨ Experience: ${designer.yearsExperience || 0} years
📍 Location: ${[designer.city, designer.state, designer.country].filter(Boolean).join(", ") || "Available Nationwide"}
⭐ Rating: ${designer.rating || 5}/5
${designer.expertiseLevel ? `🎯 Level: ${designer.expertiseLevel.charAt(0).toUpperCase() + designer.expertiseLevel.slice(1)}` : ""}

🌐 View my designs: ${profileUrl}

#fashion #designer #style #custommade #fashiondesigner`;
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyProfileText = () => {
    navigator.clipboard.writeText(generateProfileText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(generateProfileText());
    const url = encodeURIComponent(profileUrl);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}`,
      email: `mailto:?subject=Check out my design portfolio&body=${text}`,
    };

    window.open(urls[platform], "_blank");
  };

  const downloadProfileCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    
    if (!ctx || !designer) return;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#8B5CF6");
    gradient.addColorStop(0.5, "#EC4899");
    gradient.addColorStop(1, "#F59E0B");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // White card
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.roundRect(80, 200, 920, 680, 30);
    ctx.fill();

    // Text styling
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(designer.brandName || designer.fullName, 540, 320);

    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#6B7280";
    const bioLines = (designer.bio || "Professional Fashion Designer").match(/.{1,30}/g) || [];
    bioLines.forEach((line, i) => {
      ctx.fillText(line, 540, 400 + i * 40);
    });

    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#4B5563";
    ctx.fillText(`✨ ${designer.yearsExperience || 0} years experience`, 540, 550);
    ctx.fillText(`📍 ${designer.city || "Available Nationwide"}`, 540, 600);
    ctx.fillText(`⭐ ${designer.rating || 5}/5 rating`, 540, 650);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#8B5CF6";
    ctx.fillText(profileUrl, 540, 750);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${designer.brandName || designer.fullName}-profile.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Share Your Profile
          </h1>
          <p className="text-gray-600">Copy and share your designer profile on social media</p>
        </motion.div>

        {/* Profile Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {designer.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {designer.brandName || designer.fullName}
              </h2>
              <p className="text-gray-600 mb-3">{designer.bio || "Professional Fashion Designer"}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {designer.yearsExperience && (
                  <span className="flex items-center gap-1 text-purple-600">
                    <Award className="w-4 h-4" />
                    {designer.yearsExperience} years
                  </span>
                )}
                {(designer.city || designer.country) && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {[designer.city, designer.state, designer.country].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1 text-yellow-600">
                  <Star className="w-4 h-4 fill-current" />
                  {designer.rating || 5}/5
                </span>
              </div>
            </div>
          </div>

          {/* Profile Text Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {generateProfileText()}
            </pre>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={copyProfileLink}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={copyProfileText}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Copy className="w-5 h-5" />
              Copy Text
            </button>
          </div>

          {/* Download Card */}
          <button
            onClick={downloadProfileCard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all mb-6"
          >
            <Download className="w-5 h-5" />
            Download Profile Card
          </button>

          {/* Social Share Buttons */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share directly to social media
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => shareToSocial("whatsapp")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => shareToSocial("facebook")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => shareToSocial("twitter")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => shareToSocial("email")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-3">📱 Sharing Tips</h3>
          <ul className="space-y-2 text-sm">
            <li>• Use "Download Profile Card" to create a beautiful image for Instagram/Facebook</li>
            <li>• "Copy Text" works great for Instagram captions and bio</li>
            <li>• "Copy Link" to share your profile URL directly</li>
            <li>• Share regularly to grow your client base!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
