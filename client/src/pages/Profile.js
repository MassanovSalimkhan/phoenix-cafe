import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { User, Calendar, LogOut, Clock, ShoppingBag, Eye, XCircle  } from 'lucide-react';

export const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
        console.error('Ошибка загрузки данных:', err);
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

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'New': return { label: 'Новый', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'Preparing': return { label: 'Готовится', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      case 'Ready': return { label: 'Готов', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
      case 'Delivered': return { label: 'Доставлен', color: 'bg-stone-500/20 text-stone-300 border-stone-500/30' };
      case 'Canceled': return { label: 'Отменён', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      default: return { label: status, color: 'bg-stone-500/20 text-stone-300' };
    }
  };

  const getReservationStatusBadge = (status) => {
    switch (status) {
      case 'New': return { label: 'Новая', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'Confirmed': return { label: 'Подтверждена', color: 'bg-green-500/20 text-green-300 border-green-500/30' };
      case 'Canceled': return { label: 'Отменена', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      default: return { label: status, color: 'bg-stone-500/20 text-stone-300' };
    }
  };

  const cancelReservation = async (id) => {
    if (window.confirm('Отменить бронирование?')) {
      try {
        await api.patch(`/reservations/reservations/${id}/`, { status: 'Canceled' });
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Canceled' } : r));
        alert('Бронирование отменено');
      } catch (err) {
        console.error('Ошибка отмены', err);
        alert('Не удалось отменить');
      }
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center"><div className="animate-pulse text-phoenix-gold">Загрузка...</div></div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <p className="text-phoenix-text-muted text-sm">Управление заказами и бронями</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-phoenix-dark hover:bg-phoenix-gold/20 text-phoenix-text border border-phoenix-gold/30 px-5 py-2 rounded-full transition">
                <LogOut className="w-4 h-4" /> <span>Выйти</span>
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center"><User className="w-5 h-5 text-phoenix-gold" /></div>
                <div><p className="text-phoenix-text-muted text-xs">Имя</p><p className="text-phoenix-text font-medium">{user?.full_name || 'Не указано'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center"><User className="w-5 h-5 text-phoenix-gold" /></div>
                <div><p className="text-phoenix-text-muted text-xs">Телефон</p><p className="text-phoenix-text font-medium">{user?.phone || 'Не указан'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-phoenix-gold/10 flex items-center justify-center"><User className="w-5 h-5 text-phoenix-gold" /></div>
                <div><p className="text-phoenix-text-muted text-xs">Роль</p><p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-phoenix-gold/20 text-phoenix-gold">{getRoleLabel(user?.role)}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-phoenix-card rounded-2xl shadow-xl border border-phoenix-gold/20 overflow-hidden">
          <div className="flex border-b border-phoenix-gold/20">
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'orders' ? 'text-phoenix-gold border-b-2 border-phoenix-gold bg-phoenix-gold/5' : 'text-phoenix-text-muted hover:text-phoenix-gold hover:bg-phoenix-gold/5'}`}>
              <ShoppingBag className="w-4 h-4" /> Заказы {orders.length > 0 && <span className="ml-1 text-xs">({orders.length})</span>}
            </button>
            <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'reservations' ? 'text-phoenix-gold border-b-2 border-phoenix-gold bg-phoenix-gold/5' : 'text-phoenix-text-muted hover:text-phoenix-gold hover:bg-phoenix-gold/5'}`}>
              <Calendar className="w-4 h-4" /> Бронирования {reservations.length > 0 && <span className="ml-1 text-xs">({reservations.length})</span>}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <>
                {orders.length === 0 ? (
                  <div className="text-center py-12"><ShoppingBag className="w-16 h-16 text-phoenix-text-muted mx-auto mb-4" /><p className="text-phoenix-text-muted">У вас пока нет заказов.</p><Link to="/menu" className="inline-block mt-4 text-phoenix-gold hover:underline">Перейти в меню</Link></div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const badge = getOrderStatusBadge(order.status);
                      return (
                        <div key={order.id} className="bg-phoenix-dark rounded-xl p-5 border border-phoenix-gold/20 hover:border-phoenix-gold/40 transition flex flex-wrap justify-between items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2"><span className="text-phoenix-text font-semibold">Заказ #{order.id}</span><span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>{badge.label}</span></div>
                            <p className="text-phoenix-text-muted text-sm mt-1">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right"><p className="text-phoenix-gold font-bold text-xl">{order.total_amount} сом</p></div>
                            <button onClick={() => viewOrderDetails(order)} className="text-phoenix-gold hover:bg-phoenix-gold/20 p-2 rounded-full transition"><Eye className="w-5 h-5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'reservations' && (
              <>
                {reservations.length === 0 ? (
                  <div className="text-center py-12"><Calendar className="w-16 h-16 text-phoenix-text-muted mx-auto mb-4" /><p className="text-phoenix-text-muted">У вас пока нет бронирований.</p><Link to="/reservation" className="inline-block mt-4 text-phoenix-gold hover:underline">Забронировать столик</Link></div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map(res => {
                      const badge = getReservationStatusBadge(res.status);
                      const canCancel = res.status === 'New' || res.status === 'Confirmed';
                      return (
                        <div key={res.id} className="bg-phoenix-dark rounded-xl p-5 border border-phoenix-gold/20 hover:border-phoenix-gold/40 transition flex flex-wrap justify-between items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2"><span className="text-phoenix-text font-semibold">Стол {res.table_number}</span><span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>{badge.label}</span></div>
                            <p className="text-phoenix-text-muted text-sm mt-1">{res.date} в {res.start_time}</p>
                            <p className="text-phoenix-text-muted text-sm">Гостей: {res.guests}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right"><Clock className="w-5 h-5 text-phoenix-gold inline mr-1" /><span className="text-phoenix-text-muted text-sm">{res.start_time}</span></div>
                            {canCancel && <button onClick={() => cancelReservation(res.id)} className="text-red-400 hover:bg-red-500/20 p-2 rounded-full transition"><XCircle className="w-5 h-5" /></button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно деталей заказа */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-phoenix-card rounded-2xl max-w-md w-full p-6 border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-phoenix-gold">Детали заказа #{selectedOrder.id}</h3><button onClick={() => setModalOpen(false)} className="text-phoenix-text-muted hover:text-phoenix-gold">&times;</button></div>
            <div className="space-y-3 text-phoenix-text">
              <p><span className="text-phoenix-text-muted">Дата:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><span className="text-phoenix-text-muted">Сумма:</span> {selectedOrder.total_amount} сом</p>
              <p><span className="text-phoenix-text-muted">Статус:</span> {getOrderStatusBadge(selectedOrder.status).label}</p>
              <p><span className="text-phoenix-text-muted">Тип доставки:</span> {selectedOrder.delivery_type === 'Delivery' ? 'Доставка' : 'Самовывоз'}</p>
              {selectedOrder.delivery_address && <p><span className="text-phoenix-text-muted">Адрес:</span> {selectedOrder.delivery_address}</p>}
              {selectedOrder.comment && <p><span className="text-phoenix-text-muted">Комментарий:</span> {selectedOrder.comment}</p>}
              <div><span className="text-phoenix-text-muted">Состав:</span> <ul className="list-disc list-inside mt-1">
                {selectedOrder.items?.map(item => <li key={item.id}>{item.dish_name} – {item.quantity} шт. x {item.price_at_time} сом = {item.quantity * item.price_at_time} сом</li>)}
              </ul></div>
            </div>
            <button onClick={() => setModalOpen(false)} className="mt-6 w-full bg-phoenix-gold text-phoenix-dark py-2 rounded-full font-bold">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};