import React from "react";
import { ShieldCheck, Award, TrendingUp } from "lucide-react";

export function ArtistEcosystemSection() {
  return (
    <section id="about" className="py-20 md:py-28 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-2 block">
            Fair & Sustainable
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-4">
            The Independent Artist Ecosystem
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
            Major platforms take up to 70% of royalties for middle-men. SONORA reimagines music streaming as a direct pact between musicians and their truest patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Rights Retention</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Artists on SONORA keep their masters, copyright, and publishing rights in perpetuity. No predatory 360 deals or lock-ins.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-purple-400 font-semibold">
              Zero exclusivity restrictions
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direct-to-Fan Community</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Fans follow artists directly, receiving notifications for exclusive master sessions, limited vinyl pressings, and intimate tour dates.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-indigo-400 font-semibold">
              Real community connection
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#17171F] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lossless Studio Fidelity</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Hear music exactly as mixed on studio nearfield monitors. Every release supports pristine 24-bit studio master audio streaming.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-pink-400 font-semibold">
              Bit-perfect FLAC audio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
