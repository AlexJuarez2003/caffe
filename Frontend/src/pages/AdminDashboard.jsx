import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import StaffForm from "../pages/StaffForm";
import Ingredientes from "../pages/menu/Ingredientes";
import Productos from "../components/menu/Productos";

const AdminDashboard = () => {
  const [vistaActual, setVistaActual] = useState("inventario");
  const [cocineros, setCocineros] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [tabPersonal, setTabPersonal] = useState("cocineros");
  const [modalStaffAbierto, setModalStaffAbierto] = useState(false);

  useEffect(() => {
    if (vistaActual !== "personal") return;

    fetchWithAuth("http://localhost:8000/accounts/chefs/")
      .then((r) => r.json())
      .then((data) => setCocineros(data))
      .catch(() => notify({ type: "error", title: "Error al cargar cocineros", duration: 3000 }));

    fetchWithAuth("http://localhost:8000/accounts/deliveries/")
      .then((r) => r.json())
      .then((data) => setRepartidores(data))
      .catch(() => notify({ type: "error", title: "Error al cargar repartidores", duration: 3000 }));
  }, [vistaActual]);

  return (
    <div className="flex min-h-screen bg-[#F4F3ED]" style={{ fontFamily: "sans-serif" }}>

      <div className="w-64 bg-[#2D3A22] text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold italic tracking-wide">CafeMApp</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1 font-bold">Panel Admin</p>
          </div>
          <nav className="space-y-3">
            {[
              { value: "inventario", label: "Menú" },
              { value: "personal", label: "Personal" },
              { value: "ingredientes", label: "Ingredientes" },
              { value: "pedidos", label: "Pedidos" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setVistaActual(value)}
                className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition ${
                  vistaActual === value ? "bg-[#E87324]" : "text-gray-300 hover:bg-[#3D4F31]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wide">
          Instituto Tecnológico de Oaxaca
        </div>
      </div>

      <div className="flex-1 p-10">
        {vistaActual === "inventario" && <Productos />}
        {vistaActual === "ingredientes" && <Ingredientes />}

        {vistaActual === "personal" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-black text-[#2D3A22] italic">Gestión de Personal</h1>
                <p className="text-gray-500 text-sm mt-1">Administra cocineros y repartidores.</p>
              </div>
              <button
                onClick={() => setModalStaffAbierto(true)}
                className="bg-[#E87324] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d6641e] shadow-lg transition text-sm uppercase tracking-wider"
              >
                + Nuevo Personal
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              {[
                { value: "cocineros", label: "Cocineros", count: cocineros.length },
                { value: "repartidores", label: "Repartidores", count: repartidores.length },
              ].map(({ value, label, count }) => (
                <button
                  key={value}
                  onClick={() => setTabPersonal(value)}
                  className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                    tabPersonal === value
                      ? "bg-[#2D3A22] text-white shadow-md"
                      : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    tabPersonal === value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {tabPersonal === "cocineros" && (
              <div className="bg-white rounded-4x1 p-8 shadow-md border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] tracking-widest text-gray-400 uppercase font-bold">
                      <th className="pb-4 pl-4">Nombre</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Turno</th>
                      <th className="pb-4">Teléfono</th>
                      <th className="pb-4 text-center">Estado</th>
                      <th className="pb-4 pr-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cocineros.map((chef) => (
                      <tr key={chef.id} className="hover:bg-gray-50/50 transition text-gray-700">
                        <td className="py-4 pl-4 font-bold text-[#2D3A22]">
                          {chef.first_name && chef.last_name ? `${chef.first_name} ${chef.last_name}` : "Sin nombre"}
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-500">{chef.email}</td>
                        <td className="py-4">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                            chef.shift === "Matutino" ? "bg-orange-50 text-orange-500" : "bg-[#2D3A22]/10 text-[#2D3A22]"
                          }`}>
                            {chef.shift}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-500">{chef.phone_number || "—"}</td>
                        <td className="py-4 text-center">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                            chef.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"
                          }`}>
                            {chef.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {cocineros.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-300 font-black text-sm uppercase tracking-widest">
                          No hay cocineros registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tabPersonal === "repartidores" && (
              <div className="bg-white rounded-4x1 p-8 shadow-md border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] tracking-widest text-gray-400 uppercase font-bold">
                      <th className="pb-4 pl-4">Nombre</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Área de reparto</th>
                      <th className="pb-4">Teléfono</th>
                      <th className="pb-4 text-center">Disponible</th>
                      <th className="pb-4 pr-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {repartidores.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50/50 transition text-gray-700">
                        <td className="py-4 pl-4 font-bold text-[#2D3A22]">
                          {delivery.first_name && delivery.last_name ? `${delivery.first_name} ${delivery.last_name}` : "Sin nombre"}
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-500">{delivery.email}</td>
                        <td className="py-4 text-sm font-semibold text-gray-500">{delivery.delivery_area?.name || "—"}</td>
                        <td className="py-4 text-sm font-semibold text-gray-500">{delivery.phone_number || "—"}</td>
                        <td className="py-4 text-center">
                          <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                            delivery.is_available ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"
                          }`}>
                            {delivery.is_available ? "Disponible" : "Ocupado"}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {repartidores.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-300 font-black text-sm uppercase tracking-widest">
                          No hay repartidores registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <StaffForm
        isOpen={modalStaffAbierto}
        onClose={() => setModalStaffAbierto(false)}
      />
    </div>
  );
};

export default AdminDashboard;