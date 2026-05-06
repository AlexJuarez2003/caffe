import React from 'react';
import { X, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  // Datos de prueba para que veas cómo se llena
  const cartItems = [
    { id: 1, nombre: "Chilaquiles Oaxaqueños", precio: 65, cantidad: 1, notas: "Sin cebolla" },
    { id: 2, nombre: "Latte Especial", precio: 45, cantidad: 2, notas: "Leche deslactosada" }
  ];

  const total = cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro con desenfoque */}
      <div 
        className="absolute inset-0 bg-[#2d3a1a]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Carrito */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        
        {/* Encabezado */}
        <div className="p-6 bg-[#2d3a1a] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-black tracking-tighter italic">Tu Pedido</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-bold text-[#2d3a1a]/20">
                ☕
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-[#2d3a1a] text-sm leading-tight">{item.nombre}</h4>
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-orange-500 uppercase mt-1">{item.notas}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                    <button className="text-[#2d3a1a] font-black text-lg">-</button>
                    <span className="text-sm font-black text-[#2d3a1a]">{item.cantidad}</span>
                    <button className="text-[#2d3a1a] font-black text-lg">+</button>
                  </div>
                  <span className="font-black text-[#2d3a1a]">${item.precio * item.cantidad}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen y Botón de Pago */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 rounded-t-[2.5rem]">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>${total}.00</span>
            </div>
            <div className="flex justify-between text-[#2d3a1a] text-xl font-black italic">
              <span>Total a pagar</span>
              <span className="text-orange-500">${total}.00</span>
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 group active:scale-95">
            Confirmar Pedido
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase mt-4 tracking-tighter">
            * El tiempo estimado de entrega es de 15-20 min
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;