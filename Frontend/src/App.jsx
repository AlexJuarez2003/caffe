import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/Login';
import UserProfile from "./pages/PerfilUsuario";
import FoodMenu from "./pages/MenuComida";
import HistorialPedidos from "./pages/HistorialPedidos";
import Carrito from "./pages/Carrito";
import SignUp from "./pages/SignUp";
import { NotificationContainer } from "./components/Notificacion";

function App() {
  return (
    <>
      <NotificationContainer position="top-right" />
      <Router>
        <div className="min-h-screen bg-[#f3f4ed]">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />

            <Route path="/menu" element={<FoodMenu />} />

            <Route path="/perfil" element={<UserProfile />} />

            <Route path="/historial" element={<HistorialPedidos />} />

            {/* Redirección por si escriben una ruta que no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
