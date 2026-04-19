import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast, { Toaster } from 'react-hot-toast';
import DishModal from "../components/DishModal";

const DishCard = ({ dish, onClick }) => (
  <div onClick={() => onClick(dish)} className="bg-phoenix-card rounded-xl shadow-md overflow-hidden transition hover:scale-105 hover:shadow-xl border border-phoenix-gold/20 cursor-pointer">
    <img src={dish.image_url || "https://via.placeholder.com/300x200"} alt={dish.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-xl text-phoenix-text">{dish.name}</h3>
      <p className="text-phoenix-text-muted text-sm mt-1 line-clamp-2">{dish.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-phoenix-gold text-lg">{dish.price} сом</span>
        <button className="bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light px-4 py-2 rounded-full text-sm font-bold transition" onClick={(e) => { e.stopPropagation(); }}>В корзину</button>
      </div>
    </div>
  </div>
);

const CATEGORIES = ["Все", "Рекомендация", "Восточные", "Пицца", "Шашлык", "Напитки"];

export const Menu = () => {
  const { addToCart } = useAppContext();
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.get('/menu/dishes/');
        setMenuItems(res.data);
      } catch (err) {
        console.error("Ошибка загрузки меню", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const handleAddToCart = (dish) => {
    addToCart(dish);
    toast.success(`"${dish.name}" добавлено в корзину`, {
      position: 'bottom-right',
      duration: 2000,
      style: { background: '#fbbf24', color: '#1a1a1a' },
    });
  };

  const handleCardClick = (dish) => {
    setSelectedDish(dish);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "Все" || item.category_name === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка меню...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-phoenix-gold mb-2 tracking-tight">Наше Меню</h1>
            <p className="text-phoenix-text-muted text-lg max-w-xl">Откройте для себя богатство вкусов, созданных с любовью и страстью нашими поварами.</p>
          </div>
          <div className="relative w-full md:w-72">
            <input type="text" placeholder="Поиск блюд..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-full border border-phoenix-gold/30 bg-phoenix-card text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold" />
            <Search className="w-5 h-5 text-phoenix-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="sticky top-20 z-40 bg-phoenix-dark/95 backdrop-blur-md py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-phoenix-gold/20">
          <div className="flex overflow-x-auto hide-scrollbar justify-start md:flex-wrap md:justify-start items-center space-x-2 md:space-x-3 gap-y-3 pb-2">
            {CATEGORIES.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${activeCategory === category ? "bg-phoenix-gold text-phoenix-dark" : "bg-phoenix-card text-phoenix-text-muted hover:bg-phoenix-gold/20 border border-phoenix-gold/30"}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {filteredItems.map(dish => (
              <DishCard key={dish.id} dish={dish} onClick={handleCardClick} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-phoenix-card rounded-3xl border border-phoenix-gold/20 shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-phoenix-dark rounded-full mb-6"><Search className="w-8 h-8 text-phoenix-text-muted" /></div>
            <h3 className="text-2xl font-bold text-phoenix-text mb-2">Блюда не найдены</h3>
            <p className="text-phoenix-text-muted">Попробуйте изменить категорию или поисковый запрос</p>
            <button onClick={() => { setActiveCategory("Все"); setSearchQuery(""); }} className="mt-6 text-phoenix-gold font-bold hover:text-phoenix-gold-light underline underline-offset-4">Сбросить фильтры</button>
          </div>
        )}
      </div>

      {selectedDish && (
        <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
};