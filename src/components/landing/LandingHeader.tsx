"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Music2, ArrowRight, Menu, X, Disc3 } from "lucide-react";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider text-white font-mono">
            SONORA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
          <Link href="/home" className="hover:text-white transition-colors">
            Discover
          </Link>
          <Link href="/explore" className="hover:text-white transition-colors">
            Explore
          </Link>
          <a href="#artists" className="hover:text-white transition-colors">
            Artists
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            DNA Radar
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            Ecosystem
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/home"
            className="text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Open Player</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#09090D]/95 border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
          <Link
            href="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-white flex items-center justify-between"
          >
            <span>Discover Music</span>
            <Disc3 className="w-5 h-5 text-purple-400" />
          </Link>
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-[#A1A1AA]"
          >
            Explore Genres & Moods
          </Link>
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-[#A1A1AA]"
          >
            Search Catalog
          </Link>
          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-[#A1A1AA]"
          >
            Your Library
          </Link>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-purple-600 text-white font-semibold text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
