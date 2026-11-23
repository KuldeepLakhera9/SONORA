import React from "react";
import { Activity, Sparkles } from "lucide-react";

export function MusicDnaSection() {
  const metrics = [
    { label: "Harmonic Warmth", value: "94%", desc: "Tape saturation & analog warmth" },
    { label: "Dynamic Range", value: "14.2 LUFS", desc: "Uncompressed master dynamics" },
    { label: "Spatial Reverb Width", value: "88%", desc: "Binaural & 3D soundstage" },
    { label: "Acoustic Purity", value: "96%", desc: "Physical instruments & field audio" },
  ];

  return (
    <section id="experience" className="py-20 md:py-28 bg-[#111116]/80 border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Explanation */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Feature</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-6 leading-tight">
              The SONORA Music DNA™ Experience
            </h2>

            <p className="text-base text-[#A1A1AA] leading-relaxed mb-8">
              Every composition in our catalog is analyzed through an acoustic fingerprint matrix. Instead of generic genre tags, SONORA maps the physical textures of audio: tape delay saturation, tempo drift, modal chord tonality, and atmospheric density.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#17171F] border border-white/5">
                  <span className="text-2xl font-black text-purple-400 font-mono">
                    {m.value}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{m.label}</h4>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual DNA Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#17171F] to-[#20202A] border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Track Acoustic Profile</h4>
                  <span className="text-xs text-[#A1A1AA]">
                    Analyzing: Aura Vance — Ethereal Fjord
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
                Hi-Res 96kHz / 24-bit
              </span>
            </div>

            {/* Radar Simulated Frequency Graph */}
            <div className="py-8 flex flex-col gap-4">
              {[
                { name: "Sub-Bass Resonance (20-60 Hz)", level: 75, color: "bg-indigo-500" },
                { name: "Analog Midrange Saturation", level: 92, color: "bg-purple-500" },
                { name: "Ethereal Air & High Shimmer", level: 88, color: "bg-sky-400" },
                { name: "Nordic Ambient Dispersion", level: 95, color: "bg-fuchsia-400" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#A1A1AA]">{item.name}</span>
                    <span className="text-white font-mono">{item.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Key: D-Minor • 96 BPM • Ethereal</span>
              <span className="text-purple-300 font-semibold">Matched with 14 similar tracks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
