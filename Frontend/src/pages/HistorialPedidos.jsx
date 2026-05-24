import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  ArrowLeft,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "text-amber-600", dot: "bg-amber-500" },
  preparing: {
    label: "En preparación",
    color: "text-blue-600",
    dot: "bg-blue-500",
  },
  ready: { label: "Listo", color: "text-green-600", dot: "bg-green-500" },
  delivering: {
    label: "En camino",
    color: "text-orange-500",
    dot: "bg-orange-500",
  },
  delivered: { label: "Entregado", color: "text-gray-400", dot: "bg-gray-400" },
  cancelled: { label: "Cancelado", color: "text-red-500", dot: "bg-red-500" },
};

const PAYMENT_LABELS = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

const HistorialPedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idExpandido, setIdExpandido] = useState(null);

  const cargarPedidos = () => {
    setLoading(true);
    fetchWithAuth("http://localhost:8000/orders/")
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

  const alternarExpansion = (id) => {
    setIdExpandido(idExpandido === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f3f4ed] p-6 pb-24 relative">
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate("/perfil")}
        className="fixed top-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#2d3a1a] pr-2">
          Mi Perfil
        </span>
      </button>

      <div className="max-w-2xl mx-auto pt-16">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-[#2d3a1a] tracking-tighter italic">
              Mis Pedidos
            </h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">
              Historial CafeMApp
            </p>
          </div>
          <button
            onClick={cargarPedidos}
            className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2d3a1a] hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#2d3a1a]" />
          </div>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-300">
            <ShoppingBag className="w-16 h-16 mb-4" />
            <p className="font-black text-sm uppercase tracking-widest">
              Sin pedidos aún
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => {
              const config =
                STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pending;
              const estaExpandido = idExpandido === pedido.id;
              const loc = pedido.delivery_location;

              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all"
                >
                  {/* CABECERA */}
                  <div
                    className="p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => alternarExpansion(pedido.id)}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="bg-orange-500/10 p-4 rounded-2xl">
                        <ShoppingBag className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-[#2d3a1a] text-lg">
                          {pedido.reference}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {pedido.date} • {pedido.time?.slice(0, 5)}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {PAYMENT_LABELS[pedido.payment_method] ||
                            pedido.payment_method}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-2xl font-black text-[#2d3a1a] tracking-tighter">
                        ${parseFloat(pedido.total).toFixed(2)}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter flex items-center justify-end gap-1 mt-1 ${config.color}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${config.dot}`}
                        />
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* DETALLE EXPANDIDO */}
                  {estaExpandido && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                      <div className="h-px bg-gray-100 w-full mb-6" />

                      <div className="space-y-6">
                        {/* PRODUCTOS */}
                        <div>
                          <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3 italic">
                            Productos
                          </h4>
                          <div className="space-y-3">
                            {pedido.items.map((item) => (
                              <div
                                key={item.id}
                                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-black text-[#2d3a1a] text-sm">
                                    x{item.quantity} {item.product_name}
                                  </span>
                                  <span className="font-bold text-[#2d3a1a] text-sm">
                                    ${parseFloat(item.subtotal).toFixed(2)}
                                  </span>
                                </div>
                                {item.notes && (
                                  <p className="text-[10px] text-orange-600 font-black uppercase mt-1 italic">
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
                                        {ing.action === "extra" ? "+" : "-"}{" "}
                                        {ing.ingredient_name}
                                        {ing.action === "extra" &&
                                          ` x${ing.quantity}`}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ENTREGA Y REPARTIDOR */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-gray-200 pt-4">
                          {loc && (
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  Lugar de entrega
                                </p>
                                {loc.area_name && (
                                  <p className="text-xs font-semibold text-gray-500">
                                    {loc.area_name}
                                  </p>
                                )}
                                {loc.building_name && (
                                  <p className="text-xs font-semibold text-gray-500">
                                    {loc.building_name}
                                  </p>
                                )}
                                {loc.classroom_name && (
                                  <p className="text-xs font-bold text-[#2d3a1a]">
                                    {loc.classroom_name}
                                  </p>
                                )}
                                {loc.reference && (
                                  <p className="text-[10px] text-orange-500 font-black italic mt-0.5">
                                    "{loc.reference}"
                                  </p>
                                )}
                                {loc.custom_location && (
                                  <p className="text-[10px] text-gray-400 font-semibold">
                                    {loc.custom_location}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Repartidor
                              </p>
                              <p className="text-xs font-bold text-[#2d3a1a]">
                                {loc?.delivery_name
                                  ? loc.delivery_name
                                  : pedido.status === "delivered"
                                    ? "Entregado en mostrador"
                                    : "Sin asignar aún"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* DETALLES / INDICACIONES */}
                        {pedido.details && (
                          <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
                              Indicaciones
                            </p>
                            <p className="text-xs font-semibold text-[#2d3a1a] italic">
                              {pedido.details}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TOGGLE */}
                  <button
                    onClick={() => alternarExpansion(pedido.id)}
                    className="w-full py-2 bg-gray-50 flex justify-center text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    {estaExpandido ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => navigate("/menu")}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2d3a1a] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Clock className="w-4 h-4 text-orange-500" />
          Nueva Compra
        </button>
      </div>
    </div>
  );
};

export default HistorialPedidos;
