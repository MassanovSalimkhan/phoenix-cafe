import React from 'react';
import { X } from 'lucide-react';

const DishModal = ({ dish, onClose, onAddToCart }) => {
  if (!dish) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-phoenix-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={dish.image_url || "https://via.placeholder.com/400x300"} alt={dish.name} className="w-full h-64 object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-phoenix-gold mb-2">{dish.name}</h3>
          <p className="text-phoenix-text-muted text-sm mb-4">{dish.category_name}</p>
          <p className="text-phoenix-text leading-relaxed mb-6">{dish.description}</p>
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-phoenix-gold">{dish.price} сом</span>
            <span className="text-phoenix-text-muted text-sm">{dish.weight}</span>
          </div>
          <button
            onClick={() => { onAddToCart(dish); onClose(); }}
            className="w-full bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light py-3 rounded-full font-bold transition"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishModal;