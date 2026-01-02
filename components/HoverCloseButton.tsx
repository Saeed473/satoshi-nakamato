'use client';

import React, { useState } from 'react';

interface HoverCloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: number;
  color?: string;
}

const HoverCloseButton: React.FC<HoverCloseButtonProps> = ({
  onClick,
  className = '',
  size = 24,
  color = '#9ca3af',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative transition-colors cursor-pointer ${className}`}
      aria-label="Close"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* First line - rotates from 45deg to 0deg (becomes horizontal) */}
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
            transform: isHovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
        {/* Second line - fades out on hover */}
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      </svg>
    </button>
  );
};

export default HoverCloseButton;
