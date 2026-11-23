import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Genre } from "@/types/music";
import { cn } from "@/lib/utils";

interface GenreCardProps {
  genre: Genre;
  className?: string;
}

export function GenreCard({ genre, className }: GenreCardProps) {
  return (
    <Link
      href={`/search?genre=${encodeURIComponent(genre.name)}`}
      className={cn(
        "group relative h-36 md:h-44 rounded-2xl overflow-hidden p-4 md:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-950/30 border border-white/5",
        "bg-gradient-to-br",
        genre.gradient,
        className
      )}
    >
      {/* Title */}
      <div className="z-10 relative">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white drop-shadow-md">
          {genre.name}
        </h3>
        <p className="text-[11px] md:text-xs text-white/70 line-clamp-2 mt-1 max-w-[70%]">
          {genre.description}
        </p>
      </div>

      {/* Angled artwork thumbnail */}
      <div className="absolute -bottom-2 -right-3 w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-2xl rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
        <Image
          src={genre.coverUrl}
          alt={genre.name}
          fill
          sizes="110px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </Link>
  );
}
