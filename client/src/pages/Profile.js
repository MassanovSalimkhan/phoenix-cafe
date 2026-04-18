import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reservationsRes] = await Promise.all([
          api.get('/users/me/'),
          api.get('/reservations/reservations/')
        ]);
        setUser(userRes.data);
        setReservations(reservationsRes.data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
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

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Личный кабинет</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Имя:</strong> {user?.full_name || 'Не указано'}</p>
        <p><strong>Телефон:</strong> {user?.phone || 'Не указан'}</p>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded mt-2">Выйти</button>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Мои бронирования</h2>
      {reservations.length === 0 ? (
        <p>Нет бронирований. <Link to="/reservation" className="text-orange-600">Забронировать столик</Link></p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Дата</th>
              <th className="border p-2">Время</th>
              <th className="border p-2">Стол</th>
              <th className="border p-2">Гости</th>
              <th className="border p-2">Статус</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td className="border p-2">{res.date}</td>
                <td className="border p-2">{res.start_time}</td>
                <td className="border p-2">{res.table_number}</td>
                <td className="border p-2">{res.guests}</td>
                <td className="border p-2">
                  {res.status === 'New' ? 'Новая' : res.status === 'Confirmed' ? 'Подтверждена' : 'Отменена'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};