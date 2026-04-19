import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDish, setEditingDish] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', weight: '', category: '', image_url: '', is_available: true });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', sort_order: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, dishesRes] = await Promise.all([
        api.get('/menu/categories/'),
        api.get('/menu/dishes/')
      ]);
      setCategories(catsRes.data);
      setDishes(dishesRes.data);
    } catch (err) {
      console.error('Ошибка загрузки', err);
      toast.error('Не удалось загрузить меню');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, current) => {
    try {
      await api.patch(`/menu/dishes/${id}/`, { is_available: !current });
      setDishes(prev => prev.map(d => d.id === id ? { ...d, is_available: !current } : d));
      toast.success(`Видимость изменена`);
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const deleteDish = async (id) => {
    if (!window.confirm('Удалить блюдо?')) return;
    try {
      await api.delete(`/menu/dishes/${id}/`);
      setDishes(prev => prev.filter(d => d.id !== id));
      toast.success('Блюдо удалено');
    } catch (err) {
      toast.error('Ошибка удаления');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Удалить категорию? Все блюда в ней тоже удалятся!')) return;
    try {
      await api.delete(`/menu/categories/${id}/`);
      fetchData();
      toast.success('Категория удалена');
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  const saveDish = async (e) => {
    e.preventDefault();
    try {
      if (editingDish) {
        await api.put(`/menu/dishes/${editingDish}/`, formData);
        toast.success('Блюдо обновлено');
      } else {
        await api.post('/menu/dishes/', formData);
        toast.success('Блюдо добавлено');
      }
      setEditingDish(null);
      setFormData({ name: '', description: '', price: '', weight: '', category: '', image_url: '', is_available: true });
      fetchData();
    } catch (err) {
      toast.error('Ошибка сохранения');
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/menu/categories/${editingCategory}/`, categoryForm);
        toast.success('Категория обновлена');
      } else {
        await api.post('/menu/categories/', categoryForm);
        toast.success('Категория добавлена');
      }
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', sort_order: 0 });
      fetchData();
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  if (loading) return <div className="bg-phoenix-dark min-h-screen flex items-center justify-center text-phoenix-text">Загрузка...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-phoenix-gold">Управление меню</h1>
          <button onClick={fetchData} className="bg-phoenix-card border border-phoenix-gold/30 rounded-xl p-2 text-phoenix-gold"><RefreshCw className="w-5 h-5" /></button>
        </div>

        {/* Категории */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-phoenix-text mb-4">Категории</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-phoenix-card rounded-xl p-3 flex items-center gap-3 border border-phoenix-gold/20">
                <span className="text-phoenix-text">{cat.name}</span>
                <button onClick={() => { setEditingCategory(cat.id); setCategoryForm({ name: cat.name, description: cat.description, sort_order: cat.sort_order }); }} className="text-phoenix-gold hover:bg-phoenix-gold/20 p-1 rounded"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-400 hover:bg-red-500/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => setEditingCategory('new')} className="bg-phoenix-gold text-phoenix-dark px-4 py-2 rounded-full flex items-center gap-1"><Plus className="w-4 h-4" /> Добавить категорию</button>
          </div>
          {(editingCategory === 'new' || editingCategory) && (
            <form onSubmit={saveCategory} className="bg-phoenix-card p-5 rounded-2xl border border-phoenix-gold/20 mt-4">
              <input type="text" placeholder="Название" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full mb-3 px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" required />
              <textarea placeholder="Описание" value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full mb-3 px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" rows={2} />
              <input type="number" placeholder="Порядок сортировки" value={categoryForm.sort_order} onChange={e => setCategoryForm({...categoryForm, sort_order: parseInt(e.target.value)})} className="w-full mb-3 px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" />
              <div className="flex gap-3">
                <button type="submit" className="bg-phoenix-gold text-phoenix-dark px-4 py-2 rounded-full">Сохранить</button>
                <button type="button" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '', sort_order: 0 }); }} className="bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text px-4 py-2 rounded-full">Отмена</button>
              </div>
            </form>
          )}
        </div>

        {/* Блюда */}
        <div>
          <h2 className="text-2xl font-bold text-phoenix-text mb-4">Блюда</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map(dish => (
              <div key={dish.id} className="bg-phoenix-card rounded-xl p-4 border border-phoenix-gold/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-phoenix-text">{dish.name}</h3>
                    <p className="text-sm text-phoenix-text-muted">{dish.category_name}</p>
                    <p className="text-phoenix-gold font-bold mt-1">{dish.price} сом</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleAvailability(dish.id, dish.is_available)} className="text-phoenix-text-muted hover:text-phoenix-gold">
                      {dish.is_available ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button onClick={() => { setEditingDish(dish.id); setFormData({ name: dish.name, description: dish.description, price: dish.price, weight: dish.weight, category: dish.category, image_url: dish.image_url || '', is_available: dish.is_available }); }} className="text-phoenix-gold"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => deleteDish(dish.id)} className="text-red-400"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setEditingDish('new')} className="bg-phoenix-card border border-dashed border-phoenix-gold/40 rounded-xl p-4 flex items-center justify-center text-phoenix-gold hover:bg-phoenix-gold/10"><Plus className="w-5 h-5 mr-2" /> Добавить блюдо</button>
          </div>
        </div>
      </div>

      {/* Модалка редактирования блюда */}
      {(editingDish === 'new' || editingDish) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => { setEditingDish(null); setFormData({ name: '', description: '', price: '', weight: '', category: '', image_url: '', is_available: true }); }}>
          <div className="bg-phoenix-card rounded-2xl max-w-md w-full p-6 border border-phoenix-gold/20" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-phoenix-gold mb-4">{editingDish === 'new' ? 'Новое блюдо' : 'Редактировать блюдо'}</h3>
            <form onSubmit={saveDish} className="space-y-4">
              <input type="text" placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" required />
              <textarea placeholder="Описание" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" rows={3} />
              <input type="number" step="0.01" placeholder="Цена (сом)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" required />
              <input type="text" placeholder="Вес (г)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" required>
                <option value="">Выберите категорию</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <input type="url" placeholder="URL изображения" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text" />
              <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_available} onChange={e => setFormData({...formData, is_available: e.target.checked})} /><span className="text-phoenix-text">Доступно в меню</span></div>
              <div className="flex gap-3">
                <button type="submit" className="bg-phoenix-gold text-phoenix-dark px-4 py-2 rounded-full">Сохранить</button>
                <button type="button" onClick={() => { setEditingDish(null); setFormData({ name: '', description: '', price: '', weight: '', category: '', image_url: '', is_available: true }); }} className="bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text px-4 py-2 rounded-full">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};