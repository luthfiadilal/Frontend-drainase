import React from 'react';
import { X } from 'lucide-react';

const ImageViewerModal = ({ imageUrl, watermark, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-[3010]"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative animate-in zoom-in-95 duration-200">
        <img 
          src={imageUrl} 
          alt="Enlarged" 
          className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()} 
        />
        {watermark && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium backdrop-blur-md pointer-events-none shadow-lg border border-white/20">
            {watermark}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewerModal;
