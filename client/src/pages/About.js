import React from 'react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-phoenix-card rounded-3xl p-8 shadow-md border border-phoenix-gold/20">
          <h1 className="text-4xl font-bold text-phoenix-gold mb-6 text-center">О нас</h1>
          <div className="space-y-6 text-phoenix-text">
            <p className="text-lg leading-relaxed">
              Кафе <span className="text-phoenix-gold font-semibold">"Феникс"</span> – это место, где восточные традиции встречаются с европейским комфортом. 
              Мы создали пространство, в котором каждый гость чувствует себя особенным.
            </p>
            <p className="text-lg leading-relaxed">
              Наша история началась с любви к вкусной еде и желания дарить людям радость. 
              Сегодня "Феникс" – это уютный зал на 112 мест, летняя терраса и отдельные тапчаны для больших компаний.
            </p>
            <div className="bg-phoenix-gold/10 p-6 rounded-xl border-l-4 border-phoenix-gold">
              <h3 className="text-xl font-bold text-phoenix-gold mb-2">Наша фишка</h3>
              <p className="text-phoenix-text-muted">
                Интерактивная карта столов для бронирования – вы выбираете любой свободный столик онлайн, как в кинотеатре. 
                Приходите к нам, бронируйте заранее и наслаждайтесь атмосферой!
              </p>
            </div>
            <p className="text-lg leading-relaxed">
              Мы работаем для вас ежедневно с 10:00 до 23:00. Ждём вас по адресу: г. Токмок, ул. Афанасьева, 1/а.
            </p>
          </div>
          <div className="mt-8 text-center">
            <Link to="/menu" className="inline-block bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-6 py-3 rounded-full font-bold transition">
              Посмотреть меню
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};