import React from "react";
import Link from "next/link";
import { Music, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Music,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-[#17171F]/40 border border-white/5",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-[#F5F5F7] mb-1.5">{title}</h3>
      <p className="text-xs md:text-sm text-[#A1A1AA] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="px-5 py-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/25"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/25"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
