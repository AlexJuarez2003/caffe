import React, { useState, useEffect } from "react";
import { X, Check, Leaf, Coffee, Pizza, Plus } from "lucide-react";
import { notify } from "../components/Notificacion";

const CustomModal = ({ isOpen, onClose, producto, onAgregar }) => {
  const img = "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400";

  const [ingredientes, setIngredientes] = useState([]);

  const [formData, setFormData] = useState({
    product: producto?.id,
    quantity: 1,
    notes: "",
    ingredients: []
  });

  const handleProduct = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIngredients = (ingredientId, action, quantity) => {

  setFormData((prev) => ({
    ...prev,
    ingredients: [
      ...prev.ingredients.filter(
        (item) => item.ingredient !== ingredientId
      ),
      {
        ingredient: ingredientId,
        action: action,
        quantity: quantity,
      }
    ]
  }));
};

  useEffect(() => {
    if (!producto?.id) return;

    fetch(`http://localhost:8000/menu/products/${producto.id}/`)
      .then((response) => response.json())
      .then((data) => {
        producto = data;
        setIngredientes(producto.ingredients);
      })
      .catch((error) => {
        notify({
          type: "error",
          title: "Error al comunicarse con el servidor",
          message: error,
          duration: 4000,
        });
      });
  }, [isOpen, producto]);

  if (!isOpen || !producto) return null;

  // --- ESTA FUNCIÓN HACE QUE EL BOTÓN FUNCIONE ---
  const handleAgregarAlCarrito = () => {
    const itemPersonalizado = {
      ...producto,
      precio: precioFinal, // Enviamos el precio ya sumado
      extras: extrasSeleccionados.map((e) => e.nombre),
      notas: notasAdicionales,
      cantidad: 1,
    };

    onAgregar(itemPersonalizado); // Enviamos al FoodMenu
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="h-40 bg-[#2d3a1a] relative">
          <img
            src={img}
            className="w-full h-full object-cover opacity-50"
            alt=""
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-8">
            <h2 className="text-white text-3xl font-black tracking-tighter italic">
              { producto.name }
            </h2>
            <p className="text-orange-400 font-bold text-xs uppercase tracking-widest">
              Personalizar
            </p>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-8">
            {/* Sección: Quitar */}
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                "Qué agregamos"
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {ingredientes.map((ing) => (
                  <label
                    key={ing.ingredient}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent has-checked:border-orange-500 has-checked:bg-orange-50"
                  >
                    
                    <span className="text-sm font-bold text-[#2d3a1a]">
                      {ing.ingredient_name}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* SECCIÓN DINÁMICA DE EXTRAS */}
            {ingredientes.length > 0 && (
              <section>
                <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" /> ¿Qué le agregamos?
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  
                  
                </div>
              </section>
            )}

            {/* Notas dinámicas */}
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4">
                Notas adicionales
              </h4>
              <textarea
                placeholder="placeholder"
                className="w-full p-5 bg-gray-50 rounded-4x1 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium h-24 transition-all"
              />
            </section>
          </div>

          <div className="mt-10">
            {/* BOTÓN CONECTADO A LA FUNCIÓN */}
            <button
              className="w-full bg-[#2d3a1a] hover:bg-[#1a2310] text-white py-5 rounded-4x1 font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Agregar al carrito por $15
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
