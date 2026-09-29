import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import Button from './Button';

const FeedbackModal = ({ isOpen, onClose, type = 'success', title, message }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
            {isSuccess ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title || (isSuccess ? "Berhasil" : "Gagal")}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          
          <Button type="button" className="w-full justify-center" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
