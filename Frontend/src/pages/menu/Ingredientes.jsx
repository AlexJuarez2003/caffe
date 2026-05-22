import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../helper/fetchWithAuth";
import { notify } from "../../components/Notificacion";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import IngredientForm from "../IngredientForm";

const Ingredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteEditar, setIngredienteEditar] = useState(null);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/menu/ingredients/")
      .then((r) => r.json())
      .then((data) => setIngredientes(data))
      .catch(() =>
        notify({
          type: "error",
          title: "Error al cargar ingredientes",
          duration: 3000,
        }),
      );
  }, []);

  const filtrados = ingredientes.filter((i) =>
    i.name.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleIngredienteCreado = (nuevo) => {
    setIngredientes((prev) => [...prev, nuevo]);
    setModalAbierto(false);
  };

  const handleIngredienteGuardado = (resultado, esEdicion) => {
    if (esEdicion) {
      setIngredientes((prev) =>
        prev.map((i) => (i.id === resultado.id ? resultado : i)),
      );
    } else {
      setIngredientes((prev) => [...prev, resultado]);
    }
  };

  const handleDeleteIngredient = (ingrediente) => {
    notify({
      type: "warning",
      title: "¿Eliminar ingrediente?",
      message: "Esta acción no se puede deshacer.",
      duration: 6000,
      action: {
        label: "Eliminar",
        onClick: () => {
          fetchWithAuth(
            `http://localhost:8000/menu/ingredients/${ingrediente}/`,
            {
              method: "DELETE",
            },
          )
            .then((response) => {
              if (response.ok) {
                setIngredientes((prev) =>
                  prev.filter((i) => i.id !== ingrediente),
                );
                notify({
                  type: "success",
                  title: "Ingrediente eliminado",
                  duration: 3000,
                });
              }
            })
            .catch(() =>
              notify({
                type: "error",
                title: "Error al eliminar ingrediente",
                duration: 3000,
              }),
            );
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#2D3A22] italic">
            Ingredientes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {ingredientes.length} ingredientes registrados
          </p>
        </div>
        <button
          onClick={() => {
            setIngredienteEditar(null);
            setModalAbierto(true);
          }}
          className="bg-[#E87324] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d6641e] shadow-lg transition text-sm uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Ingrediente
        </button>
      </div>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar ingrediente..."
        className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 font-semibold text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
      />

      <div className="bg-white rounded-4x1 shadow-md border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] tracking-widest text-gray-400 uppercase font-bold">
              <th className="pb-4 pt-6 pl-8">Ingrediente</th>
              <th className="pb-4 pt-6">Stock</th>
              <th className="pb-4 pt-6">Cantidad base</th>
              <th className="pb-4 pt-6">Calorías</th>
              <th className="pb-4 pt-6">Alérgeno</th>
              <th className="pb-4 pt-6">Extras</th>
              <th className="pb-4 pt-6 pr-8 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrados.map((ing) => (
              <tr
                key={ing.id}
                className="hover:bg-gray-50/50 transition text-gray-700"
              >
                <td className="py-4 pl-8">
                  <p className="font-black text-[#2D3A22] text-sm">
                    {ing.name}
                  </p>
                  <p className="text-[11px] text-gray-400 font-semibold mt-0.5 max-w-xs truncate">
                    {ing.description || "—"}
                  </p>
                </td>

                <td className="py-4">
                  <span className="font-black text-orange-600 text-sm">
                    {parseFloat(ing.stock).toFixed(0)}
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold ml-1">
                    {ing.unit}
                  </span>
                </td>

                <td className="py-4 text-sm font-semibold text-gray-500">
                  {parseFloat(ing.base_quantity).toFixed(0)} {ing.unit}
                </td>

                <td className="py-4 text-sm font-semibold text-gray-500">
                  {ing.calories ? `${ing.calories} kcal` : "—"}
                </td>

                <td className="py-4">
                  {ing.is_allergen ? (
                    <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      {ing.allergen_type || "Sí"}
                    </span>
                  ) : (
                    <span className="text-[11px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Ninguno
                    </span>
                  )}
                </td>

                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    {ing.allows_extra && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#2D3A22] bg-[#2D3A22]/10 px-2 py-0.5 rounded-full w-fit">
                        + Extra ${parseFloat(ing.extra_price).toFixed(2)}
                      </span>
                    )}
                    {ing.allows_removal && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                        Removible
                      </span>
                    )}
                    {!ing.allows_extra && !ing.allows_removal && (
                      <span className="text-[10px] text-gray-300 font-semibold">
                        —
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 pr-8">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setIngredienteEditar(ing);
                        setModalAbierto(true);
                      }}
                      className="p-2 text-gray-300 hover:text-[#2D3A22] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDeleteIngredient(ing.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-gray-300 font-black text-sm uppercase tracking-widest"
                >
                  No se encontraron ingredientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <IngredientForm
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setIngredienteEditar(null);
        }}
        onCreated={handleIngredienteGuardado}
        ingrediente={ingredienteEditar}
      />
    </div>
  );
};

export default Ingredientes;
