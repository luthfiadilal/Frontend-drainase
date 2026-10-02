import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosInstance from '../../api/axiosInstance';
import { MessageCircle, Send, Image as ImageIcon, X, CornerDownRight, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const ReportComments = ({ reportId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchComments();
    
    // Connect to socket
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket']
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_report', reportId);
    });

    newSocket.on('new_comment', (comment) => {
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
      if (pseudonym) formData.append('pseudonym', pseudonym);
      if (selectedImage) formData.append('image', selectedImage);
      if (replyTo) formData.append('parent_id', replyTo.id);

      // In real app, user_id comes from auth context. For now we assume anonymous if no user_id.
      // If user is logged in, you would append 'user_id' from auth context.

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

  const renderComment = (comment, isReply = false) => {
    const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId });
    const authorName = comment.User ? comment.User.name : (comment.pseudonym || 'Warga Anonim');
    const avatarLetter = authorName.charAt(0).toUpperCase();
    const replies = childComments.filter(c => c.parent_id === comment.id);

    return (
      <div key={comment.id} className={`flex gap-3 mb-4 ${isReply ? 'ml-10 mt-2' : ''}`}>
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            {avatarLetter}
          </div>
          {!isReply && replies.length > 0 && (
            <div className="w-0.5 h-full bg-gray-200 mt-2 rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-bold text-sm text-gray-900">{authorName}</h4>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.comment_text}</p>
          
          {comment.image_url && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 max-w-sm">
              <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${comment.image_url}`} alt="Lampiran" className="w-full h-auto object-cover" />
            </div>
          )}
          
          <div className="mt-3 flex gap-4">
            <button 
              onClick={() => setReplyTo({ id: comment.id, name: authorName })}
              className="text-xs text-gray-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Balas
            </button>
          </div>

          {/* Render Replies */}
          {replies.map(reply => renderComment(reply, true))}
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
      <div className="flex-1 overflow-y-auto p-4">
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
      <div className="p-4 bg-gray-50 border-t border-gray-200">
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
            {!replyTo && ( // Only show pseudonym if not replying, or always. Let's show always but small
              <input 
                type="text" 
                placeholder="Nama Samaran (Opsional)" 
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                className="text-xs bg-transparent border-b border-gray-100 px-3 py-1.5 focus:outline-none focus:border-blue-400 text-gray-700"
              />
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
    </div>
  );
};

export default ReportComments;
