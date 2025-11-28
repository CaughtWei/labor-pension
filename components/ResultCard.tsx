
import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculation';
import { TrendingUp, Clock, ArrowRightCircle, Zap } from 'lucide-react';

interface ResultCardProps {
  title: string;
  subtitle: string;
  result: CalculationResult;
  colorTheme: 'blue' | 'pink' | 'green' | 'purple';
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  subtitle,
  result,
  colorTheme,
}) => {
  let containerClass = '';
  let titleClass = '';
  let badge1Class = '';
  let badge2Class = '';
  let decorClass = '';
  let borderDashedClass = '';
  let Icon = TrendingUp;

  switch (colorTheme) {
    case 'blue':
      containerClass = 'bg-blue-50 border-blue-200';
      titleClass = 'text-blue-600';
      badge1Class = 'bg-blue-200 text-blue-800';
      badge2Class = 'bg-blue-500 text-white';
      decorClass = 'bg-blue-400';
      borderDashedClass = 'border-blue-200';
      Icon = TrendingUp;
      break;
    case 'purple':
      containerClass = 'bg-purple-50 border-purple-200';
      titleClass = 'text-purple-600';
      badge1Class = 'bg-purple-200 text-purple-800';
      badge2Class = 'bg-purple-500 text-white';
      decorClass = 'bg-purple-400';
      borderDashedClass = 'border-purple-200';
      Icon = Zap;
      break;
    case 'pink':
      containerClass = 'bg-pink-50 border-pink-200';
      titleClass = 'text-pink-600';
      badge1Class = 'bg-pink-200 text-pink-800';
      badge2Class = 'bg-pink-500 text-white';
      decorClass = 'bg-pink-400';
      borderDashedClass = 'border-pink-200';
      Icon = ArrowRightCircle;
      break;
    case 'green':
      containerClass = 'bg-emerald-50 border-emerald-200';
      titleClass = 'text-emerald-600';
      badge1Class = 'bg-emerald-200 text-emerald-800';
      badge2Class = 'bg-emerald-500 text-white';
      decorClass = 'bg-emerald-400';
      borderDashedClass = 'border-emerald-200';
      Icon = Clock;
      break;
  }

  if (result.option1.amount === 0) {
    return (
      <div className={`p-6 rounded-3xl border-2 border-dashed ${borderDashedClass} flex flex-col items-center justify-center text-center min-h-[200px]`}>
         <span className="text-4xl mb-2">🤔</span>
         <p className="text-gray-400 font-medium">輸入資料後<br/>這裡會顯示試算結果喔！</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border-2 p-5 shadow-sm hover:shadow-md transition-shadow ${containerClass} relative overflow-hidden h-full flex flex-col`}>
      {/* Decorative Circle */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${decorClass}`}></div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className={`text-xl font-bold ${titleClass} flex items-center gap-2 mb-1`}>
          <Icon size={22}/>
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-5 font-medium min-h-[2.5rem] flex items-center">{subtitle}</p>

        <div className="space-y-4 mt-auto">
          {/* Option 1 (User Input Age) */}
          <div className="bg-white/60 p-3 rounded-2xl flex justify-between items-center backdrop-blur-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${badge1Class}`}>
                  {result.option1.age}歲
                </span>
                <span className="text-gray-700 text-sm font-bold">退休</span>
              </div>
              {result.option1.subLabel && (
                <span className="text-[10px] text-gray-400 mt-1 ml-1">{result.option1.subLabel}</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">{formatCurrency(result.option1.amount)}</div>
              <div className="text-xs text-gray-400">/ 月</div>
            </div>
          </div>

          {/* Option 2 (User Age + 5) */}
          <div className="bg-white p-3 rounded-2xl flex justify-between items-center shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${badge2Class}`}>
                  {result.option2.age}歲
                </span>
                <span className="text-gray-700 text-sm font-bold">退休</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 ml-1">{result.option2.subLabel}</span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${titleClass}`}>{formatCurrency(result.option2.amount)}</div>
              <div className="text-xs text-gray-400">/ 月</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
