import React, { useRef, useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); 
  const [error, setError] = useState('');

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError('');
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // If using user-facing camera, we might want to mirror it, but standard capture is fine.
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose(); // Automatically close after capture
        }
      }, 'image/jpeg', 0.8);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-black flex flex-col animate-in fade-in duration-200">
      <div className="p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button onClick={onClose} className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <button onClick={toggleCamera} className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 flex items-center gap-2 transition-colors">
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm font-medium">Putar</span>
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
        {error ? (
          <div className="text-white text-center p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm text-gray-400 mt-2">Cek kembali izin kamera pada browser Anda.</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted
            className={`min-w-full min-h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent pb-12 flex justify-center items-center absolute bottom-0 left-0 right-0">
        {!error && (
          <button 
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-800"></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
