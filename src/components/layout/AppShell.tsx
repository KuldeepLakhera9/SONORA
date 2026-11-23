"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomPlayer } from "./BottomPlayer";
import { QueueDrawer } from "./QueueDrawer";
import { MobileNav } from "./MobileNav";
import { PlaybackTimer } from "@/components/player/PlaybackTimer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090D] text-[#F5F5F7]">
      {/* Background Playback Timer */}
      <PlaybackTimer />

      {/* Persistent Left Sidebar (Desktop/Tablet) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Sticky Topbar */}
        <Topbar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto pb-28 md:pb-32 px-4 md:px-8 pt-4 md:pt-6">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Slide-over Queue Drawer */}
      <QueueDrawer />

      {/* Persistent Bottom Player (Desktop/Tablet) */}
      <div className="hidden md:block">
        <BottomPlayer />
      </div>

      {/* Mobile Bottom Navigation & Compact Mini Player */}
      <MobileNav />
    </div>
  );
}
