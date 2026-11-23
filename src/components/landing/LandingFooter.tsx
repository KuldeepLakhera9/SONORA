import React from "react";
import Link from "next/link";
import { Music2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090D] pt-16 pb-12 text-[#A1A1AA] text-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white font-mono">
                SONORA
              </span>
            </Link>
            <p className="text-xs text-[#71717A] max-w-sm leading-relaxed">
              &quot;Discover music. Discover yourself.&quot;
              <br />
              The premium independent music discovery and streaming web application.
            </p>
            <div className="text-[11px] text-[#71717A]">
              Designed with precision for independent creators and sound enthusiasts.
            </div>
          </div>

          {/* Nav 1 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Explore
            </span>
            <Link href="/home" className="hover:text-white transition-colors">
              Discover
            </Link>
            <Link href="/explore" className="hover:text-white transition-colors">
              Genres & Moods
            </Link>
            <Link href="/search" className="hover:text-white transition-colors">
              Search Catalog
            </Link>
            <Link href="/library" className="hover:text-white transition-colors">
              Your Library
            </Link>
          </div>

          {/* Nav 2 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Independent
            </span>
            <Link href="/artist/artist-1" className="hover:text-white transition-colors">
              Aura Vance
            </Link>
            <Link href="/artist/artist-2" className="hover:text-white transition-colors">
              Solaris Echo
            </Link>
            <Link href="/artist/artist-3" className="hover:text-white transition-colors">
              Komorebi Duo
            </Link>
            <Link href="/artist/artist-4" className="hover:text-white transition-colors">
              Velvet Bloom
            </Link>
          </div>

          {/* Nav 3 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Company
            </span>
            <span className="text-[#71717A]">Phase 1 Foundation</span>
            <span className="text-[#71717A]">Sound Engine Architecture</span>
            <span className="text-[#71717A]">Independent Manifesto</span>
            <span className="text-[#71717A]">Privacy & Ethics</span>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#71717A]">
          <div>
            © {new Date().getFullYear()} SONORA Soundworks. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Lossless 24-bit Audio</span>
            <span>Zero Tracking</span>
            <span>Creator-Owned Masters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
