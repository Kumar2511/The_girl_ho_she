import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-[#E8E3DC] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl text-[#2E2E2E] mb-4">About the_girl_ho_se</h1>
          <p className="text-lg text-[#6B6B6B]">
            Crafting timeless moments through premium artificial jewelry designed with elegance and affordability in mind
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-serif text-4xl text-[#2E2E2E] mb-6">Our Story</h2>
              <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                the_girl_ho_se was born from a simple belief: every person deserves to wear jewelry that makes them feel confident and beautiful, without compromising on quality or breaking the bank.
              </p>
              <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                What started as a passion project has grown into a premium artificial jewelry brand trusted by thousands of customers worldwide. We meticulously select each piece to ensure it reflects our commitment to elegance, craftsmanship, and accessibility.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed">
                Today, the_girl_ho_se stands as a beacon of affordable luxury, proving that premium aesthetics and accessible prices can coexist beautifully.
              </p>
            </div>
            <div className="bg-[#F4EEE8] rounded-lg h-80 flex items-center justify-center">
              <div className="text-center text-[#C0B9AE]">
                <p className="text-6xl mb-4">✨</p>
                <p>Our Journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-[#2E2E2E] mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We never compromise on quality. Each piece is crafted to perfection using premium materials and attention to detail.',
              },
              {
                title: 'Inclusive Beauty',
                description: 'We believe beauty should be accessible to everyone. Our prices reflect our commitment to affordability without sacrificing elegance.',
              },
              {
                title: 'Timeless Design',
                description: 'Trends come and go, but our pieces are designed to be timeless. Invest in jewelry that will be cherished for years to come.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="font-serif text-2xl text-[#C78B7B] mb-3">{value.title}</h3>
                <p className="text-[#6B6B6B]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-[#2E2E2E] mb-12">Why Choose the_girl_ho_se</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Handpicked premium artificial jewelry collections',
              'Fast and free shipping on orders over $50',
              'Secure and encrypted checkout process',
              'Lifetime quality guarantee on all pieces',
              'Expert customer support team',
              'Eco-conscious packaging and sustainable practices',
              'Regular new collections and trending pieces',
              'Easy returns and exchanges within 30 days',
            ].map((reason, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#C78B7B] text-white">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[#2E2E2E]">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2E2E2E] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl mb-4">Ready to Shine?</h2>
          <p className="text-lg text-[#C0B9AE] mb-8">
            Explore our collection and find the perfect pieces to express your unique style
          </p>
          <a
            href="/shop"
            className="inline-block px-8 py-3 bg-[#C78B7B] hover:bg-[#D6B36A] transition-colors rounded-lg font-semibold"
          >
            Shop Now
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
