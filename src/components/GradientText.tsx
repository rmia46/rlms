import React from 'react';

interface GradientTextProps {
  text: string;
  id: string;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ text, id, className = '' }) => {
  const gradientId = `gradient-${id}`;
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#8A2BE2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4682B4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={`url(#${gradientId})`}
        className="text-2xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};