import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Settings,
  LogOut,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Calendar,
  Clock,
  LayoutGrid,
  UtensilsCrossed,
  MapPin,
  Activity,
  ChefHat,
  ArrowLeft,
} from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import ModalEditarPerfil from "./ModalEditarPerfil";
import { notify } from "../components/Notificacion";
import { cerrarSesion } from "../helper/LogOut";

function PerfilUsuario() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [user, setUser] = useState(null);

  // Obtener datos de usuario de navegador
  function getUser() {
    const u = JSON.parse(localStorage.getItem("user"));

    if (u) {
      setUser(u);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const iniciarSesion = async () => {
    navigate("/login");
  };

  if (!user) {
    return (
      <>
        <p>Cargando...</p>
        <button onClick={iniciarSesion}>Iniciar sesión</button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4ed] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-150">
        <div className="w-full md:w-2/5 p-10 bg-[#2d3a1a] flex flex-col justify-between items-center text-white">
          <div className="flex flex-col items-center w-full">
            <div className="w-40 h-40 bg-orange-500 rounded-[2.5rem] flex items-center justify-center relative mb-0 text-4xl font-black shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {[user.first_name, user.last_name]
                .filter(Boolean)
                .map((name) => name[0])
                .join("") || "NA"}
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-3 bg-white text-[#2d3a1a] rounded-full shadow-lg hover:text-orange-500 transition-all active:scale-90 z-20"
              >
                <Pencil className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-15 justify-items-center">
              <h2 className="mt-6 text-2xl font-black leading-tight tracking-tight">
                {user?.first_name} <br /> {user?.last_name}
              </h2>
              <p className="mt-2 text-orange-400 font-bold text-xs uppercase tracking-widest">
                {user.role ? user.role : ""}
              </p>
            </div>
            <nav className="w-full space-y-4">
              {user.role ? (
                user.role === "Cliente" ? (
                  <>
                    <button
                      onClick={() => navigate("/menu")}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                      <UtensilsCrossed className="w-4 h-4" /> Ver Menú de Hoy
                    </button>
                    <button
                      onClick={() => navigate("/historial")}
                      className="w-full py-4 bg-[#3d4d24] text-white/70 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Clock className="w-4 h-4 text-orange-500" /> Mis Pedidos
                    </button>
                  </>
                ) : user.role === "Repartidor" ? (
                  <button
                    onClick={() => navigate("/entregas")}
                    className="w-full py-4 bg-[#3d4d24] text-white/70 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-orange-500" />
                    Volver
                  </button>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </nav>
          </div>

          <button
            onClick={() => cerrarSesion(navigate)}
            className="mt-8 flex items-center gap-2 text-white/50 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

        <div className="w-full md:w-3/5 p-10 md:p-14 bg-white relative">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-black text-[#2d3a1a] tracking-tighter">
              Información Personal
            </h1>
            <Settings className="text-gray-200 w-6 h-6 cursor-pointer hover:text-orange-500 transition-colors" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                Seguridad
              </h3>
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Email Institucional
                  </p>
                  <p className="text-sm font-bold text-gray-700 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Contraseña
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    ••••••••••••
                  </p>
                </div>
              </div>
            </div>

            {user.role === "Cliente" && (
              <div className="space-y-6">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                  Académico
                </h3>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      No. Control
                    </p>
                    <p className="text-sm font-bold text-gray-700 truncate">
                      {user.profile?.control_number || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Carrera
                    </p>
                    <p className="text-sm font-bold text-gray-700 wrap-break-word leading-tight">
                      {user.profile?.department || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user.role === "Repartidor" && (
              <div className="space-y-6">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                  Reparto
                </h3>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Área de reparto
                    </p>
                    <p className="text-sm font-bold text-gray-700 wrap-break-word leading-tight">
                      {user.profile?.delivery_area?.name || "Sin área asignada"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Disponibilidad
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        user.profile?.is_available
                          ? "text-green-600"
                          : "text-red-400"
                      }`}
                    >
                      {user.profile?.is_available === undefined
                        ? "—"
                        : user.profile.is_available
                          ? "Disponible"
                          : "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user.role === "Cocinero" && (
              <div className="space-y-6">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                  Cocina
                </h3>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Turno
                    </p>
                    <p className="text-sm font-bold text-gray-700 capitalize">
                      {user.profile?.shift || "—"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em]">
                  Contacto y Registro
                </h3>
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Teléfono Móvil
                    </p>
                    <p className="text-sm font-bold text-gray-700 truncate">
                      {user?.phone_number ? user.phone_number : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-end pb-2">
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl w-full min-h-22.5">
                  <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Miembro desde
                    </p>
                    <p className="text-sm font-bold text-gray-700 truncate">
                      {user?.creation_date?.split("T")[0] || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[9px] text-gray-300 font-bold uppercase mt-12">
            Portal de Estudiantes • Instituto Tecnológico de Oaxaca
          </p>
        </div>
      </div>

      <ModalEditarPerfil
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentData={user}
        getUser={getUser}
      />
    </div>
  );
}

export default PerfilUsuario;
