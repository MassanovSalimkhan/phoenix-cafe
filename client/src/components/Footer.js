import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-phoenix-dark border-t border-phoenix-gold/20 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-phoenix-gold mb-4">ФЕНИКС КАФЕ</h3>
            <p className="text-phoenix-text-muted text-sm">История о перерождении. Мы создаем атмосферу, в которой каждый может почувствовать насыщенный вкус высококачественной еды.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-phoenix-gold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-phoenix-text-muted hover:text-phoenix-gold transition">Главная</Link></li>
              <li><Link to="/menu" className="text-phoenix-text-muted hover:text-phoenix-gold transition">Меню</Link></li>
              <li><Link to="/reservation" className="text-phoenix-text-muted hover:text-phoenix-gold transition">Бронирование</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-phoenix-gold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-phoenix-text-muted">
              <li>📍 г. Токмок, ул. Афанасьева, 1/а</li>
              <li>🏙️ Кыргызстан, Токмок</li>
              <li>📞 +996 557 555 466</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-phoenix-gold/20 mt-8 pt-6 text-center text-phoenix-text-muted text-xs">
          © 2026 Кафе "Феникс". Все права защищены.
        </div>
      </div>
    </footer>
  );
};