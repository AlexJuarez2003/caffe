import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

const Carrito = () => {
  const navigate = useNavigate();

  // Datos simulados de lo que el usuario agregó
  const items = [
    { id: 1, nombre: "Chilaquiles Oaxaqueños", precio: 65, cantidad: 1, nota: "Sin cebolla" },
    { id: 2, nombre: "Latte Especial", precio: 45, cantidad: 1, nota: "Leche deslactosada" }
  ];

  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const comision = 5; // Por uso de plataforma o servicio
  const total = subtotal + comision;

  return (
    <div className="min-h-screen bg-[#f3f4ed] p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        
        {/* Botón Volver al Menú */}
        <button 
          onClick={() => navigate('/menu')}
          className="mb-8 flex items-center gap-2 text-[#2d3a1a]/60 hover:text-[#2d3a1a] font-black text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Menú
        </button>

        <h2 className="text-4xl font-black text-[#2d3a1a] tracking-tighter italic mb-8">Tu Carrito</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-black text-[#2d3a1a] text-lg">{item.nombre}</h3>
                <p className="text-[10px] text-orange-600 font-black uppercase italic">{item.nota}</p>
                <span className="block mt-2 font-bold text-[#2d3a1a]">${item.precio}.00</span>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-orange-500">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-[#2d3a1a]">{item.cantidad}</span>
                <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-orange-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button className="ml-4 p-4 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen de Pago */}
        <div className="mt-10 bg-[#2d3a1a] rounded-[3rem] p-8 text-white shadow-2xl shadow-[#2d3a1a]/30">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm font-bold opacity-60">
              <span>Subtotal</span>
              <span>${subtotal}.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold opacity-60">
              <span>Comisión servicio</span>
              <span>${comision}.00</span>
            </div>
            <div className="h-[1px] bg-white/10 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-black italic">Total a pagar</span>
              <span className="text-3xl font-black text-orange-400">${total}.00</span>
            </div>
          </div>

          <button 
            onClick={() => alert("¡Pedido enviado a la cocina!")}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-3 active:scale-95"
          >
            Confirmar Pedido <CreditCard className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-8 text-center text-[#2d3a1a]/30 text-[10px] font-black uppercase tracking-widest">
          Verifica tu pedido antes de confirmar • CafeMApp ITO
        </p>
      </div>
    </div>
  );
};

export default Carrito;