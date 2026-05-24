import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import UserProfile from "./pages/PerfilUsuario";
import FoodMenu from "./pages/MenuComida";
import HistorialPedidos from "./pages/HistorialPedidos";
import Carrito from "./pages/Carrito";
import SignUp from "./pages/SignUp";
import { NotificationContainer } from "./components/Notificacion";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CocinaPanel from "./pages/CocinaPanel";
import RepartidorPanel from "./pages/RepartidorPanel";
import HistorialEntregas from "./pages/HistorialEntregas";

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

            <Route
              path="/perfil"
              element={
                <ProtectedRoute roles={["Cliente", "Cocinero", "Repartidor"]}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu"
              element={
                <ProtectedRoute roles={["Cliente", "Cocinero", "Repartidor"]}>
                  <FoodMenu />
                </ProtectedRoute>
              }
            />

            <Route
              path="/carrito"
              element={
                <ProtectedRoute roles={["Cliente"]}>
                  <Carrito />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial"
              element={
                <ProtectedRoute roles={["Cliente"]}>
                  <HistorialPedidos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cocina"
              element={
                <ProtectedRoute roles={["Cocinero"]}>
                  <CocinaPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/entregas"
              element={
                <ProtectedRoute roles={["Repartidor"]}>
                  <RepartidorPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/entregas/historial"
              element={
                <ProtectedRoute roles={["Repartidor"]}>
                  <HistorialEntregas />
                </ProtectedRoute>
              }
            />

            {/* Redirección por si escriben una ruta que no existe (Esta siempre va al final) */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
