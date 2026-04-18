import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { LogOut, ShoppingBag, Calendar } from 'lucide-react';

export const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reservationsRes] = await Promise.all([
          api.get('/orders/'),
          api.get('/reservations/reservations/')
        ]);
        setOrders(ordersRes.data);
        setReservations(reservationsRes.data);
      } catch (err) {
        console.error('Ошибка загрузки истории:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-phoenix-card rounded-3xl shadow-md border border-phoenix-gold/20 overflow-hidden">
          {/* Шапка профиля */}
          <div className="bg-phoenix-gold/10 px-8 py-6 border-b border-phoenix-gold/20">
            <h1 className="text-3xl font-bold text-phoenix-gold">Личный кабинет</h1>
            <p className="text-phoenix-text-muted mt-1">Управление вашими данными, заказами и бронями</p>
          </div>

          {/* Информация о пользователе */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-phoenix-text font-semibold">Имя:</span>
                  <span className="text-phoenix-text">{user?.full_name || 'Не указано'}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-phoenix-text font-semibold">Телефон:</span>
                  <span className="text-phoenix-text">{user?.phone || 'Не указан'}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-phoenix-text font-semibold">Роль:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-phoenix-gold/20 text-phoenix-gold">
                    {getRoleLabel(user?.role)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-6 py-2 rounded-full font-bold transition"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </div>

          {/* Заказы */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-phoenix-gold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> История заказов
            </h2>
            {orders.length === 0 ? (
              <div className="bg-phoenix-dark rounded-xl p-6 text-center border border-phoenix-gold/20">
                <p className="text-phoenix-text-muted">У вас пока нет заказов.</p>
                <Link to="/menu" className="inline-block mt-4 text-phoenix-gold hover:underline">Перейти в меню</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-phoenix-gold/20">
                  <thead className="bg-phoenix-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">№</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Сумма</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-phoenix-gold/20">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{new Date(order.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{order.total_amount} сом</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                            order.status === 'Preparing' ? 'bg-yellow-500/20 text-yellow-300' :
                            order.status === 'Ready' ? 'bg-green-500/20 text-green-300' :
                            'bg-stone-500/20 text-stone-300'
                          }`}>
                            {order.status === 'New' ? 'Новый' :
                             order.status === 'Preparing' ? 'Готовится' :
                             order.status === 'Ready' ? 'Готов' : order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Бронирования */}
          <div className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-phoenix-gold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Мои бронирования
            </h2>
            {reservations.length === 0 ? (
              <div className="bg-phoenix-dark rounded-xl p-6 text-center border border-phoenix-gold/20">
                <p className="text-phoenix-text-muted">У вас пока нет бронирований.</p>
                <Link to="/reservation" className="inline-block mt-4 text-phoenix-gold hover:underline">Забронировать столик</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-phoenix-gold/20">
                  <thead className="bg-phoenix-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Время</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Стол</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Гости</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-phoenix-text-muted uppercase tracking-wider">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-phoenix-gold/20">
                    {reservations.map(res => (
                      <tr key={res.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{res.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{res.start_time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{res.table_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-phoenix-text">{res.guests}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            res.status === 'New' ? 'bg-blue-500/20 text-blue-300' :
                            res.status === 'Confirmed' ? 'bg-green-500/20 text-green-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {res.status === 'New' ? 'Новая' : res.status === 'Confirmed' ? 'Подтверждена' : 'Отменена'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};