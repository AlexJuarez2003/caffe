import React, { useState, useEffect } from "react";
// Importamos todos los iconos necesarios, incluyendo Clock y Settings
import {
  Mail,
  KeyRound,
  Briefcase,
  User,
  Phone,
  CalendarDays,
  Zap,
  Edit3,
  Settings,
  Clock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../helper/FetchWithAuth";

function UserProfile() {
  const navigate = useNavigate();

  // Obtener datos de usuario de navegador
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Eliminar datos de sesión
  const cerrarSesion = async () => {
    await fetchWithAuth("http://localhost:8000/accounts/logout/", {
      method: "POST",
      Credentials: "include",
    });

    localStorage.removeItem("user");
    navigate("/login");
  };

  const InfoRow = ({ Icono, label, value }) => (
    <div className="flex items-center gap-4 py-4 px-2 hover:bg-gray-50 transition-colors rounded-xl group">
      <div className="p-3 rounded-2xl bg-[#2d3a1a]/10 group-hover:bg-[#2d3a1a]/20 transition-all">
        <Icono className="w-5 h-5 text-[#2d3a1a]" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-[#2d3a1a]">{value}</span>
      </div>
    </div>
  );

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4ed] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* BARRA LATERAL IZQUIERDA */}
          <div className="bg-[#2d3a1a] w-full md:w-80 p-10 text-white flex flex-col items-center justify-between">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-orange-500 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  {user.first_name
                    ? user.first_name[0] + user.last_name[0]
                    : "NA"}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                  <Edit3 className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-black leading-tight tracking-tight">
                {user.first_name} <br /> {user.last_name}
              </h2>
              <p className="mt-2 text-orange-400 font-bold text-xs uppercase tracking-widest">
                {user.role}
              </p>
            </div>

            {/* SECCIÓN DE BOTONES ACTUALIZADA */}
            <div className="mt-10 w-full space-y-3">
              {/* Botón: Menú */}
              <button
                onClick={() => navigate("/menu")}
                className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 active:scale-95"
              >
                Ver Menú de Hoy
              </button>

              {/* Botón: Historial (Mis Pedidos) */}
              <button
                onClick={() => navigate("/historial")}
                className="w-full py-3 px-6 border-2 border-white/10 hover:bg-white/5 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-orange-400" />
                Mis Pedidos
              </button>

              {/* Botón: Configuración */}
              <button
                onClick={cerrarSesion}
                className="w-full py-3 px-6 border-2 border-white/10 hover:bg-white/5 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* CUERPO CENTRAL DE INFORMACIÓN */}
          <div className="flex-1 p-10 md:p-14 bg-white">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-[#2d3a1a] tracking-tight">
                Información Personal
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4">
                {user.role == "Cliente" && (
                  <>
                    <h4 className="text-orange-500 font-black text-xs uppercase tracking-tighter ml-2">
                      Académico
                    </h4>
                    <div className="bg-gray-50 rounded-4x1 p-4">
                      <InfoRow
                        Icono={User}
                        label="No. Control"
                        value={user.profile?.control_number}
                      />
                      <InfoRow
                        Icono={Briefcase}
                        label="Carrera"
                        value={user.profile?.department}
                      />
                    </div>
                  </>
                )}

                {user.role == "Cocinero" && (
                  <>
                    <h4 className="text-orange-500 font-black text-xs uppercase tracking-tighter ml-2">
                      Académico
                    </h4>
                    <div className="bg-gray-50 rounded-4x1 p-4">
                      <InfoRow
                        Icono={User}
                        label="Turno"
                        value={user.profile?.shift}
                      />
                    </div>
                  </>
                )}

                {user.role == "Repartidor" && (
                  <>
                    <h4 className="text-orange-500 font-black text-xs uppercase tracking-tighter ml-2">
                      Logístico
                    </h4>
                    <div className="bg-gray-50 rounded-4x1 p-4">
                      <InfoRow
                        Icono={User}
                        label="Área"
                        value={user.profile?.delivery_area}
                      />
                    </div>
                  </>
                )}
                
              </div>

              <div className="space-y-4">
                <h4 className="text-orange-500 font-black text-xs uppercase tracking-tighter ml-2">
                  Seguridad
                </h4>
                <div className="bg-gray-50 rounded-4x1 p-4">
                  <InfoRow Icono={Mail} label="Email" value={user.email} />
                </div>
              </div>

              <div className="space-y-4 sm:col-span-2 mt-4">
                <h4 className="text-orange-500 font-black text-xs uppercase tracking-tighter ml-2">
                  Contacto y Registro
                </h4>
                <div className="bg-gray-50 rounded-4x1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow
                    Icono={Phone}
                    label="Teléfono móvil"
                    value={user.phone_number}
                  />
                  <InfoRow
                    Icono={CalendarDays}
                    label="Miembro desde"
                    value={user?.creation_date?.split("T")[0] || ""}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button className="group relative px-8 py-4 bg-orange-500 text-white font-black rounded-3xl overflow-hidden shadow-xl shadow-orange-500/30 hover:scale-105 transition-all">
                <span className="relative z-10 flex items-center gap-2">
                  Actualizar Datos <Zap className="w-4 h-4 fill-white" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[#2d3a1a]/40 text-xs font-bold tracking-widest uppercase">
          Portal de Estudiantes • Instituto Tecnológico de Oaxaca
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
