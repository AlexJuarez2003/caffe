import React, { useState, useEffect } from "react";
import { ChefHat, RefreshCw, Clock, CheckCircle2, Loader2, LogOut } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import { cerrarSesion } from "../helper/logout";
import { useNavigate } from "react-router-dom";
import VentasPanel from "./VentasPanel";
import PerfilUsuario from "./PerfilUsuario";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    accion: "Aceptar pedido",
    siguiente: "preparing",
    btnColor: "bg-amber-500 hover:bg-amber-600",
  },
  preparing: {
    label: "En preparación",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    accion: "Marcar como listo",
    siguiente: "ready",
    btnColor: "bg-[#2D3A22] hover:bg-[#1a2310]",
  },
};

const CocinaPanel = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [expandido, setExpandido] = useState(null);
  const [vista, setVista] = useState("pedidos");

  const cargarPedidos = () => {
    setLoading(true);
    fetchWithAuth("http://localhost:8000/orders/by-role/")
      .then((r) => r.json())
      .then((data) => setPedidos(data))
      .catch(() =>
        notify({
          type: "error",
          title: "Error al cargar pedidos",
          duration: 3000,
        }),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleCambiarEstado = async (pedido) => {
    setActualizando(pedido.id);
    const siguiente = STATUS_CONFIG[pedido.status]?.siguiente;

    try {
      const response = await fetchWithAuth(
        `http://localhost:8000/orders/${pedido.id}/status/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: siguiente }),
        },
      );

      if (response.ok) {
        const actualizado = await response.json();

        if (actualizado.status === "ready") {
          setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
          notify({
            type: "success",
            title: "Pedido listo para entrega",
            duration: 3000,
          });
        } else {
          setPedidos((prev) =>
            prev.map((p) => (p.id === actualizado.id ? actualizado : p)),
          );
        }
      } else {
        notify({
          type: "error",
          title: "Error al actualizar pedido",
          duration: 3000,
        });
      }
    } catch {
      notify({
        type: "error",
        title: "Error al conectarse al servidor",
        duration: 3000,
      });
    } finally {
      setActualizando(null);
    }
  };

  const pendientes = pedidos.filter((p) => p.status === "pending");
  const enPreparacion = pedidos.filter((p) => p.status === "preparing");

  return (
    <div className="min-h-screen bg-[#F4F3ED] flex">
      <div className="w-64 bg-[#2D3A22] text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold italic tracking-wide">
              CafeMApp
            </h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1 font-bold">
              Cocina
            </p>
          </div>
          
          <nav className="space-y-3">
            <button
              onClick={() => setVista("pedidos")}
              className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition ${
                vista === "pedidos"
                  ? "bg-[#E87324]"
                  : "text-gray-300 hover:bg-[#3D4F31]"
              }`}
            >
              Pedidos
            </button>
            <button
              onClick={() => setVista("ventas")}
              className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition ${
                vista === "ventas"
                  ? "bg-[#E87324]"
                  : "text-gray-300 hover:bg-[#3D4F31]"
              }`}
            >
              Ventas
            </button>
            <button
              onClick={() => setVista("perfil")}
              className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition ${
                vista === "perfil"
                  ? "bg-[#E87324]"
                  : "text-gray-300 hover:bg-[#3D4F31]"
              }`}
            >
              Perfil
            </button>
          </nav>
        </div>

        <button
          onClick={() => cerrarSesion(navigate)}
          className="text-white/50 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="flex-1 p-10">
        {/* VISTA PEDIDOS */}
        {vista === "pedidos" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-black text-[#2D3A22] italic">
                  Panel de Cocina
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Gestiona los pedidos entrantes.
                </p>
              </div>
              <button
                onClick={cargarPedidos}
                className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2D3A22] hover:bg-gray-50 shadow-sm transition-all"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refrescar
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 animate-spin text-[#2D3A22]" />
              </div>
            ) : pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                <ChefHat className="w-16 h-16 mb-4" />
                <p className="font-black text-sm uppercase tracking-widest">
                  Sin pedidos por ahora
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendientes.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Pendientes (
                      {pendientes.length})
                    </h2>
                    {pendientes.map((pedido) => (
                      <TarjetaPedido
                        key={pedido.id}
                        pedido={pedido}
                        expandido={expandido}
                        setExpandido={setExpandido}
                        actualizando={actualizando}
                        onCambiarEstado={handleCambiarEstado}
                      />
                    ))}
                  </div>
                )}

                {enPreparacion.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                      <ChefHat className="w-4 h-4" /> En preparación (
                      {enPreparacion.length})
                    </h2>
                    {enPreparacion.map((pedido) => (
                      <TarjetaPedido
                        key={pedido.id}
                        pedido={pedido}
                        expandido={expandido}
                        setExpandido={setExpandido}
                        actualizando={actualizando}
                        onCambiarEstado={handleCambiarEstado}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* VISTA VENTAS */}
        {vista === "ventas" && <VentasPanel />}

        {vista === "perfil" && <PerfilUsuario />}
      </div>
    </div>
  );
};

const TarjetaPedido = ({
  pedido,
  expandido,
  setExpandido,
  actualizando,
  onCambiarEstado,
}) => {
  const config = STATUS_CONFIG[pedido.status];
  const estaExpandido = expandido === pedido.id;

  return (
    <div
      className={`bg-white rounded-[2rem] shadow-md border-2 transition-all ${
        pedido.status === "pending" ? "border-amber-200" : "border-blue-100"
      }`}
    >
      <div
        className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-[2rem]"
        onClick={() => setExpandido(estaExpandido ? null : pedido.id)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-black text-[#2D3A22] text-lg">
                {pedido.reference}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.color}`}
              >
                {config.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold">
              {pedido.date} • {pedido.time?.slice(0, 5)}
            </p>
            {pedido.details && (
              <p className="text-[11px] text-orange-500 font-black uppercase mt-1 italic">
                {pedido.details}
              </p>
            )}
          </div>
          <span className="font-black text-[#2D3A22] text-xl">
            ${pedido.total}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {pedido.items.map((item) => (
            <span
              key={item.id}
              className="text-[10px] font-black bg-gray-50 text-[#2D3A22] px-3 py-1 rounded-full border border-gray-100"
            >
              x{item.quantity} {item.product_name}
            </span>
          ))}
        </div>
      </div>

      {estaExpandido && (
        <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-4">
          {pedido.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <span className="font-black text-[#2D3A22] text-sm">
                  x{item.quantity} {item.product_name}
                </span>
                <span className="font-bold text-[#2D3A22] text-sm">
                  ${item.subtotal}
                </span>
              </div>
              {item.notes && (
                <p className="text-[10px] text-orange-500 font-black uppercase italic mt-1">
                  {item.notes}
                </p>
              )}
              {item.ingredients?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.ingredients.map((ing) => (
                    <p
                      key={ing.id}
                      className="text-[10px] text-gray-500 font-semibold"
                    >
                      {ing.action === "extra" ? "+" : "-"} {ing.ingredient_name}
                      {ing.action === "extra" && ` x${ing.quantity}`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {pedido.delivery_location && (
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                Entrega
              </p>
              <p className="text-sm font-black text-[#2D3A22]">
                {pedido.delivery_location.classroom_name ||
                  pedido.delivery_location.area_name ||
                  "—"}
              </p>
              {pedido.delivery_location.building_name && (
                <p className="text-[11px] text-gray-500 font-semibold">
                  {pedido.delivery_location.building_name}
                </p>
              )}
              {pedido.delivery_location.reference && (
                <p className="text-[11px] text-orange-600 font-black italic mt-1">
                  {pedido.delivery_location.reference}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="px-6 pb-6">
        <button
          onClick={() => onCambiarEstado(pedido)}
          disabled={actualizando === pedido.id}
          className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${config.btnColor}`}
        >
          {actualizando === pedido.id ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Actualizando...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> {config.accion}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CocinaPanel;
