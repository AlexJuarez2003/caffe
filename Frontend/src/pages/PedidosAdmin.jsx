import React, { useState } from "react";
import {
  RefreshCw, ShoppingBag, Calendar, MapPin,
  Building, DoorOpen, ChevronDown, ChevronUp, Loader2
} from "lucide-react";

const STATUS_CONFIG = {
  pending:    { label: "Pendiente",      color: "bg-amber-50 text-amber-600 border-amber-200"   },
  preparing:  { label: "En preparación", color: "bg-blue-50 text-blue-600 border-blue-200"      },
  ready:      { label: "Listo",          color: "bg-green-50 text-green-600 border-green-200"   },
  delivering: { label: "En camino",      color: "bg-orange-50 text-orange-600 border-orange-200"},
  delivered:  { label: "Entregado",      color: "bg-gray-50 text-gray-500 border-gray-200"      },
  cancelled:  { label: "Cancelado",      color: "bg-red-50 text-red-500 border-red-200"         },
};

const PAYMENT_LABELS = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

const PedidosAdmin = ({ pedidos, loading, onRefrescar }) => {
  const [expandido, setExpandido] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const pedidosFiltrados = filtroEstado === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === filtroEstado);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#2D3A22] italic">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? "s" : ""}
            {filtroEstado !== "todos" && ` • ${STATUS_CONFIG[filtroEstado]?.label}`}
          </p>
        </div>
        <button
          onClick={onRefrescar}
          className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2D3A22] hover:bg-gray-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refrescar
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setFiltroEstado(filtroEstado === key ? "todos" : key)}
            className={`rounded-2xl p-3 text-center border transition-all ${
              filtroEstado === key ? color + " ring-2 ring-offset-1 ring-current" : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-black text-[#2D3A22]">
              {pedidos.filter((p) => p.status === key).length}
            </p>
            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D3A22]" />
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-300">
          <ShoppingBag className="w-16 h-16 mb-4" />
          <p className="font-black text-sm uppercase tracking-widest">Sin pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => {
            const config = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.pending;
            const estaExpandido = expandido === pedido.id;
            const loc = pedido.delivery_location;

            return (
              <div
                key={pedido.id}
                className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden"
              >
                {/* CABECERA */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandido(estaExpandido ? null : pedido.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-[#2D3A22] text-lg">{pedido.reference}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-400 font-semibold">
                          {pedido.date} • {pedido.time?.slice(0, 5)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                        {pedido.customer_email}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {PAYMENT_LABELS[pedido.payment_method] || pedido.payment_method}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-[#2D3A22] text-xl">
                        ${parseFloat(pedido.total).toFixed(2)}
                      </span>
                      {loc && (
                        <p className="text-[11px] text-gray-400 font-semibold mt-1 max-w-[180px] text-right truncate">
                          {loc.classroom_name || loc.area_name || "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RESUMEN ITEMS */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pedido.items.map((item) => (
                      <span key={item.id} className="text-[10px] font-black bg-gray-50 text-[#2D3A22] px-3 py-1 rounded-full border border-gray-100">
                        x{item.quantity} {item.product_name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DETALLE EXPANDIDO */}
                {estaExpandido && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">

                    {/* UBICACIÓN */}
                    {loc && (
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 space-y-2">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                          Ubicación de entrega
                        </p>
                        {loc.area_name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                            <p className="text-xs font-semibold text-gray-600">{loc.area_name}</p>
                          </div>
                        )}
                        {loc.building_name && (
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3 text-orange-400 shrink-0" />
                            <p className="text-xs font-semibold text-gray-600">{loc.building_name}</p>
                          </div>
                        )}
                        {loc.classroom_name && (
                          <div className="flex items-center gap-2">
                            <DoorOpen className="w-3 h-3 text-orange-400 shrink-0" />
                            <p className="text-xs font-bold text-[#2D3A22]">{loc.classroom_name}</p>
                          </div>
                        )}
                        {loc.reference && (
                          <p className="text-[11px] text-orange-600 font-black italic">"{loc.reference}"</p>
                        )}
                        {loc.delivery_name && (
                          <p className="text-[11px] text-gray-500 font-semibold">
                            Repartidor: {loc.delivery_name}
                          </p>
                        )}
                      </div>
                    )}

                    {/* PRODUCTOS */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Productos</p>
                      {pedido.items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-[#2D3A22] text-sm">
                              x{item.quantity} {item.product_name}
                            </span>
                            <span className="font-bold text-[#2D3A22] text-sm">
                              ${parseFloat(item.subtotal).toFixed(2)}
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
                                <p key={ing.id} className="text-[10px] text-gray-500 font-semibold">
                                  {ing.action === "extra" ? "+" : "-"} {ing.ingredient_name}
                                  {ing.action === "extra" && ` x${ing.quantity}`}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* INDICACIONES */}
                    {pedido.details && (
                      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Indicaciones</p>
                        <p className="text-xs font-semibold text-[#2D3A22] italic">{pedido.details}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TOGGLE */}
                <button
                  onClick={() => setExpandido(estaExpandido ? null : pedido.id)}
                  className="w-full py-2 bg-gray-50 flex justify-center text-gray-300 hover:text-orange-500 transition-colors"
                >
                  {estaExpandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;