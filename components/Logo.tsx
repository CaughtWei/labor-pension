import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 身體 (圓潤的金色) */}
      <circle cx="50" cy="55" r="40" fill="#FCD34D" stroke="#F59E0B" strokeWidth="4" />
      
      {/* 耳朵 (左) */}
      <path d="M20 25 L30 40 L15 45 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round" />
      
      {/* 耳朵 (右) */}
      <path d="M80 25 L70 40 L85 45 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round" />
      
      {/* 鼻子 (橢圓) */}
      <ellipse cx="50" cy="60" rx="12" ry="8" fill="#FCA5A5" />
      <circle cx="46" cy="60" r="2" fill="#B91C1C" />
      <circle cx="54" cy="60" r="2" fill="#B91C1C" />
      
      {/* 眼睛 (圓圓亮亮) */}
      <circle cx="35" cy="45" r="4" fill="#1E293B" />
      <circle cx="65" cy="45" r="4" fill="#1E293B" />
      
      {/* 腮紅 */}
      <circle cx="25" cy="60" r="5" fill="#FDA4AF" opacity="0.6" />
      <circle cx="75" cy="60" r="5" fill="#FDA4AF" opacity="0.6" />

      {/* 投幣口 & 金幣 */}
      <rect x="42" y="20" width="16" height="4" rx="2" fill="#78350F" />
      <circle cx="50" cy="12" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
      <text x="50" y="15" fontSize="10" textAnchor="middle" fill="#B45309" fontWeight="bold">$</text>
    </svg>
  );
};