import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ChevronRight, Plus } from 'lucide-react';
import ModalPago from './ModalMetodoPago';
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import ModalUbicacion from "./ModalUbicacion";

const CartDrawer = ({ isOpen, onClose, items = [], setItems }) => {

  const [modalUbicacionAbierto, setModalUbicacionAbierto] = useState(false);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [ubicacion, setUbicacion] = useState(null);
  const [showPago, setShowPago] = useState(false);
  
  const total = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const img =
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400";

  const handleUbicacionConfirmada = (ubicacionData) => {
    setUbicacion(ubicacionData);
    setModalUbicacionAbierto(false);
    setModalPagoAbierto(true);
  };

  const handlePedidoConfirmado = async (metodoPago) => {
    try {
      const response = await fetchWithAuth("http://localhost:8000/orders/from-menu/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(({ product, quantity, notes, ingredients }) => ({
            product,
            quantity,
            notes: notes || null,
            ingredients: ingredients || [].map(({ extra_price, ...rest}) => rest),
          })),
          payment_method: metodoPago,
          delivery_location: ubicacion,
        }),
      });

      if (response.ok) {
        setItems([]);
        setUbicacion(null);
        onClose();
        return true;
      } else {
        const error = await response.json();
        notify({ type: "error", title: "Error al realizar pedido", message: JSON.stringify(error), duration: 5000 });
        return false;
      }
    } catch {
      notify({ type: "error", title: "Error al conectarse al servidor", duration: 4000 });
      return false;
    }
  };


  const eliminarItem = (idUnico) => {
    setItems(items.filter(item => item.idUnico !== idUnico));
  };

  const actualizarCantidad = (idUnico, delta) => {
    setItems(items.map(item => {
      if (item.idUnico === idUnico) {
        const nuevaCant = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: nuevaCant };
      }
      return item;
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-100 flex justify-end">
        <div 
          className="absolute inset-0 bg-[#2d3a1a]/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
          
          <div className="p-6 bg-[#2d3a1a] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-black tracking-tighter italic">Tu Pedido</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">El carrito está vacío</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.idUnico} className="flex gap-4 group animate-in fade-in slide-in-from-right-4">
                  {console.log(item)}
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl shrink-0 overflow-hidden border border-gray-100">
                    <img src={item.img? item.img : img} alt={item.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-[#2d3a1a] text-sm leading-tight">{item.nombre}</h4>
                      <button 
                        onClick={() => eliminarItem(item.idUnico)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      {item.extras && item.extras.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.extras.map((extra, index) => (
                            <span key={index} className="text-[9px] font-black bg-green-50 text-green-700 px-2 py-0.5 rounded-md uppercase tracking-tighter flex items-center gap-0.5">
                              <Plus className="w-2 h-2" /> {extra}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="text-[10px] font-bold text-orange-500 uppercase italic leading-tight">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                        <button 
                          onClick={() => actualizarCantidad(item.idUnico, -1)}
                          className="text-[#2d3a1a] font-black text-lg"
                        >-</button>
                        <span className="text-sm font-black text-[#2d3a1a]">{item.quantity || 1}</span>
                        <button 
                          onClick={() => actualizarCantidad(item.idUnico, 1)}
                          className="text-[#2d3a1a] font-black text-lg"
                        >+</button>
                      </div>
                      <span className="font-black text-[#2d3a1a]">${item.price * (item.quantity || 1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 bg-gray-50/50 rounded-t-[2.5rem]">
            <div className="space-y-2 mb-6">
              
              <div className="flex justify-between text-[#2d3a1a] text-xl font-black italic">
                <span>Total a pagar</span>
                <span className="text-orange-500 font-black">${total}.00</span>
              </div>
            </div>

            <button
              onClick={() => setModalUbicacionAbierto(true)}
              disabled={items.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-4x1 font-black text-lg shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              Confirmar Pedido
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-4 tracking-tighter">
              * El tiempo estimado de entrega es de 15-20 min
            </p>
          </div>
        </div>
      </div>

      <ModalUbicacion
        isOpen={modalUbicacionAbierto}
        onClose={() => setModalUbicacionAbierto(false)}
        onConfirmar={handleUbicacionConfirmada}
      />

      <ModalPago
        isOpen={modalPagoAbierto}
        onClose={() => setModalPagoAbierto(false)}
        total={total}
        onConfirmar={handlePedidoConfirmado}
      />
    </>
  );
};

export default CartDrawer;