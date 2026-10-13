'use client';

interface TierDiscountTableProps {
  basePrice: number;
}

export default function TierDiscountTable({ basePrice }: TierDiscountTableProps) {
  const tier1Price = basePrice * 0.95;
  const tier2Price = basePrice * 0.90;

  return (
    <div className="my-5 border border-gray-200 rounded-none overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-[13px] font-bold text-gray-800 uppercase tracking-wider">
        Discount per Quantity
      </div>
      <table className="w-full text-left text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold">
            <th className="py-2.5 px-4">Quantity</th>
            <th className="py-2.5 px-4">Discount</th>
            <th className="py-2.5 px-4 text-right">Price Per Unit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          <tr className="hover:bg-blue-50/50 transition-colors">
            <td className="py-2.5 px-4 font-medium">5 - 9</td>
            <td className="py-2.5 px-4 text-green-700 font-bold">5%</td>
            <td className="py-2.5 px-4 text-right font-bold text-[#0c71c3]">
              ${tier1Price.toFixed(2)}
            </td>
          </tr>
          <tr className="hover:bg-blue-50/50 transition-colors">
            <td className="py-2.5 px-4 font-medium">10 +</td>
            <td className="py-2.5 px-4 text-green-700 font-bold">10%</td>
            <td className="py-2.5 px-4 text-right font-bold text-[#0c71c3]">
              ${tier2Price.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
