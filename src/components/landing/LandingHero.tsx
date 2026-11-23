"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, ShieldCheck, Headphones, ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[500px] bg-gradient-to-tr from-purple-700/20 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent Music Discovery & High-Fidelity Audio</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#F5F5F7] max-w-5xl leading-[1.08] mb-6">
          Discover music. <br />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
            Discover yourself.
          </span>
        </h1>

        {/* Supporting description */}
        <p className="text-base sm:text-lg md:text-xl text-[#A1A1AA] max-w-2xl leading-relaxed mb-10 font-normal">
          SONORA unites the intuitive discovery of Spotify with the visual elegance of Apple Music. Crafted exclusively for independent creators and discerning listeners.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/home"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-bold text-sm md:text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Explore SONORA Now</span>
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-[#F5F5F7] font-semibold text-sm md:text-base border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <span>Browse Genres & Moods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* High-Impact Visual Music Composition Card */}
        <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-b from-[#17171F] to-[#09090D] p-3 md:p-6">
          <div
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-inner"
            style={{ position: "relative" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1800&q=80"
              alt="SONORA Studio Experience"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-[#09090D]/40 to-transparent" />

            {/* Overlaid Floating Mini Cards */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-xl max-w-sm">
                <div
                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
                  style={{ position: "relative" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80"
                    alt="Album Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white">
                    Glacial Resonance
                  </span>
                  <span className="text-[11px] text-[#A1A1AA]">
                    Aura Vance • Dream Pop
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-purple-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span>Now Streaming in 24-bit FLAC</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#F5F5F7]">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-purple-400" />
                  <span>Lossless Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Independent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
