import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'auto' 
}) => {
  const sizes = {
    sm: { height: 28 },
    md: { height: 40 },
    lg: { height: 64 },
    xl: { height: 80 }
  };

  const { height } = sizes[size];

  // Colors based on variant
  // 'light' means for light backgrounds (dark text)
  // 'dark' means for dark backgrounds (light text)
  const textColor = variant === 'dark' ? '#FFFFFF' : (variant === 'light' ? '#0A194F' : 'currentColor');
  const smileColor = '#7B43F1';
  const dotColor = '#7B43F1';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        height={height}
        viewBox="0 0 200 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-sm ${variant === 'auto' ? 'text-[#0A194F] dark:text-white' : ''}`}
      >
        {/* Text "acadify" */}
        <text
          x="10"
          y="48"
          fill={textColor === 'currentColor' ? undefined : textColor}
          className={textColor === 'currentColor' ? 'fill-current' : ''}
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600,
            fontSize: '48px',
            letterSpacing: '-1px'
          }}
        >
          acadify
        </text>

        {/* Purple smile under the first 'a' */}
        <path
          d="M25 54C30 60 45 60 50 54"
          stroke={smileColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Purple dot over the 'i' */}
        <circle cx="154.5" cy="20.5" r="4" fill={dotColor} />
      </svg>
    </div>
  );
};
