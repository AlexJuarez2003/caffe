import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const Carrito = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [idExpandido, setIdExpandido] = useState(null);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/shopping-cart/my-cart/")
      .then((response) => response.json())
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
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

  const alternarExpansion = (id) => {
    setIdExpandido(idExpandido === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f3f4ed] p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Botón Volver al Menú */}
        <button
          onClick={() => navigate("/menu")}
          className="mb-8 flex items-center gap-2 text-[#2d3a1a]/60 hover:text-[#2d3a1a] font-black text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Menú
        </button>

        <h2 className="text-4xl font-black text-[#2d3a1a] tracking-tighter italic mb-8">
          Mi Carrito
        </h2>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 overflow-hidden transition-all">
              <div 
                className="p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors" 
                onClick={() => alternarExpansion(item.id)}
              >
                <div className="flex-1">
                  <h3 className="font-black text-[#2d3a1a] text-lg">
                    {item.product_name}
                  </h3>
                  <p className="text-[10px] text-orange-600 font-black uppercase italic">
                    {item.notes}
                  </p>
                  <span className="block mt-2 font-bold text-[#2d3a1a]">
                    ${item.subtotal}
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                  <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-orange-500">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-[#2d3a1a]">
                    {item.quantity}
                  </span>
                  <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-orange-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button className="ml-4 p-4 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {idExpandido === item.id && (
                !item.ingredients.length == 0
                ?
                <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-px bg-gray-100 w-full mb-6"></div>
                  <div className="space-y-6">
                    
                    <div>
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-3 italic">Ingredientes personalizados</h4>
                      <div className="space-y-3">
                        {item.ingredients.map((ingredient, id) => (
                          <div key={id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="font-black text-[#2d3a1a] text-sm">{ingredient.ingredient.name + " " + ingredient.action + " x" + item.quantity}</span>
                              <span className="font-bold text-[#2d3a1a] text-sm">+ ${ingredient.quantity * ingredient.extra_price * item.quantity}</span>
                            </div>
                            <p className="text-[10px] lowercase text-orange-600 font-black mt-1 italic">
                              {
                                ingredient.action === "extra"
                                ?
                                 "+ " + ingredient.ingredient.base_quantity * ingredient.quantity + " " + ingredient.ingredient.unit + " de " + ingredient.ingredient.description + " c/u"
                                :
                                 "- " + ingredient.quantity + " " + ingredient.ingredient.unit + " de " + ingredient.ingredient.description + " c/u"
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
                :
                <div></div>
              )}

              
            </div>
          ))}
        </div>

        {/* Resumen de Pago */}
        <div className="mt-10 bg-[#2d3a1a] rounded-[3rem] p-8 text-white shadow-2xl shadow-[#2d3a1a]/30">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-black italic">Total a pagar</span>
              <span className="text-3xl font-black text-orange-400">
                ${total}
              </span>
            </div>
          </div>

          <button
            onClick={() => alert("¡Pedido enviado a la cocina!")}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-4x1 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-orange-900/40 flex items-center justify-center gap-3 active:scale-95"
          >
            Realizar Pedido <CreditCard className="w-5 h-5" />
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
