import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map/:area" element={<MapPage />} />
        <Route path="/book/:boothId" element={<BookingPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
