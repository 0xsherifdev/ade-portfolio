import React from 'react';

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  icon?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ alt, className, icon }) => {
  return (
    <div className={`flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="text-gray-500 flex flex-col items-center gap-2">
        <span className="text-4xl">{icon || '🖼️'}</span>
        <span className="text-sm font-mono">{alt}</span>
      </div>
    </div>
  );
};

export default PlaceholderImage;
