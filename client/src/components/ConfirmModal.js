import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Да, отменить', cancelText = 'Нет' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-phoenix-card rounded-2xl max-w-sm w-full p-6 border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-phoenix-gold">{title}</h3>
          <button onClick={onClose} className="text-phoenix-text-muted hover:text-phoenix-gold">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-phoenix-text mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-bold transition">
            {confirmText}
          </button>
          <button onClick={onClose} className="flex-1 bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text hover:bg-phoenix-gold/20 py-2 rounded-full font-bold transition">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;