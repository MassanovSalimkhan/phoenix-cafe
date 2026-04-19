import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Coffee, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';


export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: 'акция', description: 'акция!', image: '/promo1.jpg' },
    { id: 2, title: 'Бесплатная доставка', description: 'При заказе от 1500 сомов', image: '/promo2.jpg' },
    { id: 3, title: '', description: 'акция!', image: '/promo3.jpg' },
  ];

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000);
  return () => clearInterval(interval);
}, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="bg-phoenix-dark text-phoenix-text">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Почувствуйте насыщенный вкус высококачественной еды</h1>
          <Link to="/menu">
            <button className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-8 py-4 rounded-full font-bold text-lg transition">НАЗАД К МЕНЮ</button>
          </Link>
        </div>
      </section>

      {/* О нас */}
      <section className="py-20 max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 text-phoenix-gold">О нас</h2>
        <p className="text-lg text-phoenix-text-muted max-w-3xl mx-auto">
          Кафе "Феникс" – это уютное место, где вы можете насладиться блюдами восточной и европейской кухни. 
          Наша фишка – интерактивная карта столов для бронирования, как в кинотеатре. 
          Приходите к нам за качественной едой и приятной атмосферой.
        </p>
      </section>

      {/* Слайдер акций */}
      <section className="py-16 max-w-6xl mx-auto px-4">
  <h2 className="text-4xl font-bold mb-8 text-center text-phoenix-gold">Акции</h2>
  <div className="relative">
    <div className="overflow-hidden rounded-xl">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-64 md:h-96">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center p-4">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
              <p className="text-lg">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"><ChevronLeft className="w-6 h-6" /></button>
    <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"><ChevronRight className="w-6 h-6" /></button>
  </div>
  <div className="flex justify-center mt-4 space-x-2">
    {slides.map((_, idx) => (
      <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition ${currentSlide === idx ? 'bg-phoenix-gold' : 'bg-phoenix-text-muted'}`} />
    ))}
  </div>
</section>

      {/* Преимущества */}
      <section className="py-16 bg-phoenix-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-phoenix-gold/20 inline-flex p-4 rounded-full mb-4"><Star className="w-8 h-8 text-phoenix-gold" /></div>
              <h3 className="text-xl font-bold mb-2">Высокое качество</h3>
              <p className="text-phoenix-text-muted">Только свежие продукты и авторские рецепты.</p>
            </div>
            <div className="text-center">
              <div className="bg-phoenix-gold/20 inline-flex p-4 rounded-full mb-4"><Coffee className="w-8 h-8 text-phoenix-gold" /></div>
              <h3 className="text-xl font-bold mb-2">Уютная атмосфера</h3>
              <p className="text-phoenix-text-muted">Интерьер для отдыха и приятных бесед.</p>
            </div>
            <div className="text-center">
              <div className="bg-phoenix-gold/20 inline-flex p-4 rounded-full mb-4"><MapPin className="w-8 h-8 text-phoenix-gold" /></div>
              <h3 className="text-xl font-bold mb-2">Удобное бронирование</h3>
              <p className="text-phoenix-text-muted">Выбирайте любой свободный столик онлайн.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Интерактивная карта проезда */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center text-phoenix-gold">Как нас найти</h2>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="Карта проезда"
            src="https://yandex.ru/map-widget/v1/?ll=75.2910,42.8400&z=17&text=Кыргызская%201а%20Токмок"
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
            className="w-full"
          ></iframe>
        </div>
        <p className="text-center text-phoenix-text-muted mt-4">г. Токмок, ул. Афанасьева, 1/а</p>
      </section>

      {/* Контакты */}
      <section className="bg-phoenix-card py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 text-phoenix-gold">Контакты</h2>
        <p className="text-lg text-phoenix-text-muted">📍 г. Токмок, ул. Афанасьева, 1/а</p>
        <p className="text-lg text-phoenix-text-muted">📞 +996 557 555 466</p>
        <p className="text-lg text-phoenix-text-muted">🕒 Часы работы: 10:00 – 23:00</p>
      </section>
    </div>
  );
};