import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export const Reservation = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/reservations/zones/").then(res => {
      setZones(res.data);
      if (res.data.length) setSelectedZone(res.data[0].id);
    }).catch(err => console.error("Ошибка зон:", err));
  }, []);

  useEffect(() => {
    if (!selectedZone) return;
    api.get(`/reservations/tables/?zone_id=${selectedZone}`).then(res => {
      setTables(res.data);
      setSelectedTable(null);
    }).catch(err => console.error("Ошибка столов:", err));
  }, [selectedZone]);

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      alert("Выберите стол");
      return;
    }
    setLoading(true);
    try {
      const start = new Date(`2000-01-01T${time}:00`);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const endTime = end.toTimeString().slice(0, 5);
      const payload = {
        table: selectedTable,
        date,
        start_time: time,
        end_time: endTime,
        guests,
        comment: requests,
      };
      const response = await api.post("/reservations/reservations/", payload);
      alert(`Бронь ${response.data.id} создана`);
      navigate("/");
    } catch (error) {
      alert(error.response?.status === 409 ? "Стол уже занят" : "Ошибка бронирования");
    } finally {
      setLoading(false);
    }
  };

  if (!zones.length) return <div className="text-center py-12 text-phoenix-text">Загрузка зон...</div>;

  return (
    <div className="bg-phoenix-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/" className="text-phoenix-text-muted hover:text-phoenix-gold transition">
            <ArrowLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-phoenix-gold">Бронь стола</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Левая колонка: зоны и столы */}
          <div className="space-y-8">
            {/* Зоны */}
            <div className="bg-phoenix-card rounded-3xl p-6 shadow-md border border-phoenix-gold/20">
              <h3 className="text-xl font-bold text-phoenix-gold mb-6">1. Выберите зону</h3>
              <div className="flex flex-wrap gap-3">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedZone === zone.id
                        ? "bg-phoenix-gold text-phoenix-dark shadow-md"
                        : "bg-phoenix-dark text-phoenix-text-muted hover:bg-phoenix-gold/20 border border-phoenix-gold/30"
                    }`}
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Столы */}
            <div className="bg-phoenix-card rounded-3xl p-6 shadow-md border border-phoenix-gold/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-phoenix-gold">2. Выберите столик</h3>
                <div className="flex gap-4 text-xs font-medium text-phoenix-text-muted">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>Свободен
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>Занят
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tables.map(table => {
                  // Временно все столы считаем свободными, позже добавим проверку доступности
                  const isAvailable = true; // TODO: получать с бэка
                  return (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      disabled={!isAvailable}
                      className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                        !isAvailable
                          ? "border-red-500/50 bg-red-500/10 text-stone-400 cursor-not-allowed"
                          : selectedTable === table.id
                          ? "border-phoenix-gold bg-phoenix-gold/20 shadow-md scale-105"
                          : "border-green-500/50 bg-phoenix-dark hover:border-phoenix-gold/50 hover:bg-phoenix-gold/10"
                      }`}
                    >
                      <span className="font-bold text-lg text-phoenix-text">Стол {table.number}</span>
                      <span className="text-sm text-phoenix-text-muted mt-1">{table.capacity} мест</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Правая колонка: форма деталей */}
          <div className="bg-phoenix-card rounded-3xl p-6 shadow-md border border-phoenix-gold/20 sticky top-28">
            <h3 className="text-xl font-bold text-phoenix-gold mb-6 pb-4 border-b border-phoenix-gold/20">3. Детали бронирования</h3>
            <form onSubmit={handleReservation} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-phoenix-text mb-2">Дата</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      min={format(new Date(), "yyyy-MM-dd")}
                      max={format(addDays(new Date(), 30), "yyyy-MM-dd")}
                      onChange={e => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                    />
                    <Calendar className="w-5 h-5 text-phoenix-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-phoenix-text mb-2">Время</label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={time}
                      min="10:00"
                      max="22:00"
                      onChange={e => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                    />
                    <Clock className="w-5 h-5 text-phoenix-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-phoenix-text mb-2">Количество гостей</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={guests}
                    onChange={e => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold"
                  />
                  <Users className="w-5 h-5 text-phoenix-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-phoenix-text mb-2">Особые пожелания (необязательно)</label>
                <textarea
                  rows={3}
                  value={requests}
                  onChange={e => setRequests(e.target.value)}
                  placeholder="Например: детский стульчик, аллергия..."
                  className="w-full p-4 rounded-xl border border-phoenix-gold/30 bg-phoenix-dark text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-gold resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!selectedTable || loading}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                  selectedTable && !loading
                    ? "bg-phoenix-gold text-phoenix-dark hover:bg-phoenix-gold-light shadow-lg"
                    : "bg-phoenix-dark border border-phoenix-gold/30 text-phoenix-text-muted cursor-not-allowed"
                }`}
              >
                {loading ? "Обработка..." : "ПОДТВЕРДИТЬ БРОНЬ"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};