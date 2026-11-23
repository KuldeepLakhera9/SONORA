"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { mockArtists } from "@/data/mock-artists";
import { formatNumber } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function FeaturedArtistsSection() {
  const featured = mockArtists.slice(0, 4);

  return (
    <section id="artists" className="py-20 md:py-28 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-2 block">
              Direct from Studios Worldwide
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7]">
              Featured Independent Artists
            </h2>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 text-sm font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 group"
          >
            <span>Meet All 120+ Independent Creators</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#17171F] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/20"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111116]">
                <Image
                  src={artist.avatarUrl}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17171F] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-white/10">
                  {artist.location}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] line-clamp-2 mt-1.5 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#71717A]">
                    {formatNumber(artist.monthlyListeners)} listeners
                  </span>
                  <span className="text-purple-400 font-semibold group-hover:underline">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
