"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  displayName: string;
  onAvatarUpdated?: (newUrl: string) => void;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  displayName,
  onAvatarUpdated,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentAvatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please select a valid image file (JPEG, PNG, WebP, or AVIF).",
      });
      return;
    }

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must not exceed 10 MB.",
      });
      return;
    }

    // Create local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    if (!isSupabaseConfigured()) {
      setMessage({
        type: "success",
        text: "Avatar preview updated (Supabase Storage unconfigured in local preview).",
      });
      onAvatarUpdated?.(previewUrl);
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      // Upload to artwork bucket
      const { error: uploadError } = await supabase.storage
        .from("artwork")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("artwork").getPublicUrl(filePath);

      // Update profiles record
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_path: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "Avatar updated successfully!" });
      onAvatarUpdated?.(publicUrl);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to upload avatar.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Avatar Container with explicit position: relative */}
      <div className="relative group shrink-0" style={{ position: "relative" }}>
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-purple-500/40 shadow-xl bg-[#17171F]"
          style={{ position: "relative" }}
        >
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 112px"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Change Avatar Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          aria-label="Upload profile photo"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Info / feedback */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h4 className="text-sm font-semibold text-white">Profile Photo</h4>
        <p className="text-xs text-[#71717A] max-w-xs">
          JPEG, PNG, WebP, or AVIF. Maximum size of 10MB.
        </p>

        {message && (
          <div
            className={`text-xs flex items-center gap-1.5 pt-1 ${
              message.type === "error" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
