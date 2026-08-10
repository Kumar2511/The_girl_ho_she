'use client';

interface TrustBadgeProps {
  icon: string;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
}

export function TrustBadge({ icon, title, description, variant = 'light' }: TrustBadgeProps) {
  return (
    <div
      className={`flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all duration-300 hover:shadow-xl ${
        variant === 'light'
          ? 'bg-white border-2 border-[#E8E3DC] hover:border-[#C78B7B] hover:bg-[#FFF9F7]'
          : 'bg-[#F9F7F4] border-2 border-[#E8E3DC] hover:border-[#C78B7B]'
      }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-sm font-bold text-[#2E2E2E] mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-xs text-[#6B6B6B] leading-relaxed">{description}</p>
    </div>
  );
}
