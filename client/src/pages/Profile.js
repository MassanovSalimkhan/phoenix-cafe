import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { User, Calendar, LogOut, Clock } from 'lucide-react';

export const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/reservations/reservations/');
        console.log('Брони:', res.data);
        setReservations(res.data);
      } catch (err) {
        console.error('Ошибка загрузки броней:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'client': return 'Клиент';
      case 'manager': return 'Менеджер';
      case 'admin': return 'Администратор';
      default: return 'Клиент';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return { label: 'Новая', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'Confirmed': return { label: 'Подтверждена', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
      case 'Canceled': return { label: 'Отменена', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      default: return { label: status, color: 'bg-stone-500/20 text-stone-300' };
    }
  };

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center"><div className="animate-pulse text-phoenix-gold">Загрузка...</div></div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Карточка профиля */}
        <div className="bg-phoenix-card rounded-2xl shadow-xl border border-phoenix-gold/20 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-phoenix-gold/10 to-transparent px-8 py-6 border-b border-phoenix-gold/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-phoenix-gold/20 p-3 rounded-full">
                  <User className="w-8 h-8 text-phoenix-gold" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-phoenix-gold">Личный кабинет</h1>
                  <p className="text-phoenix-text-muted text-sm">Ваши бронирования</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-phoenix-dark hover:bg-phoenix-gold/20 text-phoenix-text border border-phoenix-gold/30 px-5 py-2 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-phoenix-gold" />
                </div>
                <div>
                  <p className="text-phoenix-text-muted text-xs">Имя</p>
                  <p className="text-phoenix-text font-medium">{user?.full_name || 'Не указано'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-phoenix-gold" />
                </div>
                <div>
                  <p className="text-phoenix-text-muted text-xs">Телефон</p>
                  <p className="text-phoenix-text font-medium">{user?.phone || 'Не указан'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-phoenix-gold" />
                </div>
                <div>
                  <p className="text-phoenix-text-muted text-xs">Роль</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-phoenix-gold/20 text-phoenix-gold">
                    {getRoleLabel(user?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Бронирования */}
        <div className="bg-phoenix-card rounded-2xl shadow-xl border border-phoenix-gold/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-phoenix-gold/20">
            <h2 className="text-xl font-bold text-phoenix-gold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Мои бронирования
              {reservations.length > 0 && <span className="text-sm text-phoenix-text-muted">({reservations.length})</span>}
            </h2>
          </div>
          <div className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-phoenix-text-muted mx-auto mb-4" />
                <p className="text-phoenix-text-muted">У вас пока нет бронирований.</p>
                <Link to="/reservation" className="inline-block mt-4 text-phoenix-gold hover:underline">Забронировать столик</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map(res => {
                  const badge = getStatusBadge(res.status);
                  return (
                    <div key={res.id} className="bg-phoenix-dark rounded-xl p-5 border border-phoenix-gold/20 hover:border-phoenix-gold/40 transition">
                      <div className="flex flex-wrap justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-phoenix-text font-semibold">Стол {res.table_number}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>{badge.label}</span>
                          </div>
                          <p className="text-phoenix-text-muted text-sm mt-1">{res.date} в {res.start_time}</p>
                          <p className="text-phoenix-text-muted text-sm">Гостей: {res.guests}</p>
                        </div>
                        <div className="text-right">
                          <Clock className="w-5 h-5 text-phoenix-gold inline mr-1" />
                          <span className="text-phoenix-text-muted text-sm">{res.start_time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};