import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeaturedArtistsSection } from "@/components/landing/FeaturedArtistsSection";
import { DiscoverDifferentlySection } from "@/components/landing/DiscoverDifferentlySection";
import { MoodDiscoverySection } from "@/components/landing/MoodDiscoverySection";
import { MusicDnaSection } from "@/components/landing/MusicDnaSection";
import { ArtistEcosystemSection } from "@/components/landing/ArtistEcosystemSection";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090D] text-[#F5F5F7] flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <FeaturedArtistsSection />
        <DiscoverDifferentlySection />
        <MoodDiscoverySection />
        <MusicDnaSection />
        <ArtistEcosystemSection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
