import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { CartCheckout } from './pages/CartCheckout';
import { Reservation } from './pages/Reservation';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { PrivateRoute } from './components/PrivateRoute';
import { ManagerRoute } from './components/ManagerRoute';
import { AdminOrders } from './pages/AdminOrders';
import { AdminMenu } from './pages/AdminMenu';
import { AdminReservations } from './pages/AdminReservations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><CartCheckout /></PrivateRoute>} />
          <Route path="/reservation" element={<PrivateRoute><Reservation /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          {/* Админка доступна менеджеру и администратору */}
          <Route path="/admin/orders" element={<ManagerRoute><AdminOrders /></ManagerRoute>} />
          <Route path="/admin/menu" element={<ManagerRoute><AdminMenu /></ManagerRoute>} />
          <Route path="/admin/reservations" element={<ManagerRoute><AdminReservations /></ManagerRoute>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;