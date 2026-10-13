'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
          Contact Us
        </h1>
        <p className="text-[15px] text-gray-600 mt-2 max-w-[600px] mx-auto">
          Our team is here to assist verified laboratories and researchers with inquiries regarding compounds, custom sequences, or orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-gray-50 border border-gray-200 p-8">
          <div>
            <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-2">
              Phone
            </h2>
            <p className="text-[18px] font-bold text-[#0c71c3]">
              <a href="tel:619-453-0156">619-453-0156</a>
            </p>
            <p className="text-[13px] text-gray-600 mt-1">
              You can call or text us for support.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 mb-2">
              Email
            </h2>
            <p className="text-[16px] font-bold text-[#0c71c3]">
              <a href="mailto:Support@biotechpeptides.com">Support@biotechpeptides.com</a>
            </p>
            <p className="text-[13px] text-gray-600 mt-1">
              Inquiries typically answered within 24 business hours.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 text-[12px] text-gray-500 leading-relaxed">
            <p>
              Users may contact Biotech Peptides via SMS for customer support. We only send SMS as responses to customers who reach out to us using the phone number listed above. See our{' '}
              <Link href="/privacy-policy/" className="text-[#0c71c3] underline">
                Privacy Policy
              </Link>{' '}
              for more details.
            </p>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-8 shadow-xs">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900 mb-6">
            Have a question ? Send us a message.
          </h2>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-[14px]">
              Thank you! Your message has been sent successfully. A representative will contact you shortly.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-[14px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 bg-[#0c71c3] hover:bg-[#0a5ea3] disabled:opacity-50 text-white font-bold uppercase text-[14px] tracking-wider transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
