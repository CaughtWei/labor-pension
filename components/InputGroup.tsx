import React from 'react';
import { CalculatorState } from '../types';
import { Info, AlertCircle } from 'lucide-react';

interface InputGroupProps {
  label: string;
  name: keyof CalculatorState;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  icon?: React.ReactNode;
  suffix?: string;
  type?: 'text' | 'number' | 'select';
  options?: number[]; // For select dropdown
  calculatedValue?: string; // To show the "Auto-calculated" yellow box
  helperText?: string; // Right-aligned helper text (e.g., Statutory Age)
  error?: string;
  inline?: boolean; // New prop for single-row layout
  className?: string; // New prop for custom styling (e.g., col-span)
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  icon,
  suffix,
  type = "number",
  options,
  calculatedValue,
  helperText,
  error,
  inline = false,
  className = ""
}) => {
  // Use custom className if provided, or default bottom margin if not managed by grid gap.
  const containerClasses = `${className}`; 

  if (inline) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 bg-gray-50/50 p-2 rounded-2xl md:bg-transparent md:p-0">
          <label className="block text-gray-700 font-bold text-sm md:text-base flex items-center gap-2 whitespace-nowrap min-w-fit">
            {icon && <span className="text-blue-500">{icon}</span>}
            {label}
          </label>
          
          <div className="relative w-full">
             <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              onWheel={(e) => e.currentTarget.blur()}
              placeholder={placeholder}
              className={`w-full px-4 py-3 rounded-2xl border-2 ${error ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-white'} text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-lg shadow-sm placeholder-gray-300`}
            />
            {suffix && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {suffix}
              </span>
            )}
          </div>

          {helperText && (
            <span className="text-xs font-bold text-orange-500 bg-orange-100 px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1 shadow-sm border border-orange-200">
              <Info size={14} /> {helperText}
            </span>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-xs mt-1 ml-2 font-bold animate-pulse flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    );
  }

  // Standard Stacked Layout
  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-end mb-2 ml-1">
        <label className="block text-gray-700 font-bold text-sm md:text-base flex items-center gap-2">
          {icon && <span className="text-blue-500">{icon}</span>}
          {label}
        </label>
        {helperText && (
          <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg">
            {helperText}
          </span>
        )}
      </div>
      
      <div className="relative">
        {type === 'select' ? (
           <div className="relative">
             <select
              name={name}
              value={value}
              onChange={onChange}
              className={`w-full px-4 py-3 appearance-none rounded-2xl border-2 ${error ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-white'} text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-lg shadow-sm cursor-pointer`}
            >
              <option value="" disabled>請選擇薪資級距</option>
              {options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toLocaleString()} 元
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
           </div>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onWheel={(e) => e.currentTarget.blur()}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-2xl border-2 ${error ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-white'} text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-lg shadow-sm placeholder-gray-300`}
          />
        )}
        
        {suffix && type !== 'select' && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {suffix}
          </span>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-xs mt-1 ml-2 font-bold animate-pulse flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Auto-Calculated Value Display (The Yellow Box concept) */}
      {calculatedValue && (
        <div className="mt-2 ml-1 flex items-center gap-2 text-sm">
          <span className="text-gray-400">勞保投保級距：</span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-bold border border-yellow-200">
            {calculatedValue}
          </span>
        </div>
      )}
    </div>
  );
};