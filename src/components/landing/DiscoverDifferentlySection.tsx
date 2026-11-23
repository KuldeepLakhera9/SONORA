import React from "react";
import { Disc3, Compass, Cpu, HeartHandshake } from "lucide-react";

export function DiscoverDifferentlySection() {
  const pillars = [
    {
      icon: Disc3,
      title: "Zero Major-Label Algorithm Manipulation",
      description:
        "Mainstream streaming apps sell front-page placement to major labels. SONORA’s discovery algorithms evaluate acoustic uniqueness, harmonics, and listener resonance—not corporate ad budgets.",
    },
    {
      icon: Compass,
      title: "Context-Aware Sonic Radar",
      description:
        "Discover music based on your specific atmospheric state—whether you’re writing deep architectural code at 2 AM or watching snowfall through an attic skylight.",
    },
    {
      icon: Cpu,
      title: "Audio DNA & Timbre Matching",
      description:
        "Every track is acoustically indexed by BPM, key modulation, tape saturation, and spatial reverb width to match pieces with identical emotional weight.",
    },
    {
      icon: HeartHandshake,
      title: "Direct Support for Artists",
      description:
        "We believe musicians should earn a sustainable living. Independent creators on SONORA retain full ownership of their masters and publishing.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#111116]/60 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-purple-400 mb-2 block">
            A New Paradigm in Sound
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#F5F5F7] mb-4">
            Discover Music Differently
          </h2>
          <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed">
            Streaming shouldn’t feel like an endless billboard of homogenized pop. SONORA is designed for people who treat music as essential art.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#17171F] border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
