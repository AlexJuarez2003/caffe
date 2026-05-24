import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  MapPin,
  Building,
  DoorOpen,
  Loader2,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import { cerrarSesion } from "../helper/logout";
import { useNavigate } from "react-router-dom";
import PerfilUsuario from "./PerfilUsuario";

const STATUS_CONFIG = {
  ready: {
    label: "Listo para entrega",
    color: "bg-green-50 text-green-600 border-green-200",
    accion: "Tomar pedido",
    siguiente: "delivering",
    btnColor: "bg-[#2D3A22] hover:bg-[#1a2310]",
  },
  delivering: {
    label: "En camino",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    accion: "Marcar como entregado",
    siguiente: "delivered",
    btnColor: "bg-orange-500 hover:bg-orange-600",
  },
};

const RepartidorPanel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const areaRepartidor = user?.profile?.delivery_area;
  const [vista, setVista] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [expandido, setExpandido] = useState(null);
  const [filtro, setFiltro] = useState("mi_area"); // "mi_area" | "todos"

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

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === "todos") return true;
    const areaId = p.delivery_location?.delivery_area;
    const classroomAreaId = p.delivery_location?.classroom?.delivery_area;
    return (
      areaId === areaRepartidor?.id || classroomAreaId === areaRepartidor?.id
    );
  });

  const misPedidos = pedidos.filter(
    (p) => p.delivery_location?.delivery === user?.id,
  );

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
        if (actualizado.status === "delivered") {
          setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
          notify({
            type: "success",
            title: "Pedido entregado",
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

  return (
    <div className="min-h-screen bg-[#F4F3ED] flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#2D3A22] text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold italic tracking-wide">
              CafeMApp
            </h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1 font-bold">
              Repartidor
            </p>
          </div>
          <div className="bg-[#3D4F31] rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
              Mi área
            </p>
            <p className="text-sm font-black text-white">
              {areaRepartidor?.name || "Sin área asignada"}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Filtrar pedidos
            </p>
            {[
              { value: "mi_area", label: "Mi área" },
              { value: "todos", label: "Todos" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {setVista(""); setFiltro(value);}}
                className={`w-full text-left py-3 px-4 rounded-2xl font-bold text-sm transition ${
                  filtro === value
                    ? "bg-[#E87324]"
                    : "text-gray-300 hover:bg-[#3D4F31]"
                }`}
              >
                {label}
                <span
                  className={`float-right text-xs px-2 py-0.5 rounded-full font-black ${
                    filtro === value
                      ? "bg-white/20 text-white"
                      : "bg-[#3D4F31] text-gray-400"
                  }`}
                >
                  {value === "mi_area"
                    ? pedidos.filter((p) => {
                        const areaId = p.delivery_location?.delivery_area;
                        return areaId === areaRepartidor?.id;
                      }).length
                    : pedidos.length}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/entregas/historial")}
            className="w-full text-left py-3 px-4 rounded-2xl font-bold text-sm text-gray-300 hover:bg-[#3D4F31] transition"
          >
            Mis entregas
          </button>
          <button
            onClick={() => navigate("/perfil")}
            className="w-full text-left py-3 px-4 rounded-2xl font-bold text-sm text-gray-300 hover:bg-[#3D4F31] transition"
          >
            Perfil
          </button>
        </div>

        <button
          onClick={() => cerrarSesion(navigate)}
          className="flex items-center gap-2 text-white/50 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#2D3A22] italic">
              Panel de Entregas
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {pedidosFiltrados.length} pedido
              {pedidosFiltrados.length !== 1 ? "s" : ""} disponible
              {pedidosFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={cargarPedidos}
            className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2D3A22] hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refrescar
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D3A22]" />
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-300">
            <PackageCheck className="w-16 h-16 mb-4" />
            <p className="font-black text-sm uppercase tracking-widest">
              Sin pedidos disponibles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pedidosFiltrados.map((pedido) => (
              <TarjetaEntrega
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
      <></>
    </div>
  );
};

const TarjetaEntrega = ({
  pedido,
  expandido,
  setExpandido,
  actualizando,
  onCambiarEstado,
}) => {
  const config = STATUS_CONFIG[pedido.status];
  const estaExpandido = expandido === pedido.id;
  const loc = pedido.delivery_location;

  return (
    <div
      className={`bg-white rounded-4x1 shadow-md border-2 transition-all ${
        pedido.status === "delivering" ? "border-blue-200" : "border-green-200"
      }`}
    >
      {/* CABECERA */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-4x1"
        onClick={() => setExpandido(estaExpandido ? null : pedido.id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="font-black text-[#2D3A22] text-lg">
              {pedido.reference}
            </span>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {pedido.date} • {pedido.time?.slice(0, 5)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-black text-[#2D3A22] text-lg">
              ${pedido.total}
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.color}`}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* UBICACIÓN RESUMIDA */}
        {loc && (
          <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2 border border-orange-100">
            <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
            <p className="text-[11px] font-black text-[#2D3A22] truncate">
              {loc.classroom_name || loc.area_name || "Sin ubicación"}
            </p>
          </div>
        )}

        {/* TOGGLE */}
        <div className="flex items-center justify-center mt-3 text-gray-300">
          {estaExpandido ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* DETALLE EXPANDIDO */}
      {estaExpandido && (
        <div className="px-6 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* UBICACIÓN COMPLETA */}
          {loc && (
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 space-y-2">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                Ubicación de entrega
              </p>
              {loc.area_name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <p className="text-xs font-semibold text-gray-600">
                    {loc.area_name}
                  </p>
                </div>
              )}
              {loc.building_name && (
                <div className="flex items-center gap-2">
                  <Building className="w-3 h-3 text-orange-400 shrink-0" />
                  <p className="text-xs font-semibold text-gray-600">
                    {loc.building_name}
                  </p>
                </div>
              )}
              {loc.classroom_name && (
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-3 h-3 text-orange-400 shrink-0" />
                  <p className="text-xs font-bold text-[#2D3A22]">
                    {loc.classroom_name}
                  </p>
                </div>
              )}
              {loc.reference && (
                <p className="text-[11px] text-orange-600 font-black italic mt-1">
                  "{loc.reference}"
                </p>
              )}
              {loc.custom_location && (
                <p className="text-[11px] text-gray-500 font-semibold">
                  {loc.custom_location}
                </p>
              )}
            </div>
          )}

          {/* DETALLES DEL PEDIDO */}
          {pedido.details && (
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Indicaciones
              </p>
              <p className="text-xs font-semibold text-[#2D3A22] italic">
                {pedido.details}
              </p>
            </div>
          )}

          {/* ITEMS */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Productos
            </p>
            {pedido.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100"
              >
                <span className="text-xs font-black text-[#2D3A22]">
                  x{item.quantity} {item.product_name}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  ${item.subtotal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTÓN */}
      <div className="px-6 pb-6 pt-2">
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
              <PackageCheck className="w-4 h-4" /> {config.accion}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RepartidorPanel;
