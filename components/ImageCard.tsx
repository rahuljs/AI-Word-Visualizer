
import React from 'react';

interface ImageCardProps {
  title: string;
  word: string | null;
  imageUrl: string | null;
  isLoading: boolean;
}

const ImageCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center animate-pulse h-full">
    <div className="w-full h-10 bg-gray-700 rounded-md mb-4"></div>
    <div className="w-full aspect-square bg-gray-700 rounded-lg"></div>
  </div>
);

const ImageCard: React.FC<ImageCardProps> = ({ title, word, imageUrl, isLoading }) => {
  if (isLoading || !word) {
    return <ImageCardSkeleton />;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
      <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
      <p className="text-3xl font-bold text-white mt-1 mb-4 capitalize">{word}</p>
      <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={`Cartoon of ${word}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-dashed border-gray-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
