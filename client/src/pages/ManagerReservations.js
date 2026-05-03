import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const ManagerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations/reservations/');
      setReservations(res.data);
    } catch (err) {
      console.error('Ошибка загрузки броней', err);
      toast.error('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/reservations/${id}/`, { status });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success(`Статус брони #${id} изменён на ${status === 'Confirmed' ? 'Подтверждена' : status === 'Canceled' ? 'Отменена' : 'Новая'}`);
    } catch (err) {
      toast.error('Ошибка обновления');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'New': return 'Новая';
      case 'Confirmed': return 'Подтверждена';
      case 'Canceled': return 'Отменена';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-300';
      case 'Confirmed': return 'bg-green-500/20 text-green-300';
      case 'Canceled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-stone-500/20 text-stone-300';
    }
  };

  const filtered = filter === 'All' ? reservations : reservations.filter(r => r.status === filter);

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-phoenix-gold">Управление бронированиями</h1>
          <div className="flex gap-3">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl px-4 py-2 text-phoenix-text">
              <option value="All">Все статусы</option>
              <option value="New">Новые</option>
              <option value="Confirmed">Подтверждённые</option>
              <option value="Canceled">Отменённые</option>
            </select>
            <button onClick={fetchReservations} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl p-2 text-phoenix-gold hover:bg-phoenix-gold/20">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map(res => (
            <div key={res.id} className="bg-phoenix-card rounded-2xl p-5 border border-phoenix-gold/20 hover:border-phoenix-gold/40 transition">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-phoenix-text font-bold">Бронь #{res.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(res.status)}`}>{getStatusLabel(res.status)}</span>
                    <span className="text-phoenix-text-muted text-sm">{res.date} в {res.start_time}</span>
                  </div>
                  <p className="text-phoenix-text-muted text-sm mt-1">Клиент: {res.user?.full_name || res.user?.phone || 'Неизвестно'}</p>
                  <p className="text-phoenix-text-muted text-sm">Стол: {res.table_number}, {res.guests} гостей</p>
                  {res.comment && <p className="text-phoenix-text-muted text-sm">Пожелания: {res.comment}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {res.status === 'New' && (
                    <>
                      <button onClick={() => updateStatus(res.id, 'Confirmed')} className="bg-green-500/20 text-green-300 hover:bg-green-500/30 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => updateStatus(res.id, 'Canceled')} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-2 rounded-full">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {res.status === 'Confirmed' && (
                    <button onClick={() => updateStatus(res.id, 'Canceled')} className="bg-red-500/20 text-red-300 hover:bg-red-500/30 p-2 rounded-full">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  {res.status === 'Canceled' && (
                    <span className="text-phoenix-text-muted text-sm">Отменено</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-phoenix-text-muted">Нет бронирований</div>
          )}
        </div>
      </div>
    </div>
  );
};