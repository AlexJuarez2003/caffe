import React, { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, ShoppingBag, Clock, ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistorialPedidos = () => {
  const navegar = useNavigate();
  const [idExpandido, setIdExpandido] = useState(null);

  // Datos detallados: Incluimos productos, repartidor y lugar exacto
  const listaPedidos = [
    {
      id: "PED-9921",
      fecha: "25 de Abril, 2026",
      total: 110,
      ubicacion: "Cafetería Principal ITO",
      puntoEntrega: "Mesas del Anexo K",
      estado: "Entregado",
      repartidor: "Juan Carlos (Becario)",
      productos: [
        { nombre: "Chilaquiles Oaxaqueños", precio: 65, detalles: "Sin cebolla, extra picante" },
        { nombre: "Latte Especial", precio: 45, detalles: "Leche deslactosada" }
      ]
    },
    {
      id: "PED-8842",
      fecha: "23 de Abril, 2026",
      total: 35,
      ubicacion: "Cafetería Principal",
      puntoEntrega: "Entrada de Laboratorios",
      estado: "Entregado",
      repartidor: "Ana Laura",
      productos: [
        { nombre: "Brownie Triple Chocolate", precio: 35, detalles: "Sin nuez" }
      ]
    }
  ];

  const alternarExpansion = (id) => {
    setIdExpandido(idExpandido === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f3f4ed] p-6 pb-24 relative">
      
      {/* Botón Volver al Perfil */}
      <button 
        onClick={() => navegar('/perfil')}
        className="fixed top-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group"
      >
        <ArrowLeft className="w-5 h-5 text-orange-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#2d3a1a] pr-2">Mi Perfil</span>
      </button>

      <div className="max-w-2xl mx-auto pt-16">
        
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black text-[#2d3a1a] tracking-tighter italic">Mis Pedidos</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Historial CafeMApp</p>
        </header>

        <div className="space-y-6">
          {listaPedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all">
              
              {/* Encabezado del Pedido */}
              <div 
                className="p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors" 
                onClick={() => alternarExpansion(pedido.id)}
              >
                <div className="flex gap-4 items-center">
                  <div className="bg-orange-500/10 p-4 rounded-2xl">
                    <ShoppingBag className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#2d3a1a] text-lg">{pedido.id}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pedido.fecha}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="block text-2xl font-black text-[#2d3a1a] tracking-tighter">${pedido.total}.00</span>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">● {pedido.estado}</span>
                </div>
              </div>

              {/* DETALLES EXPANDIDOS (Lo que pediste) */}
              {idExpandido === pedido.id && (
                <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-[1px] bg-gray-100 w-full mb-6"></div>
                  
                  <div className="space-y-6">
                    {/* Sección: ¿Qué pidió? */}
                    <div>
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3 italic">Productos</h4>
                      <div className="space-y-3">
                        {pedido.productos.map((prod, index) => (
                          <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="font-black text-[#2d3a1a] text-sm">{prod.nombre}</span>
                              <span className="font-bold text-[#2d3a1a] text-sm">${prod.precio}</span>
                            </div>
                            <p className="text-[10px] text-orange-600 font-black uppercase mt-1 italic">{prod.detalles}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sección: Entrega y Repartidor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-gray-200 pt-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lugar de Entrega</p>
                          <p className="text-xs font-bold text-[#2d3a1a]">{pedido.ubicacion}</p>
                          <p className="text-[10px] text-gray-400 italic">{pedido.puntoEntrega}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entregado por</p>
                          <p className="text-xs font-bold text-[#2d3a1a]">{pedido.repartidor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => alternarExpansion(pedido.id)}
                className="w-full py-2 bg-gray-50 flex justify-center text-gray-300 hover:text-orange-500 transition-colors"
              >
                {idExpandido === pedido.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navegar('/menu')}
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