import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className = '', hoverable = false }: CardProps) {
  const hoverStyles = hoverable ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
