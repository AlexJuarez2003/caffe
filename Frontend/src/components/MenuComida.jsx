import React, { useState } from 'react';
import { Clock, Star, Flame, Plus, Settings2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartDrawer from './CarritoLateral';
import CustomModal from './ModalPersonalizar';

const FoodMenu = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- ESTADOS PARA EL MODAL Y CARRITO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [carrito, setCarrito] = useState([]); 
  const [notificacion, setNotificacion] = useState({ visible: false, nombre: "" });

  const productos = [
    {
      id: 1,
      nombre: "Chilaquiles Oaxaqueños",
      precio: 65,
      desc: "Con tasajo y salsa de la casa.",
      cat: "Comida",
      tiempo: "15 min",
      etiquetas: ["Picante", "Popular"],
      img: "https://images.unsplash.com/photo-1634325091807-684c798c5665?q=80&w=400"
    },
    {
      id: 2,
      nombre: "Latte Especial",
      precio: 45,
      desc: "Café de grano con leche cremosa.",
      cat: "Bebidas",
      tiempo: "5 min",
      etiquetas: ["Popular"],
      img: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400"
    },
    {
      id: 3,
      nombre: "Brownie Triple Chocolate",
      precio: 35,
      desc: "Postre horneado con nuez.",
      cat: "Postres",
      tiempo: "2 min",
      etiquetas: ["Nuevo"],
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400"
    }
  ];

  // Función para agregar directo (Botón naranja +)
  const agregarAlCarrito = (producto) => {
    // Generamos un idUnico para poder eliminarlo después sin borrar duplicados
    const nuevoItem = { ...producto, idUnico: Date.now(), cantidad: 1 };
    setCarrito(prev => [...prev, nuevoItem]); 
    
    setNotificacion({ visible: true, nombre: producto.nombre });
    setTimeout(() => setNotificacion({ visible: false, nombre: "" }), 2000);
  };

  const openCustomModal = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const onAgregarDesdeModal = (productoPersonalizado) => {
    // También asignamos idUnico aquí para que el botón de eliminar funcione
    setCarrito(prev => [...prev, { ...productoPersonalizado, idUnico: Date.now(), cantidad: 1 }]);
    setIsModalOpen(false);
    setNotificacion({ visible: true, nombre: productoPersonalizado.nombre });
    setTimeout(() => setNotificacion({ visible: false, nombre: "" }), 2000);
  };

  const categorias = ['Todos', 'Comida', 'Bebidas', 'Postres', 'Snacks'];

  return (
    <div className="p-8 bg-[#f3f4ed] min-h-screen pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Notificación Flotante de éxito */}
        {notificacion.visible && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-200 bg-[#2d3a1a] text-white px-8 py-4 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
             ¡{notificacion.nombre} agregado exitosamente! 🥳
          </div>
        )}

        {/* Componentes de Interfaz */}
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={carrito} 
          setItems={setCarrito} // <--- CONEXIÓN PARA ELIMINAR ACTIVADA
        />
        
        <CustomModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          producto={selectedProduct} 
          onAgregar={onAgregarDesdeModal} 
        />

        <button 
          onClick={() => navigate('/perfil')}
          className="mb-8 flex items-center gap-2 text-[#2d3a1a] font-black text-xs uppercase tracking-widest hover:text-orange-500 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Ir a mi perfil
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-5xl font-black text-[#2d3a1a] tracking-tighter italic">Nuestro Menú</h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">Instituto Tecnológico de Oaxaca</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categorias.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  categoria === cat 
                  ? 'bg-[#2d3a1a] text-white shadow-xl' 
                  : 'bg-white text-[#2d3a1a] hover:bg-gray-100 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productos.filter(p => categoria === 'Todos' || p.cat === categoria).map(producto => (
            <div key={producto.id} className="group bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all border border-gray-100 relative">
              
              <div className="h-64 overflow-hidden relative">
                <img src={producto.img} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-black text-[#2d3a1a]">{producto.tiempo}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex gap-2 mb-4">
                  {producto.etiquetas.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-black text-[#2d3a1a] mb-2">{producto.nombre}</h3>
                <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">{producto.desc}</p>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#2d3a1a] tracking-tighter">${producto.precio}</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => openCustomModal(producto)}
                      className="p-4 bg-gray-50 text-[#2d3a1a] rounded-3x1 hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <Settings2 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => agregarAlCarrito(producto)} 
                      className="p-4 bg-orange-500 text-white rounded-3x1 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-90"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTÓN FLOTANTE: Muestra cantidad real en el carrito */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-10 right-10 z-50 bg-[#2d3a1a] text-white p-6 rounded-[2.5rem] shadow-2xl shadow-[#2d3a1a]/40 hover:scale-110 transition-all active:scale-95 flex items-center gap-4 group"
        >
          <div className="relative">
            <ShoppingBag className="w-7 h-7 text-orange-500" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2d3a1a]">
              {carrito.length}
            </span>
          </div>
          <span className="font-black text-xs uppercase tracking-[0.2em] pr-2">Ver mi pedido</span>
        </button>

      </div>
    </div>
  );
};

export default FoodMenu;