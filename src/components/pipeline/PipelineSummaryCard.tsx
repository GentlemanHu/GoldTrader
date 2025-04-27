import React from 'react';

interface PipelineSummaryCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const PipelineSummaryCard: React.FC<PipelineSummaryCardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 mb-2 flex flex-col gap-2 transition-all hover:shadow-2xl ${className}`}>
    <h4 className="text-base font-semibold text-amber-400 mb-1 tracking-wide uppercase">{title}</h4>
    <div className="text-gray-200 text-sm">{children}</div>
  </div>
);

export default PipelineSummaryCard;
