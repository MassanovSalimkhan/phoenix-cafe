import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Eye, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Ошибка загрузки заказов', err);
      toast.error('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success(`Статус заказа #${id} изменён на ${getStatusLabel(status)}`);
    } catch (err) {
      console.error('Ошибка обновления статуса', err);
      toast.error('Ошибка обновления');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'New': return 'Новый';
      case 'Preparing': return 'Готовится';
      case 'Ready': return 'Готов';
      case 'Delivered': return 'Доставлен';
      case 'Canceled': return 'Отменён';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-300';
      case 'Preparing': return 'bg-yellow-500/20 text-yellow-300';
      case 'Ready': return 'bg-green-500/20 text-green-300';
      case 'Delivered': return 'bg-stone-500/20 text-stone-300';
      case 'Canceled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-stone-500/20 text-stone-300';
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-phoenix-gold">Управление заказами</h1>
          <div className="flex gap-3">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl px-4 py-2 text-phoenix-text">
              <option value="All">Все статусы</option>
              <option value="New">Новые</option>
              <option value="Preparing">Готовятся</option>
              <option value="Ready">Готовы</option>
              <option value="Delivered">Доставлены</option>
              <option value="Canceled">Отменены</option>
            </select>
            <button onClick={fetchOrders} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl p-2 text-phoenix-gold hover:bg-phoenix-gold/20"><RefreshCw className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-phoenix-card rounded-2xl p-5 border border-phoenix-gold/20 hover:border-phoenix-gold/40 transition">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-phoenix-text font-bold">Заказ #{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                    <span className="text-phoenix-text-muted text-sm">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-phoenix-text-muted text-sm mt-1">Клиент: {order.user?.full_name || order.user?.phone || 'Неизвестно'}</p>
                  <p className="text-phoenix-text-muted text-sm">Сумма: {order.total_amount} сом</p>
                  <p className="text-phoenix-text-muted text-sm">Доставка: {order.delivery_type === 'Delivery' ? 'Доставка' : 'Самовывоз'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-phoenix-dark border border-phoenix-gold/30 rounded-xl px-3 py-1.5 text-sm text-phoenix-text"
                  >
                    <option value="New">Новый</option>
                    <option value="Preparing">Готовится</option>
                    <option value="Ready">Готов</option>
                    <option value="Delivered">Доставлен</option>
                    <option value="Canceled">Отменён</option>
                  </select>
                  <button onClick={() => setSelectedOrder(order)} className="text-phoenix-gold hover:bg-phoenix-gold/20 p-2 rounded-full"><Eye className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && <div className="text-center py-12 text-phoenix-text-muted">Нет заказов</div>}
        </div>
      </div>

      {/* Модальное окно деталей заказа */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-phoenix-card rounded-2xl max-w-md w-full p-6 border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-phoenix-gold mb-4">Детали заказа #{selectedOrder.id}</h3>
            <div className="space-y-2 text-phoenix-text">
              <p><span className="text-phoenix-text-muted">Клиент:</span> {selectedOrder.user?.full_name || selectedOrder.user?.phone}</p>
              <p><span className="text-phoenix-text-muted">Дата:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><span className="text-phoenix-text-muted">Сумма:</span> {selectedOrder.total_amount} сом</p>
              <p><span className="text-phoenix-text-muted">Доставка:</span> {selectedOrder.delivery_type === 'Delivery' ? 'Доставка' : 'Самовывоз'}</p>
              {selectedOrder.delivery_address && <p><span className="text-phoenix-text-muted">Адрес:</span> {selectedOrder.delivery_address}</p>}
              {selectedOrder.comment && <p><span className="text-phoenix-text-muted">Комментарий:</span> {selectedOrder.comment}</p>}
              <div><span className="text-phoenix-text-muted">Состав:</span>
                <ul className="list-disc list-inside mt-1">
                  {selectedOrder.items?.map(item => <li key={item.id}>{item.dish_name} – {item.quantity} шт. x {item.price_at_time} сом</li>)}
                </ul>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full bg-phoenix-gold text-phoenix-dark py-2 rounded-full font-bold">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};