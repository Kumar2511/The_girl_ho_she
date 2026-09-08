import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-[#EFE8DE] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl text-[#4A3428] mb-4">About THE GIRL HOUSE</h1>
          <p className="text-lg text-[#7A685D]">
            Crafting timeless moments through premium artificial jewelry designed with elegance and affordability in mind
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-serif text-4xl text-[#4A3428] mb-6">Our Story</h2>
              <p className="text-[#7A685D] mb-4 leading-relaxed">
                THE GIRL HOUSE was born from a simple belief: every person deserves to wear jewelry that makes them feel confident and beautiful, without compromising on quality or breaking the bank.
              </p>
              <p className="text-[#7A685D] mb-4 leading-relaxed">
                What started as a passion project has grown into a premium artificial jewelry brand trusted by thousands of customers worldwide. We meticulously select each piece to ensure it reflects our commitment to elegance, craftsmanship, and accessibility.
              </p>
              <p className="text-[#7A685D] leading-relaxed">
                Today, THE GIRL HOUSE stands as a beacon of affordable luxury, proving that premium aesthetics and accessible prices can coexist beautifully.
              </p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg h-80 flex items-center justify-center border border-[#EFE8DE]">
              <div className="text-center text-[#C98C78]">
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
          <h2 className="font-serif text-4xl text-center text-[#2E2E2E] mb-12">Why Choose the Girl House</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
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
<section className="border-y border-[#EFE8DE] bg-[#FAF7F2] px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-3xl text-center">

    <h2
      className="font-serif text-4xl font-normal text-[#4A3428] mb-4"
      style={{ color: "#4A3428" }}
    >
      Ready to Shine?
    </h2>

    <p
      className="mb-8 text-lg font-normal text-[#7A685D]"
      style={{ color: "#7A685D" }}
    >
      Explore our collection and find the perfect pieces to express your unique style
    </p>

    <a
      href="/shop"
      className="inline-flex items-center justify-center rounded-lg bg-[#C98C78] px-8 py-3 font-medium text-white transition-colors hover:bg-[#B5776B]"
      style={{ color: "#FFFFFF" }}
    >
      Shop Now
    </a>

  </div>
</section>

      <Footer />
    </main>
  );
}
