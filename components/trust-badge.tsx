'use client';

import { Gem, ShieldCheck, Truck, HeartHandshake, Award, CheckCircle2, LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  gem: Gem,
  shield: ShieldCheck,
  truck: Truck,
  heart: HeartHandshake,
  trophy: Award,
  check: CheckCircle2,
};

interface TrustBadgeProps {
  icon: string;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
}

export function TrustBadge({ icon, title, description, variant = 'light' }: TrustBadgeProps) {
  const IconComponent = ICON_MAP[icon.toLowerCase()] || Gem;

  return (
    <div
      className={`flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all duration-300 hover:shadow-xl ${
        variant === 'light'
          ? 'bg-white border border-[#EFE8DE] hover:border-[#C98C78] hover:bg-[#FAF7F2]'
          : 'bg-[#FAF7F2] border border-[#EFE8DE] hover:border-[#C98C78]'
      }`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF7F2] text-[#C98C78] shadow-xs border border-[#EFE8DE]">
        <IconComponent className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-sm font-bold text-[#4A3428] mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-[#4A3428]/70 leading-relaxed">{description}</p>
    </div>
  );
}
