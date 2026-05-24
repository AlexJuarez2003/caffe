import React, { useState, useEffect } from "react";
import {
  PackageCheck,
  Calendar,
  MapPin,
  Building,
  DoorOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const PAYMENT_LABELS = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

const HistorialEntregas = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/orders/delivery-history/")
      .then((r) => r.json())
      .then((data) => setPedidos(data))
      .catch(() =>
        notify({
          type: "error",
          title: "Error al cargar historial",
          duration: 3000,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  const totalEntregas = pedidos.length;
  const totalIngresos = pedidos.reduce(
    (acc, p) => acc + parseFloat(p.total),
    0,
  );

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

          {/* STATS */}
          <div className="space-y-4">
            <div className="bg-[#3D4F31] rounded-2xl p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Entregas realizadas
              </p>
              <p className="text-4xl font-black text-orange-400 mt-1">
                {totalEntregas}
              </p>
            </div>
            <div className="bg-[#3D4F31] rounded-2xl p-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Total gestionado
              </p>
              <p className="text-2xl font-black text-green-400 mt-1">
                ${totalIngresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 p-10 justify-between items-center mb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#2D3A22] italic">
            Historial de Entregas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Todos los pedidos que has entregado.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D3A22]" />
          </div>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-300">
            <PackageCheck className="w-16 h-16 mb-4" />
            <p className="font-black text-sm uppercase tracking-widest">
              Sin entregas aún
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {pedidos.map((pedido) => {
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
                    onClick={() =>
                      setExpandido(estaExpandido ? null : pedido.id)
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-black text-[#2D3A22] text-lg">
                            {pedido.reference}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                            Entregado
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-[11px] text-gray-400 font-semibold">
                            {pedido.date} • {pedido.time?.slice(0, 5)}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {PAYMENT_LABELS[pedido.payment_method] ||
                            pedido.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-[#2D3A22] text-xl">
                          ${parseFloat(pedido.total).toFixed(2)}
                        </span>
                        {loc && (
                          <p className="text-[11px] text-gray-400 font-semibold mt-1 max-w-[160px] text-right truncate">
                            {loc.classroom_name || loc.area_name || "—"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RESUMEN ITEMS */}
                    <div className="mt-3 flex flex-wrap gap-2">
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
                            <p className="text-[11px] text-orange-600 font-black italic">
                              "{loc.reference}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* PRODUCTOS */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Productos
                        </p>
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

                      {/* INDICACIONES */}
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
                    </div>
                  )}

                  {/* TOGGLE */}
                  <button
                    onClick={() =>
                      setExpandido(estaExpandido ? null : pedido.id)
                    }
                    className="w-full py-2 bg-gray-50 flex justify-center text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    {estaExpandido ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        onClick={() => navigate("/entregas")}
        className="flex m-7 h-12 items-center gap-2 bg-white border border-gray-100 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#2D3A22] hover:bg-gray-50 shadow-sm transition-all"
      >
        <ArrowLeft />
        Volver
      </button>
    </div>
  );
};

export default HistorialEntregas;
