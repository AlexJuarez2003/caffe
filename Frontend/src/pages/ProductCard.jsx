import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CustomModal from './ModalPersonalizar'; // El que ajustamos con las categorías
import { ShoppingCart } from 'lucide-react';

const MenuComida = () => {
  // 1. Estado para el carrito y el modal
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Datos de ejemplo (Esto vendrá de tu backend en Django después)
  const productos = [
    {
      id: 1,
      nombre: "Chilaquiles Oaxaqueños",
      precio: 65,
      descripcion: "Con tasajo y salsa de la casa.",
      cat: "Comida",
      etiquetas: ["Picante", "Popular"],
      img: "https://url-de-tu-imagen.jpg" //
    },
    {
      id: 2,
      nombre: "Café Latte",
      precio: 45,
      descripcion: "Café de grano recién molido con leche espumosa.",
      cat: "Bebidas",
      etiquetas: ["Caliente"],
      img: "https://url-de-tu-cafe.jpg"
    }
  ];

  // 3. Funciones de control
  const agregarDirectoAlCarrito = (producto) => {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    console.log("Carrito actualizado:", carrito);
  };

  const abrirPersonalizacion = (producto) => {
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  const guardarProductoPersonalizado = (productoConExtras) => {
    setCarrito([...carrito, productoConExtras]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9f5] p-8">
      {/* Header del Menú */}
      <header className="mb-12">
        <h1 className="text-[#2d3a1a] text-6xl font-black italic tracking-tighter">Nuestro Menú Alexander Aquí</h1>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-2">
          Instituto Tecnológico de Oaxaca
        </p>
      </header>

      {/* Rejilla de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productos.map(prod => (
          <ProductCard 
            key={prod.id}
            producto={prod}
            onAgregar={agregarDirectoAlCarrito}
            onPersonalizar={abrirPersonalizacion}
          />
        ))}
      </div>

      {/* Modal de Personalización */}
      <CustomModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        producto={productoSeleccionado}
        onAgregar={guardarProductoPersonalizado}
      />

      {/* Botón flotante del carrito (opcional) */}
      <button className="fixed bottom-8 right-8 bg-[#2d3a1a] text-white p-6 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform">
        <ShoppingCart />
        <span className="font-black">{carrito.length} items</span>
      </button>
    </div>
  );
};

export default MenuComida;