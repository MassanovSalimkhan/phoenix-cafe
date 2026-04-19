import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Coffee, Users, Utensils } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-phoenix-dark">
      {/* Hero-секция с фоновым изображением */}
      <div className="relative h-[60vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/about-bg.jpg)' }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">О нас</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">История, традиции и любовь к гостям</p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-phoenix-gold mb-4">Наша история</h2>
            <p className="text-phoenix-text-muted leading-relaxed">
              Кафе "Феникс" открыло свои двери в 2025 году. Название символизирует возрождение и стремление к совершенству. 
              Мы начинали с небольшой шашлычной, а сегодня это уютное заведение, где каждый гость чувствует себя желанным.
            </p>
            <p className="text-phoenix-text-muted leading-relaxed mt-4">
              Наша команда – это профессионалы, которые вкладывают душу в каждое блюдо. Мы используем только свежие продукты, 
              готовим с любовью и всегда рады новым гостям.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-phoenix-gold/20">
            <img src="/about-interior.jpg" alt="Интерьер кафе" className="w-full h-auto" />
          </div>
        </div>

        {/* Преимущества (три колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-phoenix-card p-6 rounded-2xl border border-phoenix-gold/20">
            <Utensils className="w-12 h-12 text-phoenix-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-phoenix-text mb-2">Авторская кухня</h3>
            <p className="text-phoenix-text-muted">Блюда восточной и европейской кухни от наших поваров</p>
          </div>
          <div className="text-center bg-phoenix-card p-6 rounded-2xl border border-phoenix-gold/20">
            <Coffee className="w-12 h-12 text-phoenix-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-phoenix-text mb-2">Уютная атмосфера</h3>
            <p className="text-phoenix-text-muted">Интерьер, располагающий к отдыху и приятным беседам</p>
          </div>
          <div className="text-center bg-phoenix-card p-6 rounded-2xl border border-phoenix-gold/20">
            <Users className="w-12 h-12 text-phoenix-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-phoenix-text mb-2">Доступные цены</h3>
            <p className="text-phoenix-text-muted">Оптимальное соотношение цены и качества</p>
          </div>
        </div>

        {/* Видео-секция (можно заменить на карусель фото) */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <img src="/about-kitchen.jpg" alt="Наша кухня" className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-phoenix-dark to-transparent flex items-end justify-center p-8">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Загляните на нашу кухню</h3>
              <p className="text-phoenix-text-muted">Мы готовим с душой</p>
            </div>
          </div>
        </div>

        {/* Цитата или миссия */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Star className="w-12 h-12 text-phoenix-gold mx-auto mb-4" />
          <p className="text-2xl italic text-phoenix-text">"Мы создаём не просто еду, мы создаём впечатления. Каждый гость для нас – часть семьи."</p>
          <p className="mt-4 text-phoenix-gold font-semibold">— Шеф-повар кафе "Феникс"</p>
        </div>

        {/* Кнопка перехода в меню */}
        <div className="text-center">
          <Link to="/menu" className="inline-block bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-8 py-4 rounded-full font-bold text-lg transition shadow-lg">
            Посмотреть меню
          </Link>
        </div>
      </div>
    </div>
  );
};