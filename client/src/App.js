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
import { ManagerOrders } from './pages/ManagerOrders';
import { ManagerMenu } from './pages/ManagerMenu';
import { ManagerReservations } from './pages/ManagerReservations';

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
          <Route path="/manager/orders" element={<ManagerRoute><ManagerOrders /></ManagerRoute>} />
          <Route path="/manager/menu" element={<ManagerRoute><ManagerMenu /></ManagerRoute>} />
          <Route path="/manager/reservations" element={<ManagerRoute><ManagerReservations /></ManagerRoute>} />          
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;