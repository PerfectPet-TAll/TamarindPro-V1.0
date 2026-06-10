import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon, CheckSquare, Square } from 'lucide-react';
import { PriceBook, MOCK_ITEMS, MOCK_PRODUCT_HISTORY, COLORS } from '../types';

interface PriceTrendsChartProps {
  selectedProducts: string[];
  activeBook: PriceBook;
  onSelectProduct: (sku: string) => void;
}

export default function PriceTrendsChart({
  selectedProducts,
  activeBook,
  onSelectProduct
}: PriceTrendsChartProps) {
  return (
    <div className="p-8 animate-fadeIn flex flex-col gap-8 h-full bg-[#f8f9fa] flex-1">
      <div className="bg-white p-6 rounded-2xl border border-[#adb2b0]/30 shadow-sm flex flex-col flex-1 min-h-[350px]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-mono text-[14px] font-black text-[#214573] uppercase tracking-widest flex items-center gap-2">
            <LineChartIcon size={18} className="text-[#f47729]" /> Historical Price Trends
          </h4>
          {selectedProducts.length === 0 && (
            <span className="text-[11px] font-bold text-[#e3624a] bg-[#e3624a]/10 px-3 py-1 rounded-full animate-pulse">
              Please select products below to view trends
            </span>
          )}
        </div>
        <div className="flex-1 w-full h-full min-h-[300px] flex items-center justify-center">
          {selectedProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_PRODUCT_HISTORY} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#adb2b0" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis stroke="#8c7361" fontSize={11} tickLine={false} axisLine={false} tickMargin={12} tickFormatter={(val) => `฿${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#091d38', borderColor: '#214573', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#8c7361', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} iconType="circle" />
                {selectedProducts.map((sku, index) => {
                  const product = MOCK_ITEMS.find(p => p.id === sku);
                  return (
                    <Line 
                      key={sku} 
                      name={product?.name || sku}
                      type="monotone" 
                      dataKey={sku} 
                      stroke={COLORS[index % COLORS.length]} 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#8c7361] opacity-60">
              <LineChartIcon size={48} className="mb-4 text-[#af7a2b]" />
              <p className="text-[12px] font-black uppercase tracking-widest text-[#214573]">No Products Selected</p>
              <p className="text-[11px] mt-1">Select items from the table below to generate the comparison chart.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#adb2b0]/30 shadow-sm overflow-hidden flex-shrink-0">
        <table className="w-full text-left font-sans border-collapse">
          <thead className="bg-[#EAF2EA]/50 text-[#53483e] font-mono">
            <tr>
              <th className="py-4 px-6 w-12 border-b border-[#adb2b0]/40 text-center">
                <Square size={16} className="text-[#8c7361] opacity-50 mx-auto" />
              </th>
              <th className="py-4 px-8 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40">Product Catalog</th>
              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Category</th>
              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-right">Standard Price</th>
              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-right text-[#f47729]">{activeBook.name} Price</th>
              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Margin</th>
              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] border-b border-[#adb2b0]/40 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#adb2b0]/20 font-mono">
            {MOCK_ITEMS.map((item, idx) => {
              const isSelected = selectedProducts.includes(item.id);
              return (
                <tr 
                  key={idx} 
                  className={`hover:bg-[#f8f9fa] transition-colors h-[54px] cursor-pointer ${isSelected ? 'bg-[#EAF2EA]/20' : ''}`}
                  onClick={() => onSelectProduct(item.id)}
                >
                  <td className="py-3 px-6 text-center">
                    {isSelected ? <CheckSquare size={16} className="text-[#f47729] mx-auto" /> : <Square size={16} className="text-[#8c7361] mx-auto" />}
                  </td>
                  <td className="py-3 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-[#2e3118] text-[12px] uppercase font-sans">{item.name}</span>
                      <span className="text-[10px] font-bold text-[#8c7361]">{item.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center text-[11px] font-bold text-[#8c7361]">{item.category}</td>
                  <td className="py-3 px-6 text-right font-black text-[13px] text-[#53483e]">{item.basePrice.toLocaleString()}</td>
                  <td className="py-3 px-6 text-right font-black text-[14px] text-[#f47729]">{item.bookPrice.toLocaleString()}</td>
                  <td className="py-3 px-6 text-center font-black text-[11px] text-[#606934]">{item.margin}</td>
                  <td className="py-3 px-6 text-center">
                    {isSelected && (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(item.id);
                        }}
                        className="text-[#8c7361] hover:text-[#e3624a] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-transparent hover:bg-[#e3624a]/10 hover:border-[#e3624a]/30 transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
