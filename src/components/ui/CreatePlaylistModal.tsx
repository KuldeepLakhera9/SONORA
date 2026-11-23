"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useRouter } from "next/navigation";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
}: CreatePlaylistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlaylist = createPlaylist(title, description);
    onClose();
    setTitle("");
    setDescription("");
    router.push(`/playlist/${newPlaylist.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-[#17171F] border border-white/10 p-6 shadow-2xl text-[#F5F5F7] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Create New Playlist</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Midnight Ambient Sanctuary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#20202A] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Give your playlist a story or mood description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#20202A] border border-white/10 text-sm text-[#F5F5F7] placeholder-[#71717A] focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
