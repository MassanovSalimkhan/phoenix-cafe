import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, Lock, UserPlus } from 'lucide-react';
import api from '../api/api';
import { setCredentials } from '../store/authSlice';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+996');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith('+996')) value = '+996';
    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    try {
      const response = await api.post('users/register/', {
        full_name: fullName,
        phone,
        email,
        password,
      });
      const { access, refresh, user } = response.data;
      dispatch(setCredentials({ user, access, refresh }));
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации. Возможно, телефон уже используется.');
    }
  };

  return (
    <div className="min-h-screen bg-phoenix-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-phoenix-card p-8 rounded-2xl shadow-xl border border-phoenix-gold/20">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-phoenix-gold">Регистрация</h2>
          <p className="mt-2 text-center text-sm text-phoenix-text-muted">
            Создайте аккаунт в кафе "Феникс"
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-text-muted w-5 h-5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text placeholder:text-phoenix-text-muted focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                placeholder="Ваше имя"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-text-muted w-5 h-5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text placeholder:text-phoenix-text-muted focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                placeholder="+996 XXX XXX XXX"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-text-muted w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text placeholder:text-phoenix-text-muted focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                placeholder="Email (необязательно)"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-text-muted w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text placeholder:text-phoenix-text-muted focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                placeholder="Пароль (минимум 6 символов)"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-phoenix-text-muted w-5 h-5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text placeholder:text-phoenix-text-muted focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                placeholder="Подтвердите пароль"
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-phoenix-dark bg-phoenix-gold hover:bg-phoenix-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-phoenix-gold transition"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Зарегистрироваться
          </button>
          <div className="text-center">
            <Link to="/login" className="text-sm text-phoenix-gold hover:underline">
              Уже есть аккаунт? Войдите
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;