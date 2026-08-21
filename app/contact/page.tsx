'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-[#E8E3DC] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl text-[#2E2E2E] mb-4">Get in Touch</h1>
          <p className="text-lg text-[#6B6B6B]">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {[
            {
              icon: Mail,
              title: 'Email',
              content: 'thegirlhousecustomercare@gmaail.com',
              subtext: 'We reply within 24 hours',
            },
            {
              icon: Phone,
              title: 'Phone',
              content: '+91 88707 - 34341',
              subtext: 'Mon-Fri, 10AM-6PM EST',
            },
            {
              icon: MapPin,
              title: 'Visit Us',
              content: 'Velankanni, Tamil Nadu',
              subtext: 'India, TN 61111',
            },
          ].map((info) => {
            const Icon = info.icon;
            return (
              <div key={info.title} className="bg-white p-6 rounded-lg border border-[#E8E3DC] text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#F4EEE8] rounded-full">
                    <Icon className="w-6 h-6 text-[#C78B7B]" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#2E2E2E] mb-2">{info.title}</h3>
                <p className="text-[#2E2E2E] font-semibold mb-1">{info.content}</p>
                <p className="text-sm text-[#6B6B6B]">{info.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Form & Hours */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-lg border border-[#E8E3DC]">
            <h2 className="font-serif text-2xl text-[#2E2E2E] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E3DC] rounded-lg focus:outline-none focus:border-[#C78B7B] bg-[#F9F7F4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E3DC] rounded-lg focus:outline-none focus:border-[#C78B7B] bg-[#F9F7F4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E3DC] rounded-lg focus:outline-none focus:border-[#C78B7B] bg-[#F9F7F4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#E8E3DC] rounded-lg focus:outline-none focus:border-[#C78B7B] bg-[#F9F7F4] resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#C78B7B] hover:bg-[#B5776B] text-white font-semibold rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Business Hours & Info */}
          <div>
            <div className="bg-white p-8 rounded-lg border border-[#E8E3DC] mb-6">
              <h2 className="font-serif text-2xl text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#C78B7B]" />
                Business Hours
              </h2>
              <div className="space-y-3">
                {[
                  { day: 'Monday - Friday', hours: '10:00 AM - 6:00 PM EST' },
                  { day: 'Saturday', hours: '11:00 AM - 5:00 PM EST' },
                  { day: 'Sunday', hours: 'Closed' },
                  { day: 'Holidays', hours: 'Closed' },
                ].map((time) => (
                  <div key={time.day} className="flex justify-between">
                    <span className="text-[#2E2E2E]">{time.day}</span>
                    <span className="text-[#6B6B6B]">{time.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F4EEE8] p-8 rounded-lg border border-[#E8E3DC]">
              <h3 className="font-serif text-xl text-[#2E2E2E] mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-[#6B6B6B] text-sm">
                <li>• Response times are faster during business hours</li>
                <li>• Include order number for faster assistance</li>
                <li>• Check our FAQ before reaching out</li>
                <li>• Call us for urgent matters</li>
                <li>• Emails sent outside hours will be responded to the next business day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E8E3DC]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-[#2E2E2E] mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'What is your return policy?',
                a: 'We offer 30-day returns on all items in original condition. Please contact our support team to initiate a return.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Standard shipping takes 5-7 business days. Express shipping options are available at checkout.',
              },
              {
                q: 'Are your products hypoallergenic?',
                a: 'Our artificial jewelry is designed to be hypoallergenic-friendly, but we recommend patch testing first if you have sensitive skin.',
              },
              {
                q: 'Do you offer bulk orders?',
                a: 'Yes! For bulk orders and corporate gifting, please contact our sales team directly at sales@luxehavenjewelry.com',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-[#E8E3DC] pb-6">
                <h3 className="font-semibold text-[#2E2E2E] mb-3">{faq.q}</h3>
                <p className="text-[#6B6B6B]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
