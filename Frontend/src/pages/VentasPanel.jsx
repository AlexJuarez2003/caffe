import React, { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import ModalPago from "./ModalMetodoPago";

const VentasPanel = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [venta, setVenta] = useState(() => {
    const guardado = localStorage.getItem("venta_actual");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/menu/products/")
      .then((r) => r.json())
      .then((data) => { console.log(data); setProductos(data);}) // .filter((p) => p.is_available)
      .catch(() => notify({ type: "error", title: "Error al cargar productos", duration: 3000 }));
  }, []);

  useEffect(() => {
    localStorage.setItem("venta_actual", JSON.stringify(venta));
  }, [venta]);

  const filtrados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarProducto = (producto) => {
    setVenta((prev) => {
      const existe = prev.find((i) => i.product === producto.id);
      if (existe) {
        return prev.map((i) =>
          i.product === producto.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        product: producto.id,
        nombre: producto.name,
        price: parseFloat(producto.price),
        quantity: 1,
      }];
    });
  };

  const actualizarCantidad = (productId, delta) => {
    setVenta((prev) =>
      prev
        .map((i) => i.product === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const eliminarItem = (productId) => {
    setVenta((prev) => prev.filter((i) => i.product !== productId));
  };

  const limpiarVenta = () => {
    setVenta([]);
    localStorage.removeItem("venta_actual");
  };

  const total = venta.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleVentaConfirmada = async (metodoPago) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("http://localhost:8000/orders/in-store/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: venta.map(({ product, quantity }) => ({ product, quantity })),
          payment_method: metodoPago,
        }),
      });

      if (response.ok) {
        limpiarVenta();
        notify({ type: "success", title: "Venta registrada", duration: 3000 });
        return true;
      } else {
        const error = await response.json();
        notify({ type: "error", title: "Error al registrar venta", message: JSON.stringify(error), duration: 5000 });
        return false;
      }
    } catch {
      notify({ type: "error", title: "Error al conectarse al servidor", duration: 4000 });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 h-full">

      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#2D3A22] italic mb-4">Venta en mostrador</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-5 py-4 font-semibold text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[65vh] pr-1">
          {filtrados.map((producto) => (
            <button
              key={producto.id}
              onClick={() => agregarProducto(producto)}
              className="bg-white rounded-3x1 p-4 shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all text-left active:scale-95 group"
            >
              <div className="h-24 bg-gray-50 rounded-xl overflow-hidden mb-3">
                {producto.image_url ? (
                  <img src={producto.image_url} alt={producto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-200" />
                  </div>
                )}
              </div>
              <p className="font-black text-[#2D3A22] text-sm leading-tight">{producto.name}</p>
              <p className="text-orange-500 font-black text-sm mt-1">${parseFloat(producto.price).toFixed(2)}</p>
            </button>
          ))}
          {filtrados.length === 0 && (
            <div className="col-span-3 py-16 text-center text-gray-300 font-black text-sm uppercase tracking-widest">
              Sin resultados
            </div>
          )}
        </div>
      </div>

      {/* TABLA DE VENTA */}
      <div className="w-80 flex flex-col bg-white rounded-4x1 shadow-md border border-gray-100 overflow-hidden">

        <div className="p-6 bg-[#2D3A22] text-white">
          <h3 className="font-black text-lg italic">Venta actual</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
            {venta.length} producto{venta.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {venta.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-300">
              <ShoppingBag className="w-10 h-10 mb-3" />
              <p className="font-black text-xs uppercase tracking-widest">Sin productos</p>
            </div>
          ) : (
            venta.map((item) => (
              <div key={item.product} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#2D3A22] text-xs truncate">{item.nombre}</p>
                  <p className="text-orange-500 font-black text-xs">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => actualizarCantidad(item.product, -1)}
                    className="p-1 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#2D3A22]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black text-[#2D3A22] text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => actualizarCantidad(item.product, +1)}
                    className="p-1 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#2D3A22]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => eliminarItem(item.product)}
                    className="p-1 ml-1 hover:bg-white rounded-lg transition-colors text-gray-200 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-2xl font-black text-[#2D3A22]">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setModalPagoAbierto(true)}
            disabled={venta.length === 0 || loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
            Registrar venta
          </button>
          {venta.length > 0 && (
            <button
              onClick={limpiarVenta}
              className="w-full py-2 text-gray-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              Limpiar venta
            </button>
          )}
        </div>
      </div>

      <ModalPago
        isOpen={modalPagoAbierto}
        onClose={() => setModalPagoAbierto(false)}
        total={total.toFixed(2)}
        onConfirmar={handleVentaConfirmada}
      />
    </div>
  );
};

export default VentasPanel;