import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';
import { MessageCircle, Send, Image as ImageIcon, X, CornerDownRight, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { AuthContext } from '../../contexts/AuthContext';
import popSoundFile from '../../assets/sound-effect/mixkit-long-pop-2358.wav';
import { compressImage } from '../../utils/imageCompressor';
import ImageViewerModal from '../common/ImageViewerModal';

const ReportComments = ({ reportId }) => {
  const { user } = React.useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenWatermark, setFullscreenWatermark] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchComments();
    
    // Connect to socket
    const socketUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000");
    const newSocket = io(socketUrl, {
      transports: ['websocket']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_report', reportId);
    });

    newSocket.on('new_comment', (comment) => {
      const audio = new Audio(popSoundFile);
      audio.play().catch(err => console.error('Audio play failed:', err));

      setComments((prev) => [...prev, comment]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      newSocket.emit('leave_report', reportId);
      newSocket.disconnect();
    };
  }, [reportId]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${reportId}`);
      if (res.data.success || res.data.status === 'success') {
        setComments(res.data.data);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('comment_text', newComment);
      if (user) {
        formData.append('user_id', user.id);
      } else if (pseudonym) {
        formData.append('pseudonym', pseudonym);
      }
      if (selectedImage) {
        const compressedImage = await compressImage(selectedImage);
        formData.append('image', compressedImage);
      }
      if (replyTo) formData.append('parent_id', replyTo.id);

      await axiosInstance.post(`/comments/${reportId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewComment('');
      setSelectedImage(null);
      setReplyTo(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setToast({ show: true, message: 'Komentar berhasil dikirim!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Group comments for threading
  const parentComments = comments.filter(c => !c.parent_id);
  const childComments = comments.filter(c => c.parent_id);

  const renderComment = (comment, isReply = false, depth = 0) => {
    const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId });
    const authorName = comment.User ? comment.User.name : (comment.pseudonym || 'Warga Anonim');
    const avatarLetter = authorName.charAt(0).toUpperCase();
    
    // Fallback: Jika backend production belum update untuk mengirimkan role, kita cek dari user_id. 
    // Karena warga biasa tidak punya user_id (mereka anonim/pseudonym).
    const isAdmin = (comment.User && comment.User.role?.toLowerCase() === 'admin') || (comment.user_id != null);
    
    const replies = childComments.filter(c => c.parent_id === comment.id);

    // Threads-like styling: smaller avatars for replies, no massive left margins.
    const avatarSize = depth === 0 ? 'w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base' : 'w-7 h-7 sm:w-8 sm:h-8 text-xs';
    const borderClass = depth === 0 ? 'border-b border-gray-50 pb-4 mb-4' : 'pb-2';
    
    const avatarBg = isAdmin 
      ? 'from-blue-600 to-blue-500 ring-2 ring-blue-200'
      : (depth === 0 ? 'from-indigo-500 to-purple-500' : 'from-blue-400 to-indigo-500');

    const commentWrapperClass = isAdmin ? 'bg-blue-50/40 p-3 rounded-2xl border border-blue-100/60' : '';

    return (
      <div key={comment.id} className={`flex gap-2.5 sm:gap-3 ${depth > 0 ? 'mt-3' : ''}`}>
        <div className="shrink-0 flex flex-col items-center">
          <div className={`${avatarSize} rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center text-white font-bold shadow-sm z-10`}>
            {avatarLetter}
          </div>
          {/* Continuous thread line if there are replies */}
          {replies.length > 0 && (
            <div className="w-[2px] flex-1 bg-gray-100 mt-1.5 mb-0.5 rounded-full min-h-[16px]"></div>
          )}
        </div>
        
        <div className={`flex-1 ${borderClass}`}>
          <div className={commentWrapperClass}>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-bold text-[13px] sm:text-sm text-gray-900 leading-none flex items-center gap-1.5">
                {authorName}
                {isAdmin && (
                  <span className="bg-blue-100 text-blue-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-extrabold flex items-center">
                    <Check className="w-2.5 h-2.5 mr-0.5" /> Admin
                  </span>
                )}
              </h4>
              <span className="text-[11px] text-gray-400 shrink-0 leading-none">{timeAgo}</span>
            </div>
          
          <p className="text-[13px] sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{comment.comment_text}</p>
          
          {comment.image_url && (
            <div className="mt-2.5 rounded-xl overflow-hidden border border-gray-100 max-w-sm">
              <img 
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${comment.image_url}`} 
                alt="Lampiran" 
                className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => {
                  setFullscreenImage(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${comment.image_url}`);
                  setFullscreenWatermark(timeAgo);
                }}
              />
            </div>
          )}
          
          <div className="mt-2 flex gap-4">
            <button 
              onClick={() => setReplyTo({ id: comment.id, name: authorName })}
              className="text-[11px] text-gray-400 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3" /> Balas
            </button>
          </div>
          </div>

          {/* Render Replies */}
          {replies.length > 0 && (
            <div className="mt-1">
              {replies.map(reply => renderComment(reply, true, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gray-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium border border-gray-700">
            <div className="bg-green-500 rounded-full p-0.5">
              <Check className="w-3.5 h-3.5 text-gray-900" />
            </div>
            {toast.message}
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
            <MessageCircle className="w-12 h-12 opacity-20" />
            <p className="text-sm">Jadilah yang pertama mengomentari laporan ini</p>
          </div>
        ) : (
          parentComments.map(c => renderComment(c))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
        {replyTo && (
          <div className="flex justify-between items-center bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-t-xl border-x border-t border-blue-100">
            <div className="flex items-center gap-2">
              <CornerDownRight className="w-4 h-4" />
              <span>Membalas <strong>{replyTo.name}</strong></span>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-blue-400 hover:text-blue-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {selectedImage && (
          <div className="relative inline-block mb-3 ml-2 mt-2">
            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="h-20 rounded-lg border border-gray-300 shadow-sm" />
            <button 
              type="button" 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`flex items-end gap-2 bg-white p-2 border border-gray-200 shadow-sm ${replyTo ? 'rounded-b-xl rounded-tr-xl' : 'rounded-2xl'}`}>
          <div className="flex-1 flex flex-col gap-2">
            {!replyTo && !user && ( // Only show pseudonym if not replying, or always. Let's show always but small
              <input 
                type="text" 
                placeholder="Nama Samaran (Opsional)" 
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="text-xs bg-transparent border-b border-gray-100 px-3 py-1.5 focus:outline-none focus:border-blue-400 text-gray-700"
              />
            )}
            {!replyTo && user && (
              <div className="text-xs bg-transparent border-b border-gray-100 px-3 py-1.5 text-blue-600 font-semibold flex items-center">
                Mengomentari sebagai: {user.username} ({user.role})
              </div>
            )}
            <textarea 
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full text-sm bg-transparent border-none px-3 py-2 focus:ring-0 resize-none max-h-32 min-h-[44px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <div className="flex gap-2 p-1 shrink-0">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              type="submit"
              disabled={!newComment.trim() && !selectedImage}
              className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-full shadow-md transition-colors"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
      <ImageViewerModal 
        imageUrl={fullscreenImage} 
        watermark={fullscreenWatermark}
        onClose={() => {
          setFullscreenImage(null);
          setFullscreenWatermark(null);
        }} 
      />
    </div>
  );
};

export default ReportComments;
