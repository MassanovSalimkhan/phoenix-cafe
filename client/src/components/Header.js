import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { ShoppingCart, Menu, X } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemsCount = 0;

  const isActive = (path) => location.pathname === path ? 'text-phoenix-gold border-b-2 border-phoenix-gold' : 'text-phoenix-text-muted hover:text-phoenix-gold-light';

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = [
    { path: '/menu', label: 'МЕНЮ' },
    { path: '/reservation', label: 'БРОНИРОВАНИЕ' },
    { path: '/about', label: 'О НАС' },
  ];

  // Ссылки панели менеджера (видны только если роль manager или admin)
  const managerLinks = [
    { path: '/manager/orders', label: 'Заказы' },
    { path: '/manager/reservations', label: 'Брони' },
    { path: '/manager/menu', label: 'Меню' },
    { path: '/manager/reports', label: 'Отчёты' },
  ];

  const hasManagerAccess = user?.role === 'manager' || user?.role === 'admin';

  return (
    <header className="bg-phoenix-dark border-b border-phoenix-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Логотип" className="h-20 w-auto" />
          <span className="text-2xl font-bold text-phoenix-gold tracking-wide">ФЕНИКС</span>
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm md:text-base">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`${isActive(link.path)} transition`}>{link.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative text-phoenix-text-muted hover:text-phoenix-gold transition">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && <span className="absolute -top-2 -right-2 bg-phoenix-gold text-phoenix-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartItemsCount}</span>}
              </Link>
              {hasManagerAccess && (
                <div className="relative group">
                  <button className="text-phoenix-text-muted hover:text-phoenix-gold transition">Панель</button>
                  <div className="absolute right-0 mt-2 w-48 bg-phoenix-card rounded-xl shadow-lg border border-phoenix-gold/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {managerLinks.map(link => (
                      <Link key={link.path} to={link.path} className="block px-4 py-2 text-sm text-phoenix-text hover:bg-phoenix-gold/10 hover:text-phoenix-gold">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <Link to="/profile" className={`${isActive('/profile')} transition`}>{user?.full_name || 'Профиль'}</Link>
              <button onClick={handleLogout} className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-3 py-1 rounded-full text-sm font-bold transition">Выйти</button>
            </>
          ) : (
            <Link to="/login" className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-4 py-2 rounded-full text-sm font-bold transition">Войти</Link>
          )}
        </div>

        {/* Мобильное меню */}
        <div className="flex md:hidden items-center space-x-4">
          {isAuthenticated && (
            <Link to="/cart" className="relative text-phoenix-text-muted hover:text-phoenix-gold transition">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && <span className="absolute -top-2 -right-2 bg-phoenix-gold text-phoenix-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartItemsCount}</span>}
            </Link>
          )}
          <button onClick={toggleMobileMenu} className="text-phoenix-text-muted hover:text-phoenix-gold">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-phoenix-dark border-t border-phoenix-gold/20 py-4 px-4 space-y-3">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`block py-2 ${isActive(link.path)} transition`} onClick={toggleMobileMenu}>
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" className="block py-2 text-phoenix-text-muted hover:text-phoenix-gold" onClick={toggleMobileMenu}>Войти</Link>
          )}
          {isAuthenticated && (
            <>
              <Link to="/profile" className={`block py-2 ${isActive('/profile')} transition`} onClick={toggleMobileMenu}>Профиль</Link>
              {hasManagerAccess && (
                <>
                  <div className="text-phoenix-text-muted text-sm font-semibold mt-2 mb-1">Панель</div>
                  {managerLinks.map(link => (
                    <Link key={link.path} to={link.path} className="block py-1 pl-4 text-sm text-phoenix-text hover:text-phoenix-gold" onClick={toggleMobileMenu}>
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="block w-full text-left py-2 text-red-400">Выйти</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};