"use client";

import React, { useState } from "react";
import { Bell, Check, Sparkles, Disc, Radio } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "release" | "editorial" | "artist";
  href: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Album from Aura Vance",
    message: "Glacial Resonance is now available in lossless audio.",
    time: "2h ago",
    unread: true,
    type: "release",
    href: "/album/album-1",
  },
  {
    id: "notif-2",
    title: "Editorial Update",
    message: "Midnight Focus & Code added 4 new modular ambient tracks.",
    time: "5h ago",
    unread: true,
    type: "editorial",
    href: "/playlist/playlist-1",
  },
  {
    id: "notif-3",
    title: "Artist You Follow",
    message: "Komorebi Duo announced new acoustic sessions in Kyoto.",
    time: "1d ago",
    unread: false,
    type: "artist",
    href: "/artist/artist-3",
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={cn(
          "relative w-9 h-9 rounded-full flex items-center justify-center transition-colors",
          isOpen
            ? "bg-white/15 text-white"
            : "bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10"
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-11 z-50 w-80 md:w-96 rounded-2xl bg-[#17171F] border border-white/10 shadow-2xl overflow-hidden p-2 text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <span className="font-semibold text-sm text-[#F5F5F7]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 py-1 max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl transition-colors",
                    item.unread
                      ? "bg-purple-950/20 hover:bg-purple-950/30"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                    {item.type === "release" ? (
                      <Disc className="w-4 h-4" />
                    ) : item.type === "editorial" ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Radio className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-[#F5F5F7] truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#A1A1AA] mt-0.5 leading-snug">
                      {item.message}
                    </span>
                    <span className="text-[10px] text-[#71717A] mt-1 font-mono">
                      {item.time}
                    </span>
                  </div>
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
