import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";

// Временная заглушка для корзины (пока нет Redux)
// Позже заменим на useSelector и useDispatch
const useCart = () => {
  const [cart, setCart] = useState([
    // для теста добавим один товар, чтобы корзина не была пустой
    { id: 1, name: "Шашлык", price: 450, quantity: 2, image: "https://via.placeholder.com/80" }
  ]);
  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { cart, updateCartQuantity, removeFromCart, cartTotal, setCart };
};

export const CartCheckout = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Online");

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      dateTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      customerName: "Current User",
      total: cartTotal,
      status: "New",
    };
    alert(`Заказ ${newOrder.id} успешно оформлен!`);
    navigate("/menu");
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-50 text-center min-h-[70vh]">
        <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 mb-4">Ваша корзина пуста</h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto text-lg">
          Добавьте несколько блюд из нашего меню, чтобы оформить заказ.
        </p>
        <Link to="/menu" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold">
          ПЕРЕЙТИ К МЕНЮ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-stone-900 mb-12 flex items-center gap-4">
          <Link to="/menu" className="text-stone-400 hover:text-stone-900">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          Оформление заказа
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Левая колонка: товары */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <h2 className="text-2xl font-bold text-stone-900 mb-8 pb-4 border-b border-stone-100">
                Ваш заказ ({cart.reduce((a,b)=>a+b.quantity,0)})
              </h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-6 items-center sm:items-start group">
                    <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover bg-stone-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-stone-900 text-base sm:text-lg">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-red-500">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-stone-500 mb-4">{item.price} сом / шт.</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-stone-100 rounded-full border border-stone-200 p-1">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-600">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-stone-900 text-sm">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-600">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-bold text-stone-900 text-lg">{item.price * item.quantity} сом</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-orange-900 mb-1">Хотите забронировать столик?</h3>
                <p className="text-orange-700 text-sm">Забронируйте заранее, чтобы мы подготовились.</p>
              </div>
              <Link to="/reservation" className="bg-white text-orange-600 border border-orange-200 px-6 py-2.5 rounded-full font-bold text-sm">Забронировать</Link>
            </div>
          </div>
          {/* Правая колонка: форма */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCheckout} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 sticky top-28">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 pb-4 border-b">Детали заказа</h2>
              <div className="flex bg-stone-100 p-1 rounded-2xl mb-8">
                <button type="button" onClick={() => setOrderType("Delivery")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${orderType === "Delivery" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>Доставка</button>
                <button type="button" onClick={() => setOrderType("Pickup")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${orderType === "Pickup" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>Самовывоз</button>
              </div>
              {orderType === "Delivery" && (
                <div className="space-y-4 mb-8">
                  <input type="text" required placeholder="Улица" className="w-full px-4 py-3 rounded-xl border border-stone-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Дом" className="w-full px-4 py-3 rounded-xl border" />
                    <input type="text" placeholder="Квартира" className="w-full px-4 py-3 rounded-xl border" />
                  </div>
                  <input type="text" placeholder="Комментарий курьеру" className="w-full px-4 py-3 rounded-xl border" />
                </div>
              )}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Способ оплаты</h3>
                <div className="space-y-3">
                  {[
                    { id: "Online", label: "Онлайн-оплата картой" },
                    { id: "Cash", label: "Наличными при получении" },
                    { id: "Card", label: "Картой при получении" }
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center p-4 border rounded-2xl cursor-pointer ${paymentMethod === method.id ? "border-orange-600 bg-orange-50" : "border-stone-200"}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-600" />
                      <span className="ml-3 font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t pt-6 mb-8">
                <div className="flex justify-between text-stone-500"><span>Сумма заказа</span><span>{cartTotal} ₽</span></div>
                {orderType === "Delivery" && <div className="flex justify-between text-stone-500"><span>Доставка</span><span>Бесплатно</span></div>}
                <div className="flex justify-between items-end pt-3"><span className="font-bold text-lg">Итого</span><span className="font-extrabold text-3xl">{cartTotal} сом</span></div>
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-full font-bold text-lg">ОФОРМИТЬ ЗАКАЗ <ArrowRight className="inline ml-2" /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

