import React, { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  CupSoda,
  Cake,
  Cookie,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartDrawer from "./CarritoLateral";
import CustomModal from "./ModalPersonalizar";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const FoodMenu = () => {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("all");
  const [productos, setProductos] = useState([]);

  const [isCartOpen, setIsCartOpen] = useState(false);


  // --- ESTADOS PARA EL MODAL Y CARRITO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const [carrito, setCarrito] = useState([]);
  const [notificacion, setNotificacion] = useState({
    visible: false,
    nombre: "",
  });

  const img =
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400";

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/menu/products/")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        notify({
          type: "error",
          title: "Error al comunicarse con el servidor",
          message: error,
          duration: 4000,
        });
      });
  }, []);

  // Enviar producto a personalizar
  const openCustomModal = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const onAgregarDesdeModal = (productoPersonalizado) => {
    // También asignamos idUnico aquí para que el botón de eliminar funcione
    setCarrito((prev) => [
      ...prev,
      { ...productoPersonalizado, idUnico: Date.now(), cantidad: 1 },
    ]);
    setIsModalOpen(false);
    setNotificacion({ visible: true, nombre: productoPersonalizado.nombre });
    setTimeout(() => setNotificacion({ visible: false, nombre: "" }), 2000);
  };

  const categorias = [
    { value: "all", label: "Todos" },
    { value: "meal", label: "Comida" },
    { value: "drink", label: "Bebidas" },
    { value: "dessert", label: "Postres" },
    { value: "snack", label: "Snacks" },
  ];

  // Función para agregar directo (Botón naranja +)
  const agregarAlCarrito = (producto) => {
    // Generamos un idUnico para poder eliminarlo después sin borrar duplicados
    const nuevoItem = { ...producto, idUnico: Date.now(), cantidad: 1 };
    setCarrito((prev) => [...prev, nuevoItem]);

    setNotificacion({ visible: true, nombre: producto.nombre });
    setTimeout(() => setNotificacion({ visible: false, nombre: "" }), 2000);
  };

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

        <div className="flex flex-row-reverse gap-6">
          <button
            onClick={() => navigate("/perfil")}
            className="mb-8 flex items-center gap-2 text-[#2d3a1a] font-black text-xs uppercase tracking-widest hover:text-orange-500 transition-colors group"
          >
            <User className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Mi perfil
          </button>

          <button
            onClick={() => navigate("/historial")}
            className="mb-8 flex items-center gap-2 text-[#2d3a1a] font-black text-xs uppercase tracking-widest hover:text-orange-500 transition-colors group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Mis pedidos
          </button>

          <button
            onClick={() => navigate("/carrito")}
            className="mb-8 flex items-center gap-2 text-[#2d3a1a] font-black text-xs uppercase tracking-widest hover:text-orange-500 transition-colors group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Carrito
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-5xl font-black text-[#2d3a1a] tracking-tighter italic">
              Menú de hoy
            </h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">
              Instituto Tecnológico de Oaxaca
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categorias.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  categoria === cat.value
                    ? "bg-[#2d3a1a] text-white shadow-xl"
                    : "bg-white text-[#2d3a1a] hover:bg-gray-100 shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item para el menú */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productos
            .filter((p) => categoria === "all" || p.product_type === categoria)
            .map((producto) => {
              const info = producto.meal?.preparation_time
                ? {
                    icon: Clock,
                    value: `${producto.meal.preparation_time} minutos`,
                  }
                : producto.drink?.volume
                  ? {
                      icon: CupSoda,
                      value: `${producto.drink.volume} ml`,
                    }
                  : producto.dessert?.size
                    ? {
                      icon: Cake,
                      value: `Tamaño ${producto.dessert.size}`,
                    }
                    : producto.snack?.size
                    ? {
                      icon: Cookie,
                      value: `Tamaño ${producto.snack.size}`,
                    }
                    : null;

              return (
                <div
                  key={producto.id}
                  className="group bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all border border-gray-100 relative"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={producto.image ? producto.image : img}
                      alt={producto.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {info && (
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                        <info.icon className="w-4 h-4 text-orange-500" />

                        <span className="text-xs font-black text-[#2d3a1a]">
                          {info.value}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="flex gap-2 mb-4">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                        {producto.product_type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#2d3a1a] mb-2">
                      {producto.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                      {producto.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-[#2d3a1a] tracking-tighter">
                        ${producto.price}
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openCustomModal(producto)}
                          className="p-4 bg-gray-50 text-[#2d3a1a] rounded-3x1 hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <ShoppingCart className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => agregarAlCarrito(producto)}
                          className="p-4 bg-orange-500 text-white rounded-3x1 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-90"
                        >
                          <ShoppingBag className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
          <span className="font-black text-xs uppercase tracking-[0.2em] pr-2">
            Ver mi pedido
          </span>
        </button>
      </div>
    </div>
  );
};

export default FoodMenu;
