import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);