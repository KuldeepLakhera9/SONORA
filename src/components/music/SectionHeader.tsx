import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  className?: string;
  rightElement?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "See all",
  className,
  rightElement,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between mb-4 md:mb-5 pt-2",
        className
      )}
    >
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F5F7]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-[#A1A1AA] mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {rightElement}
        {href && (
          <Link
            href={href}
            className="group inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-[#A1A1AA] hover:text-[#8B5CF6] transition-colors"
          >
            <span>{linkText}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
