import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";

export const CartCheckout = () => {
  const navigate = useNavigate();
  // Локальное состояние корзины (моковые данные для демонстрации)
  const [cart, setCart] = useState([
    { id: 1, name: "Шашлык из говядины", price: 450, quantity: 2, image: "https://via.placeholder.com/80" },
    { id: 2, name: "Люля-кебаб", price: 350, quantity: 1, image: "https://via.placeholder.com/80" },
  ]);
  const [orderType, setOrderType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Online");

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    // Имитация заказа
    const orderId = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    alert(`Заказ ${orderId} успешно оформлен!`);
    navigate("/menu");
  };

  if (cart.length === 0) {
    return (
      <div className="bg-phoenix-dark min-h-screen flex flex-col items-center justify-center p-8 text-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-phoenix-gold mb-12 flex items-center gap-4">
          <Link to="/menu" className="text-phoenix-text-muted hover:text-phoenix-gold transition">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          Оформление заказа
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Левая колонка: товары */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-phoenix-card rounded-3xl p-6 sm:p-8 shadow-md border border-phoenix-gold/20">
              <h2 className="text-2xl font-bold text-phoenix-gold mb-8 pb-4 border-b border-phoenix-gold/20">
                Ваш заказ ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-6 items-center sm:items-start group">
                    <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover bg-stone-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-phoenix-text text-base sm:text-lg leading-tight truncate pr-2">
                          {item.name}
                        </h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-phoenix-text-muted hover:text-red-500 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-phoenix-text-muted mb-4">{item.price} сом / шт.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-phoenix-dark rounded-full border border-phoenix-gold/30 p-1">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-phoenix-card text-phoenix-gold hover:bg-phoenix-gold/20">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-phoenix-text text-sm">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-phoenix-card text-phoenix-gold hover:bg-phoenix-gold/20">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-bold text-phoenix-gold text-lg">{item.price * item.quantity} сом</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-phoenix-card/50 rounded-3xl p-6 border border-phoenix-gold/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-phoenix-gold mb-1">Хотите забронировать столик?</h3>
                <p className="text-phoenix-text-muted text-sm">Забронируйте столик заранее, чтобы мы подготовили всё к вашему приходу.</p>
              </div>
              <Link to="/reservation" className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-6 py-2.5 rounded-full font-bold text-sm transition whitespace-nowrap">
                Забронировать
              </Link>
            </div>
          </div>

          {/* Правая колонка: форма */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCheckout} className="bg-phoenix-card rounded-3xl p-6 sm:p-8 shadow-md border border-phoenix-gold/20 sticky top-28">
              <h2 className="text-2xl font-bold text-phoenix-gold mb-6 pb-4 border-b border-phoenix-gold/20">Детали заказа</h2>

              {/* Тип заказа */}
              <div className="flex bg-phoenix-dark p-1 rounded-2xl mb-8">
                <button type="button" onClick={() => setOrderType("Delivery")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${orderType === "Delivery" ? "bg-phoenix-gold text-phoenix-dark" : "text-phoenix-text-muted hover:text-phoenix-text"}`}>
                  Доставка
                </button>
                <button type="button" onClick={() => setOrderType("Pickup")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${orderType === "Pickup" ? "bg-phoenix-gold text-phoenix-dark" : "text-phoenix-text-muted hover:text-phoenix-text"}`}>
                  Самовывоз
                </button>
              </div>

              {/* Поля для доставки */}
              {orderType === "Delivery" && (
                <div className="space-y-4 mb-8">
                  <input type="text" required placeholder="Улица" className="w-full px-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Дом" className="w-full px-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                    <input type="text" placeholder="Квартира" className="w-full px-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                  </div>
                  <input type="text" placeholder="Комментарий курьеру" className="w-full px-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
                </div>
              )}

              {/* Способы оплаты */}
              <div className="mb-8">
                <h3 className="font-bold text-phoenix-text mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  {[
                    { id: "Online", label: "Онлайн-оплата картой (имитация)" },
                    { id: "Cash", label: "Наличными при получении" },
                    { id: "Card", label: "Картой при получении" },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition ${paymentMethod === method.id ? "border-phoenix-gold bg-phoenix-gold/10" : "border-phoenix-gold/30 hover:border-phoenix-gold/50"}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-phoenix-gold focus:ring-phoenix-gold" />
                      <span className="ml-3 font-medium text-phoenix-text">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Итого */}
              <div className="border-t border-phoenix-gold/20 pt-6 mb-8 space-y-3">
                <div className="flex justify-between text-phoenix-text-muted">
                  <span>Сумма заказа</span>
                  <span>{cartTotal} сом</span>
                </div>
                {orderType === "Delivery" && (
                  <div className="flex justify-between text-phoenix-text-muted">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-3">
                  <span className="font-bold text-phoenix-text text-lg">Итого</span>
                  <span className="font-extrabold text-3xl text-phoenix-gold">{cartTotal} сом</span>
                </div>
              </div>

              <button type="submit" className="w-full flex items-center justify-center bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light py-4 rounded-full font-bold text-lg transition shadow-lg">
                ОФОРМИТЬ ЗАКАЗ
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};