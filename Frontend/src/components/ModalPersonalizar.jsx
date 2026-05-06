import React from 'react';
import { X, Check, Leaf, Coffee, Pizza } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  // Definimos las opciones según la categoría
  const opcionesPorCategoria = {
    "Comida": {
      titulo: "¿Qué le quitamos?",
      icono: <Pizza className="w-4 h-4 text-orange-500" />,
      items: ['Cebolla', 'Crema', 'Cilantro', 'Picante']
    },
    "Bebidas": {
      titulo: "Personaliza tu bebida",
      icono: <Coffee className="w-4 h-4 text-orange-500" />,
      items: ['Sin Azúcar', 'Leche Deslactosada', 'Extra Caliente', 'Hielo']
    },
    "Postres": {
      titulo: "Toppings",
      icono: <Leaf className="w-4 h-4 text-orange-500" />,
      items: ['Sin Nuez', 'Extra Chocolate', 'Sin Jarabe']
    }
  };

  // Obtenemos las opciones del producto actual o unas por defecto
  const configuracion = opcionesPorCategoria[producto.cat] || opcionesPorCategoria["Comida"];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header con imagen del producto */}
        <div className="h-40 bg-[#2d3a1a] relative">
          <img src={producto.img} className="w-full h-full object-cover opacity-50" alt="" />
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all">
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-8">
            <h2 className="text-white text-3xl font-black tracking-tighter italic">Personalizar</h2>
            <p className="text-orange-400 font-bold text-xs uppercase tracking-widest">{producto.nombre}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            
            {/* Sección Dinámica */}
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                {configuracion.icono} {configuracion.titulo}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {configuracion.items.map((ing) => (
                  <label key={ing} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                    <input type="checkbox" className="hidden peer" />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:bg-orange-500 peer-checked:border-orange-500 flex items-center justify-center transition-all">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-[#2d3a1a]">{ing}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4">Notas adicionales</h4>
              <textarea 
                placeholder="Ej: El café bien caliente, por favor..." 
                className="w-full p-5 bg-gray-50 rounded-[2rem] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium h-24 transition-all"
              />
            </section>
          </div>

          <div className="mt-10">
            <button className="w-full bg-[#2d3a1a] hover:bg-[#1a2310] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
              Agregar al carrito por ${producto.precio}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;