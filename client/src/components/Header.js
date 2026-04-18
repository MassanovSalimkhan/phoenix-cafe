import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ShoppingCart } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const cartItemsCount = 0; // заглушка

  const isActive = (path) => location.pathname === path ? 'text-phoenix-gold border-b-2 border-phoenix-gold' : 'text-phoenix-text-muted hover:text-phoenix-gold-light';

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <header className="bg-phoenix-dark border-b border-phoenix-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center">
        {/* Логотип + название */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Логотип" className="h-20 w-auto" />
          <span className="text-2xl font-bold text-phoenix-gold tracking-wide">ФЕНИКС</span>
        </Link>

        <nav className="flex space-x-6 text-sm md:text-base">
          <Link to="/menu" className={`${isActive('/menu')} transition`}>МЕНЮ</Link>
          <Link to="/about" className={`${isActive('/about')} transition`}>О НАС</Link>
          <Link to="/contacts" className={`${isActive('/contacts')} transition`}>КОНТАКТЫ</Link>
          <Link to="/reservation" className={`${isActive('/reservation')} transition`}>БРОНИРОВАНИЕ</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative text-phoenix-text-muted hover:text-phoenix-gold transition">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-phoenix-gold text-phoenix-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className={`${isActive('/profile')} transition`}>
                {user?.full_name || 'Профиль'}
              </Link>
              <button onClick={handleLogout} className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-3 py-1 rounded-full text-sm font-bold transition">Выйти</button>
            </>
          ) : (
            <Link to="/login" className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-4 py-2 rounded-full text-sm font-bold transition">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
};