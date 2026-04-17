import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: CSSProperties;
}

export default function Card({ children, className = '', hoverable = false, style }: CardProps) {
  const hoverStyles = hoverable ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverStyles} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
