"use client";

import React from "react";
import Link from "next/link";
import { mockMoods } from "@/data/mock-genres-moods";
import { ArrowRight } from "lucide-react";

export function MoodDiscoverySection() {
  return (
    <section className="py-20 md:py-28 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-2 block">
              Atmospheric Curation
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
              Mood-Based Discovery
            </h2>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 text-sm font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 group"
          >
            <span>Explore All Moods</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockMoods.map((mood) => (
            <Link
              key={mood.id}
              href={`/explore#${mood.id}`}
              className="group p-5 rounded-2xl bg-[#17171F] border border-white/5 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between hover:scale-[1.02]"
            >
              <div>
                <span className="text-3xl mb-3 block">{mood.emoji}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {mood.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1">
                  {mood.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>{mood.recommendedTrackIds.length} tracks</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  Listen →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
