import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-[#09090D] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-tr from-[#17171F] via-[#20202A] to-[#17171F] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1 Experience</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Step into the next chapter of music.
          </h2>

          <p className="text-base md:text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience uncompressed sound, authentic independent artists, and curated aesthetic journeys created for music purists.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Launch SONORA Player</span>
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
