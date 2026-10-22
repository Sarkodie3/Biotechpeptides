import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    order?: string;
    pm?: string;
    amount?: string;
  }>;
}

export const metadata = {
  title: 'Order Received - Biotech Peptides',
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order || '100010901';
  const paymentMethod = params.pm || 'crypto';
  const amount = params.amount || '0.00';

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
        ✓
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
          THANKS FOR YOUR PURCHASE!
        </h1>
        <p className="text-lg font-bold text-[#0c71c3]">
          Your order number is: {orderNumber}
        </p>
        <p className="text-[14px] text-gray-600 max-w-[500px] mx-auto">
          You will receive an order confirmation email with details of your order and a link to track its progress.
        </p>
      </div>

      {/* CRYPTO Instructions Box */}
      {paymentMethod === 'crypto' && (
        <div className="bg-blue-50/50 border-2 border-[#0c71c3] p-6 md:p-8 text-left space-y-5 rounded-none max-w-[650px] mx-auto">
          <div className="text-center pb-2 border-b border-blue-200">
            <h2 className="text-xl font-black uppercase text-[#0c71c3]">
              CRYPTO PAYMENT INSTRUCTIONS
            </h2>
            <p className="text-[13px] font-bold text-gray-700 uppercase tracking-wider mt-1">
              TOTAL DUE: <span className="text-[#0c71c3] font-black">${amount} USD</span>
            </p>
          </div>

          <div className="space-y-4 text-[14px] text-gray-800">
            <div className="bg-white p-4 border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Bitcoin (BTC) Network</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">BTC</span>
              </div>
              <p className="text-[12px] text-gray-500">Send equivalent of ${amount} USD to our BTC wallet:</p>
              <div className="font-mono text-[12px] bg-gray-100 p-2.5 rounded border break-all select-all font-semibold">
                bc1qbiotechpeptides99researchusa0019283
              </div>
            </div>

            <div className="bg-white p-4 border border-blue-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">USDT (Tether - TRC20)</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">TRC-20</span>
              </div>
              <p className="text-[12px] text-gray-500">Send ${amount} USDT to our TRON / TRC20 address:</p>
              <div className="font-mono text-[12px] bg-gray-100 p-2.5 rounded border break-all select-all font-semibold">
                TXbiotechpeptidesResearchLyophilized99
              </div>
            </div>

            <div className="p-3 bg-blue-50 border-l-4 border-[#0c71c3] text-gray-700 text-[13px]">
              <strong>CONFIRMATION:</strong> Blockchain transfers are automatically confirmed in 5-15 minutes. Once detected, your order status updates to Processing for same-day dispatch.
            </div>
          </div>
        </div>
      )}

      {/* CashApp Instructions Box (if CashApp) */}
      {paymentMethod === 'cashapp' && (
        <div className="bg-[#f0f9f3] border-2 border-emerald-500 p-6 md:p-8 text-left space-y-5 rounded-none max-w-[650px] mx-auto">
          <div className="text-center pb-2 border-b border-emerald-200">
            <h2 className="text-xl font-black uppercase text-emerald-900">
              CASH APP INSTRUCTIONS
            </h2>
            <p className="text-[13px] font-bold text-emerald-700 uppercase tracking-wider mt-1">
              PAYMENTS MUST BE MADE SO THAT WE CAN SHIP YOUR ORDER.
            </p>
          </div>

          <div className="space-y-4 text-[14px] text-gray-800">
            <div className="bg-white p-4 border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-[15px] mb-1">
                STEP 1:
              </span>
              Please send exactly <strong>${amount}</strong> to{' '}
              <span className="bg-emerald-100 text-emerald-900 font-mono px-2 py-0.5 font-bold">
                $psci2021
              </span>{' '}
              on CashApp.
            </div>

            <div className="bg-white p-4 border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-[15px] mb-1">
                STEP 2:
              </span>
              Where it asks <em>For</em>, you must put{' '}
              <span className="bg-emerald-100 text-emerald-900 font-mono px-2 py-0.5 font-bold">
                Cosmetics
              </span>
              .
            </div>

            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-[13px]">
              <strong>IMPORTANT NOTE:</strong> Do not write anything else in this space. We will match your payment to your name and order number once it is received.
            </div>
          </div>
        </div>
      )}

      {/* APPLE PAY Instructions Box */}
      {paymentMethod === 'applepay' && (
        <div className="bg-gray-50 border-2 border-gray-900 p-6 md:p-8 text-left space-y-5 rounded-none max-w-[650px] mx-auto">
          <div className="text-center pb-2 border-b border-gray-300">
            <h2 className="text-xl font-black uppercase text-gray-900 flex items-center justify-center gap-2">
              <span> Pay</span> APPLE PAY INSTRUCTIONS
            </h2>
            <p className="text-[13px] font-bold text-gray-700 uppercase tracking-wider mt-1">
              TOTAL DUE: <span className="text-gray-950 font-black">${amount} USD</span>
            </p>
          </div>

          <div className="space-y-4 text-[14px] text-gray-800">
            <div className="bg-white p-4 border border-gray-200">
              <span className="font-bold text-gray-900 block text-[15px] mb-1">
                STEP 1: Send Apple Cash / Apple Pay
              </span>
              Transfer <strong>${amount}</strong> to our dispatch support contact:
              <div className="mt-2 font-mono text-[13px] bg-gray-100 p-2 font-bold text-gray-900">
                Biotechpeptidessupport@gmail.com / +3122862032
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200">
              <span className="font-bold text-gray-900 block text-[15px] mb-1">
                STEP 2: Note Order Number
              </span>
              In the payment memo/note, include: <strong>Order #{orderNumber}</strong>.
            </div>

            <div className="p-3 bg-green-50 border-l-4 border-green-600 text-green-950 text-[13px]">
              <strong>INSTANT PROCESSING:</strong> Apple Pay transfers are confirmed upon receipt and queued immediately for express dispatch.
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-4">
        <Link
          href="/buy-peptides/"
          className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-8 py-3.5 text-[14px] font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Support Box */}
      <div className="pt-6 border-t border-gray-200 text-[13px] text-gray-500">
        <p className="font-bold uppercase tracking-wider text-gray-700 mb-1">SUPPORT</p>
        <p>
          If you have any questions, concerns, or complaints please email us at:{' '}
          <a href="mailto:Biotechpeptidessupport@gmail.com" className="text-[#0c71c3] underline">
            Biotechpeptidessupport@gmail.com
          </a>{' '}
          or call/text us at{' '}
          <a href="tel:+3122862032" className="text-[#0c71c3] underline">
            +3122862032
          </a>.
        </p>
      </div>
    </div>
  );
}
