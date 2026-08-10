'use client';

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
  verified?: boolean;
}

export function TestimonialCard({
  name,
  role,
  image,
  text,
  rating,
  verified = true,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-[#E8E3DC] hover:border-[#C78B7B] hover:shadow-2xl transition-all duration-300 group">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-[#D6B36A] text-lg' : 'text-[#E8E3DC] text-lg'}>
            ★
          </span>
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-[#2E2E2E] text-sm leading-relaxed mb-6 italic">"{text}"</p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-[#E8E3DC]">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#C78B7B]"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[#2E2E2E] text-sm">{name}</h4>
            {verified && (
              <svg
                className="w-4 h-4 text-[#C78B7B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="text-xs text-[#6B6B6B]">{role}</p>
        </div>
      </div>
    </div>
  );
}
