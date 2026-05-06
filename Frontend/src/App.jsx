import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserProfile from './components/PerfilUsuario';
import FoodMenu from './components/MenuComida';
import HistorialPedidos from './components/HistorialPedidos';
import Carrito from './components/Carrito';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f3f4ed]">
        <Routes>
          {/* 1. Al entrar a la app (/) ahora mostramos el Login */}
          <Route path="/" element={<Login />} />
          
          {/* 2. El Login te mandará aquí directamente */}
          <Route path="/menu" element={<FoodMenu />} />
          
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/historial" element={<HistorialPedidos />} />
          
          {/* Redirección por si escriben una ruta que no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;