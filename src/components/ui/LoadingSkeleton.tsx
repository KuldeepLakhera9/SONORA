import React from "react";

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-2xl bg-[#17171F]/40 border border-white/5 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-white/5" />
      <div className="h-4 w-3/4 rounded-md bg-white/5" />
      <div className="h-3 w-1/2 rounded-md bg-white/5" />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-72 rounded-3xl bg-[#17171F]/50 border border-white/5 animate-pulse p-8 flex flex-col justify-end gap-3">
      <div className="h-5 w-32 rounded-full bg-white/5" />
      <div className="h-10 w-96 max-w-full rounded-xl bg-white/5" />
      <div className="h-4 w-64 max-w-full rounded-md bg-white/5" />
      <div className="h-10 w-28 rounded-full bg-white/5 mt-2" />
    </div>
  );
}

export function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-white/[0.02] animate-pulse">
      <div className="w-4 h-4 rounded bg-white/5" />
      <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 rounded bg-white/5" />
        <div className="h-3 w-32 rounded bg-white/5" />
      </div>
      <div className="h-4 w-12 rounded bg-white/5" />
    </div>
  );
}
