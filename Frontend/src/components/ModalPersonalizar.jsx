import React, { useState, useEffect } from 'react';
import { X, Check, Leaf, Coffee, Pizza, Plus } from 'lucide-react';

// Agregamos 'onAgregar' a las props para que el botón pueda enviar datos al padre
const CustomModal = ({ isOpen, onClose, producto, onAgregar }) => {
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [notasAdicionales, setNotasAdicionales] = useState(""); // Estado para las notas

  useEffect(() => {
    setExtrasSeleccionados([]);
    setNotasAdicionales(""); // Limpiamos notas al abrir
  }, [isOpen, producto]);

  if (!isOpen || !producto) return null;

  const extrasPorCategoria = {
    "Comida": [
      { id: 'huevo', nombre: 'Huevo Estrellado', precio: 10 },
      { id: 'pollo', nombre: 'Pollo Extra', precio: 15 },
      { id: 'tasajo', nombre: 'Tasajo Oaxaqueño', precio: 25 },
      { id: 'quesillo', nombre: 'Quesillo Extra', precio: 12 },
    ],
    "Bebidas": [
      { id: 'shot', nombre: 'Shot de Expresso', precio: 15 },
      { id: 'jarabe', nombre: 'Jarabe de Vainilla', precio: 10 },
      { id: 'avena', nombre: 'Leche de Avena', precio: 12 },
      { id: 'crema_bat', nombre: 'Crema Batida', precio: 8 },
    ],
    "Postres": [
      { id: 'helado', nombre: 'Bola de Helado', precio: 20 },
      { id: 'chocolate', nombre: 'Extra Chocolate', precio: 10 },
      { id: 'fresas', nombre: 'Porción de Fresas', precio: 15 },
      { id: 'nuez', nombre: 'Extra Nuez', precio: 8 },
    ]
  };

  const opcionesConfig = {
    "Comida": {
      titulo: "¿Qué le quitamos?",
      icono: <Pizza className="w-4 h-4 text-orange-500" />,
      items: ['Cebolla', 'Crema', 'Cilantro', 'Picante'],
      placeholder: "Ej: Los chilaquiles bien crujientes, por favor..."
    },
    "Bebidas": {
      titulo: "Personaliza tu bebida",
      icono: <Coffee className="w-4 h-4 text-orange-500" />,
      items: ['Sin Azúcar', 'Hielo'],
      placeholder: "Ej: Sin popote y con poca azúcar, por favor..."
    },
    "Postres": {
      titulo: "Preferencias",
      icono: <Leaf className="w-4 h-4 text-orange-500" />,
      items: ['Sin Nuez', 'Sin Jarabe'],
      placeholder: "Ej: El brownie un poco caliente, por favor..."
    }
  };

  const configuracionActual = opcionesConfig[producto.cat] || opcionesConfig["Comida"];
  const extrasDisponibles = extrasPorCategoria[producto.cat] || [];

  const toggleExtra = (extra) => {
    if (extrasSeleccionados.find(e => e.id === extra.id)) {
      setExtrasSeleccionados(extrasSeleccionados.filter(e => e.id !== extra.id));
    } else {
      setExtrasSeleccionados([...extrasSeleccionados, extra]);
    }
  };

  const totalExtras = extrasSeleccionados.reduce((acc, item) => acc + item.precio, 0);
  const precioFinal = (parseFloat(producto.precio) || 0) + totalExtras;

  // --- ESTA FUNCIÓN HACE QUE EL BOTÓN FUNCIONE ---
  const handleAgregarAlCarrito = () => {
    const itemPersonalizado = {
      ...producto,
      precio: precioFinal, // Enviamos el precio ya sumado
      extras: extrasSeleccionados.map(e => e.nombre),
      notas: notasAdicionales,
      cantidad: 1
    };

    onAgregar(itemPersonalizado); // Enviamos al FoodMenu
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
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

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-8">
            
            {/* Sección: Quitar */}
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                {configuracionActual.icono} {configuracionActual.titulo}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {configuracionActual.items.map((ing) => (
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

            {/* SECCIÓN DINÁMICA DE EXTRAS */}
            {extrasDisponibles.length > 0 && (
              <section>
                <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" /> ¿Qué le agregamos?
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {extrasDisponibles.map((extra) => (
                    <label 
                      key={extra.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-green-50 transition-all border border-transparent has-[:checked]:border-green-500 has-[:checked]:bg-green-50"
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          onChange={() => toggleExtra(extra)}
                          checked={extrasSeleccionados.some(e => e.id === extra.id)}
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${extrasSeleccionados.some(e => e.id === extra.id) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                          <Plus className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-bold text-[#2d3a1a]">{extra.nombre}</span>
                      </div>
                      <span className="text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        +${extra.precio}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Notas dinámicas */}
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4">Notas adicionales</h4>
              <textarea 
                value={notasAdicionales}
                onChange={(e) => setNotasAdicionales(e.target.value)}
                placeholder={configuracionActual.placeholder} 
                className="w-full p-5 bg-gray-50 rounded-[2rem] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium h-24 transition-all"
              />
            </section>
          </div>

          <div className="mt-10">
            {/* BOTÓN CONECTADO A LA FUNCIÓN */}
            <button 
              onClick={handleAgregarAlCarrito}
              className="w-full bg-[#2d3a1a] hover:bg-[#1a2310] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Agregar al carrito por ${precioFinal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;