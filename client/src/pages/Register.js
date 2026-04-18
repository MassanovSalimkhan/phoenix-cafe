import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setCredentials } from '../store/authSlice';

const Register = () => {
  const [phone, setPhone] = useState('+996');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+996')) value = '+996';
    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('users/register/', { phone, password, full_name: fullName });
      const { access, refresh, user } = response.data;
      dispatch(setCredentials({ user, access, refresh }));
      navigate('/');
    } catch (error) {
      alert('Ошибка регистрации: проверьте правильность телефона');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input type="text" placeholder="Имя" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <input type="tel" value={phone} onChange={handlePhoneChange} placeholder="+996XXXXXXXXX" required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;