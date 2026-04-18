import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setCredentials } from '../store/authSlice';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('users/login/', { phone, password });
      const { access, refresh, user } = response.data;
      dispatch(setCredentials({ user, access, refresh }));
      navigate('/');
    } catch (error) {
      alert('Ошибка входа: неверный телефон или пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input type="tel" placeholder="+996XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;