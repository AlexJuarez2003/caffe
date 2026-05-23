import React, { useState, useEffect } from "react";
import { X, Check, Leaf, Coffee, Pizza, Plus, ShoppingCart, ShoppingBag, } from "lucide-react";
import { notify } from "../components/Notificacion";

const CustomModal = ({
  isOpen,
  onClose,
  producto,
  onAgregar,
  onAgregarDirecto
}) => {
  const img =
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400";

  const [ingredientes, setIngredientes] = useState([]);

  const [formData, setFormData] = useState({
    product: producto?.id,
    quantity: 1,
    notes: "",
    ingredients: [],
  });

  const handleCartItem = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIngredients = (ing, nuevaCantidad) => {
    if (nuevaCantidad === ing.quantity) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter(
          (item) => item.ingredient !== ing.ingredient,
        ),
      }));
      return;
    }

    const action = nuevaCantidad > ing.quantity ? "extra" : "remover";

    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients.filter(
          (item) => item.ingredient !== ing.ingredient,
        ),
        {
          ingredient: ing.ingredient,
          action,
          quantity: nuevaCantidad,
        },
      ],
    }));
  };

  useEffect(() => {
    if (!producto?.id) return;

    fetch(`http://localhost:8000/menu/products/${producto.id}/`)
      .then((response) => response.json())
      .then((data) => {
        setIngredientes(
          data.ingredients.map((ing) => ({
            ...ing,
            selected_quantity: ing.quantity,
          })),
        );
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

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="h-40 bg-[#2d3a1a] relative">
          <img
            src={producto.image_url ? producto.image_url : img}
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
              {producto.name}
            </h2>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-8">
            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Pizza className="w-4 h-4 text-green-600" />
                Personalice ingredientes
              </h4>
              <div className="flex flex-col gap-3">
                {ingredientes.map((ingrediente) => (
                  <label
                    key={ingrediente.ingredient}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent has-checked:border-orange-500 has-checked:bg-orange-50"
                  >
                    <span className="text-sm font-bold text-[#2d3a1a]">
                      {ingrediente.ingredient_name}
                    </span>
                    <input
                      type="number"
                      value={ingrediente.selected_quantity}
                      min={ingrediente.min_quantity}
                      max={ingrediente.max_quantity}
                      className="w-16 text-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1 text-sm font-bold text-[#2d3a1a] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      onChange={(e) => {
                        const raw = e.target.value;
                        setIngredientes((prev) =>
                          prev.map((item) =>
                            item.ingredient === ingrediente.ingredient
                              ? { ...item, selected_quantity: raw }
                              : item,
                          ),
                        );
                      }}
                      onBlur={(e) => {
                        const parsed =
                          e.target.value === ""
                            ? ingrediente.quantity
                            : Number(e.target.value);
                        const nuevaCantidad = Math.min(
                          Math.max(parsed, ingrediente.min_quantity),
                          ingrediente.max_quantity,
                        );
                        setIngredientes((prev) =>
                          prev.map((item) =>
                            item.ingredient === ingrediente.ingredient
                              ? { ...item, selected_quantity: nuevaCantidad }
                              : item,
                          ),
                        );
                        handleIngredients(ingrediente, nuevaCantidad);
                      }}
                    />
                    <span>{" " + ingrediente.unit}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-green-600" /> Seleccione cantidad
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <input
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  min={1}
                  max={10}
                  onChange={handleCartItem}
                />
              </div>
            </section>

            <section>
              <h4 className="text-[#2d3a1a] font-black text-sm uppercase tracking-widest mb-4">
                Ingrese notas opcionales
              </h4>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleCartItem}
                placeholder="Notas para el item"
                className="w-full p-5 bg-gray-50 rounded-4x1 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium h-24 transition-all"
              />
            </section>
          </div>

          <div className="mt-10">

            <div className="mt-10 flex gap-3">
              <button
                onClick={() => {
                  onAgregar({
                    product: producto.id,
                    quantity: Number(formData.quantity),
                    notes: formData.notes,
                    ingredients: formData.ingredients,
                  });
                }}
                className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#2d3a1a] py-5 rounded-4x1 font-black text-sm shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" /> Guardar en carrito
              </button>
              <button
                onClick={() => {
                  onAgregarDirecto({
                    idUnico: Date.now(),
                    product: producto.id,
                    nombre: producto.name,
                    img: producto.image_url,
                    price: producto.price,
                    quantity: Number(formData.quantity),
                    notes: formData.notes,
                    ingredients: formData.ingredients,
                  });
                }}
                className="flex-1 bg-[#2d3a1a] hover:bg-[#1a2310] text-white py-5 rounded-4x1 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" /> Pedir ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
