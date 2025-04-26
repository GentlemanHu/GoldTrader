import React from 'react';

interface SummaryCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow-lg h-full ${className}`}>
      <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default SummaryCard;