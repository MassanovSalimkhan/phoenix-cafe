import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const ManagerReports = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [hallLoad, setHallLoad] = useState([]);
  const [period, setPeriod] = useState(7);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const [popularRes, hallRes] = await Promise.all([
        api.get(`/orders/reports/popular-dishes/?days=${period}`),
        api.get(`/orders/reports/hall-load/?days=${period}`),
      ]);
      setPopularDishes(popularRes.data);
      setHallLoad(hallRes.data);
    } catch (err) {
      console.error('Ошибка загрузки отчётов', err);
      toast.error('Не удалось загрузить отчёты');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const COLORS = ['#fbbf24', '#ea580c', '#f59e0b', '#fcd34d', '#b45309', '#d97706', '#fed7aa'];

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка отчётов...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-phoenix-gold mb-8">Отчётность</h1>

        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <label className="text-phoenix-text">Период (дней):</label>
          <select value={period} onChange={(e) => setPeriod(parseInt(e.target.value))} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl px-4 py-2 text-phoenix-text">
            <option value={7}>Последние 7 дней</option>
            <option value={14}>Последние 14 дней</option>
            <option value={30}>Последние 30 дней</option>
          </select>
          <button onClick={fetchReports} className="bg-phoenix-gold text-phoenix-dark px-4 py-2 rounded-full flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Обновить
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Популярные блюда */}
          <div className="bg-phoenix-card rounded-2xl p-6 border border-phoenix-gold/20">
            <h2 className="text-2xl font-bold text-phoenix-gold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Популярные блюда
            </h2>
            {popularDishes.length === 0 ? (
              <p className="text-phoenix-text-muted">Нет данных за выбранный период</p>
            ) : (
              <BarChart width={450} height={300} data={popularDishes} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#a3a3a3" />
                <YAxis type="category" dataKey="dish__name" stroke="#a3a3a3" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#262626', borderColor: '#fbbf24', color: '#f5f5f5' }} />
                <Bar dataKey="total_quantity" fill="#fbbf24" />
              </BarChart>
            )}
          </div>

          {/* Загрузка зала */}
          <div className="bg-phoenix-card rounded-2xl p-6 border border-phoenix-gold/20">
            <h2 className="text-2xl font-bold text-phoenix-gold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" /> Загрузка зала (по зонам)
            </h2>
            {hallLoad.length === 0 ? (
              <p className="text-phoenix-text-muted">Нет бронирований за выбранный период</p>
            ) : (
              <PieChart width={400} height={300}>
                <Pie
                  data={hallLoad}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {hallLoad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#262626', borderColor: '#fbbf24', color: '#f5f5f5' }} />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};