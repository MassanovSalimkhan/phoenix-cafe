import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-phoenix-card rounded-2xl max-w-md w-full p-6 border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-phoenix-gold mb-4">{title}</h3>
        <p className="text-phoenix-text mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text">{cancelText || 'Отмена'}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600">{confirmText || 'Подтвердить'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;