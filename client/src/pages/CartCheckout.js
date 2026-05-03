import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import api from "../api/api";
import toast, { Toaster } from 'react-hot-toast';

export const CartCheckout = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useAppContext();
  const [orderType, setOrderType] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const MIN_ORDER_SUM = 500; // минимальная сумма заказа

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Проверка минимальной суммы
    if (cartTotal < MIN_ORDER_SUM) {
      toast.error(`Минимальная сумма заказа – ${MIN_ORDER_SUM} сом. Добавьте ещё блюд.`, {
        position: 'bottom-right',
        style: { background: '#fbbf24', color: '#1a1a1a' },
      });
      return;
    }
    
    // Валидация полей для онлайн-оплаты
    if (paymentMethod === "Online") {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Введите номер карты (16 цифр)", { position: 'bottom-right', style: { background: '#fbbf24', color: '#1a1a1a' } });
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error("Введите срок действия (ММ/ГГ)", { position: 'bottom-right', style: { background: '#fbbf24', color: '#1a1a1a' } });
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        toast.error("Введите CVV код (3 цифры)", { position: 'bottom-right', style: { background: '#fbbf24', color: '#1a1a1a' } });
        return;
      }
      if (!cardHolder) {
        toast.error("Введите имя на карте (латиницей)", { position: 'bottom-right', style: { background: '#fbbf24', color: '#1a1a1a' } });
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        delivery_type: orderType,
        delivery_address: orderType === "Delivery" ? `${address}, д.${house}, кв.${apartment}` : "",
        comment: comment,
      };
      const response = await api.post('/orders/', payload);
      
      if (paymentMethod === "Online") {
        toast.success(`Оплата прошла успешно! Заказ ${response.data.id} оформлен.`, {
          position: 'bottom-right',
          duration: 4000,
          style: { background: '#fbbf24', color: '#1a1a1a' },
        });
      } else if (paymentMethod === "BankTransfer") {
        toast.success(`Заказ ${response.data.id} оформлен. Оплатите переводом при получении.`, {
          position: 'bottom-right',
          duration: 4000,
          style: { background: '#fbbf24', color: '#1a1a1a' },
        });
      } else {
        toast.success(`Заказ ${response.data.id} успешно оформлен!`, {
          position: 'bottom-right',
          duration: 4000,
          style: { background: '#fbbf24', color: '#1a1a1a' },
        });
      }
      clearCart();
      navigate('/profile');
    } catch (error) {
      console.error("Ошибка оформления заказа", error);
      toast.error("Ошибка оформления заказа. Попробуйте позже.", {
        position: 'bottom-right',
        style: { background: '#fbbf24', color: '#1a1a1a' },
      });
    } finally {
      setLoading(false);
    }
  };

  // форматирование номера карты (оставляем как было)
  const formatCardNumber = (value) => {
  if (!value) return '';  // защита от null/undefined
  const v = String(value).replace(/\s/g, '').replace(/[^0-9]/g, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0; i < match.length; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) return parts.join(' ');
  return value;
};

  const handleCardNumberChange = (e) => {
  const value = e.target.value || '';  // защита от null
  const formatted = formatCardNumber(value);
  setCardNumber(formatted);
};
  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setCardExpiry(value);
  };
  const handleCardCvvChange = (e) => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3));

  if (cart.length === 0) {
    return (
      <div className="bg-phoenix-dark min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <Toaster />
        <div className="w-24 h-24 bg-phoenix-gold/20 text-phoenix-gold rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-phoenix-text mb-4">Ваша корзина пуста</h2>
        <p className="text-phoenix-text-muted mb-8 max-w-md mx-auto text-lg">Добавьте несколько блюд из нашего меню, чтобы оформить заказ.</p>
        <Link to="/menu" className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-8 py-4 rounded-full font-bold transition">ПЕРЕЙТИ К МЕНЮ</Link>
      </div>
    );
  }

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-phoenix-gold mb-8 flex items-center gap-4">
          <Link to="/menu" className="text-phoenix-text-muted hover:text-phoenix-gold transition">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          Оформление заказа
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Левая колонка: товары – теперь имеет одинаковую высоту с правой */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-phoenix-card rounded-3xl p-6 sm:p-8 shadow-md border border-phoenix-gold/20 flex-grow">
              <h2 className="text-2xl font-bold text-phoenix-gold mb-6 pb-4 border-b border-phoenix-gold/20">
                Ваш заказ ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center group">
                    <img src={item.image_url || "https://via.placeholder.com/80"} alt={item.name} className="w-20 h-20 rounded-2xl object-cover bg-stone-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-phoenix-text text-base sm:text-lg truncate pr-2">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-phoenix-text-muted hover:text-red-500 transition flex-shrink-0 ml-2"><Trash2 className="w-5 h-5" /></button>
                      </div>
                      <p className="text-sm text-phoenix-text-muted mt-1">{item.price} сом / шт.</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-phoenix-dark rounded-full border border-phoenix-gold/30 p-1">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-phoenix-card text-phoenix-gold hover:bg-phoenix-gold/20"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-8 text-center font-bold text-phoenix-text text-sm">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-phoenix-card text-phoenix-gold hover:bg-phoenix-gold/20"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="font-bold text-phoenix-gold">{item.price * item.quantity} сом</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 bg-phoenix-card/50 rounded-3xl p-5 border border-phoenix-gold/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div><h3 className="font-bold text-phoenix-gold">Забронировать столик?</h3><p className="text-phoenix-text-muted text-xs">Выберите удобное время онлайн</p></div>
              <Link to="/reservation" className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-5 py-2 rounded-full font-bold text-sm transition whitespace-nowrap">Забронировать</Link>
            </div>
          </div>

          {/* Правая колонка: форма */}
          <div className="lg:col-span-5">
            <div className="bg-phoenix-card rounded-3xl p-6 sm:p-8 shadow-md border border-phoenix-gold/20 sticky top-28">
              <h2 className="text-2xl font-bold text-phoenix-gold mb-6 pb-4 border-b border-phoenix-gold/20">Детали заказа</h2>

              {/* Предупреждение о минимальной сумме */}
              {cartTotal < MIN_ORDER_SUM && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-sm text-center">
                  Минимальная сумма заказа: {MIN_ORDER_SUM} сом. Добавьте ещё блюд.
                </div>
              )}

              {/* Тип доставки */}
              <div className="flex bg-phoenix-dark p-1 rounded-2xl mb-8">
                <button type="button" onClick={() => setOrderType("Delivery")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${orderType === "Delivery" ? "bg-phoenix-gold text-phoenix-dark" : "text-phoenix-text-muted hover:text-phoenix-text"}`}>Доставка</button>
                <button type="button" onClick={() => setOrderType("Pickup")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${orderType === "Pickup" ? "bg-phoenix-gold text-phoenix-dark" : "text-phoenix-text-muted hover:text-phoenix-text"}`}>Самовывоз</button>
              </div>

              {orderType === "Delivery" && (
                <div className="space-y-4 mb-8">
                  <input type="text" required placeholder="Улица" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Дом" value={house} onChange={e => setHouse(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                    <input type="text" placeholder="Квартира" value={apartment} onChange={e => setApartment(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                  </div>
                  <input type="text" placeholder="Комментарий курьеру" value={comment} onChange={e => setComment(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                </div>
              )}

              {/* Способы оплаты */}
              <div className="mb-8">
                <h3 className="font-bold text-phoenix-text mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "Online" ? "border-phoenix-gold bg-phoenix-gold/10" : "border-phoenix-gold/30 hover:border-phoenix-gold/50"}`}>
                    <input type="radio" name="payment" value="Online" checked={paymentMethod === "Online"} onChange={() => setPaymentMethod("Online")} className="w-5 h-5 mt-0.5 text-phoenix-gold" />
                    <div className="ml-3"><span className="font-medium text-phoenix-text">Онлайн-оплата картой</span><p className="text-xs text-phoenix-text-muted">Visa, Mastercard, МИР</p></div>
                  </label>
                  <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "Cash" ? "border-phoenix-gold bg-phoenix-gold/10" : "border-phoenix-gold/30 hover:border-phoenix-gold/50"}`}>
                    <input type="radio" name="payment" value="Cash" checked={paymentMethod === "Cash"} onChange={() => setPaymentMethod("Cash")} className="w-5 h-5 mt-0.5 text-phoenix-gold" />
                    <div className="ml-3"><span className="font-medium text-phoenix-text">Наличными при получении</span></div>
                  </label>
                  <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === "BankTransfer" ? "border-phoenix-gold bg-phoenix-gold/10" : "border-phoenix-gold/30 hover:border-phoenix-gold/50"}`}>
                    <input type="radio" name="payment" value="BankTransfer" checked={paymentMethod === "BankTransfer"} onChange={() => setPaymentMethod("BankTransfer")} className="w-5 h-5 mt-0.5 text-phoenix-gold" />
                    <div className="ml-3"><span className="font-medium text-phoenix-text">Переводом при получении</span><p className="text-xs text-phoenix-text-muted">Mbank, Simbank, Bakai Bank и другие</p></div>
                  </label>
                </div>
              </div>

              {/* Форма для онлайн-оплаты */}
              {paymentMethod === "Online" && (
                <div className="mb-8 p-5 bg-phoenix-dark rounded-xl border border-phoenix-gold/20">
                  <h3 className="font-bold text-phoenix-gold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Данные карты</h3>
                  <div className="space-y-4">
                    <div><label className="block text-xs text-phoenix-text-muted mb-1">Номер карты</label><input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={handleCardNumberChange} maxLength="19" className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-card text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs text-phoenix-text-muted mb-1">Срок (ММ/ГГ)</label><input type="text" placeholder="12/28" value={cardExpiry} onChange={handleCardExpiryChange} maxLength="5" className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-card text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" /></div>
                      <div><label className="block text-xs text-phoenix-text-muted mb-1">CVV</label><input type="text" placeholder="123" value={cardCvv} onChange={handleCardCvvChange} maxLength="3" className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-card text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" /></div>
                    </div>
                    <div><label className="block text-xs text-phoenix-text-muted mb-1">Имя на карте (латиницей)</label><input type="text" placeholder="MASSANOV SALIMKHAN" value={cardHolder} onChange={e => setCardHolder(e.target.value.toUpperCase())} className="w-full px-4 py-2.5 rounded-xl border border-phoenix-gold/30 bg-phoenix-card text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" /></div>
                  </div>
                </div>
              )}

              {/* Итого */}
              <div className="border-t border-phoenix-gold/20 pt-6 mb-8 space-y-3">
                <div className="flex justify-between text-phoenix-text-muted"><span>Сумма заказа</span><span>{cartTotal} сом</span></div>
                {orderType === "Delivery" && <div className="flex justify-between text-phoenix-text-muted"><span>Доставка</span><span>Бесплатно</span></div>}
                <div className="flex justify-between items-end pt-3"><span className="font-bold text-phoenix-text text-lg">Итого</span><span className="font-extrabold text-3xl text-phoenix-gold">{cartTotal} сом</span></div>
              </div>

              <button type="submit" disabled={loading || cartTotal < MIN_ORDER_SUM} onClick={handleCheckout} className="w-full flex items-center justify-center bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light py-4 rounded-full font-bold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Обработка..." : "ОФОРМИТЬ ЗАКАЗ"} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              {cartTotal < MIN_ORDER_SUM && (
                <p className="text-center text-xs text-red-400 mt-2">Добавьте блюд на сумму от {MIN_ORDER_SUM} сом</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};