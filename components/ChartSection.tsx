
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComparisonData } from '../types';

interface ChartSectionProps {
  data: ComparisonData[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  if (data.every(d => d.amount2 === 0)) return null;

  // Extract labels from the first data point to display in legend if available
  const label1 = data[0]?.label1 || '預計退休';
  const label2 = data[0]?.label2 || '+5年';

  return (
    <div className="mt-8 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
        <span>📊</span> 退休金超級比一比
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="scenario" 
              type="category" 
              tick={{ fontSize: 13, fill: '#555', fontWeight: 'bold' }} 
              width={90}
            />
            <Tooltip 
              cursor={{fill: '#f9fafb'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="amount1" name="該歲數退休" fill="#93C5FD" radius={[0, 10, 10, 0]} barSize={20} />
            <Bar dataKey="amount2" name="+5年後請領" fill="#3B82F6" radius={[0, 10, 10, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          <span>試算年齡退休</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>延後5年請領</span>
        </div>
      </div>
    </div>
  );
};
