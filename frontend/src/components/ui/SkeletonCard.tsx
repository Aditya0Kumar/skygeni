import React from 'react';

const SkeletonCard: React.FC<{ height?: string }> = ({ height = "120px" }) => {
  return (
    <div 
      className="loading-shimmer"
      style={{ 
        height, 
        width: '100%', 
        borderRadius: '1rem', 
        border: '1px solid var(--border-strong)',
        background: '#f8fafc' 
      }} 
    />
  );
};

export default SkeletonCard;
