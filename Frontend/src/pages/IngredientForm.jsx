import React, { useState } from "react";
import { X, Leaf } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const UNIDADES = ["g", "ml", "pieza", "taza", "cucharada", "cucharadita"];

const ALERGENOS = [
  "Lácteos", "Gluten", "Huevo", "Mariscos", "Pescado",
  "Nueces", "Maní", "Soya", "Sésamo",
];

const initialForm = {
  name: "",
  description: "",
  is_allergen: false,
  allergen_type: "",
  unit: "",
  base_quantity: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
  stock: "",
  allows_extra: false,
  allows_removal: false,
  extra_price: "",
};

const IngredientForm = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Si desmarca alérgeno, limpia el tipo
      ...(name === "is_allergen" && !checked ? { allergen_type: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetchWithAuth("http://localhost:8000/menu/ingredients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          base_quantity: parseFloat(form.base_quantity) || null,
          calories: parseFloat(form.calories) || null,
          protein: parseFloat(form.protein) || null,
          carbohydrates: parseFloat(form.carbohydrates) || null,
          fat: parseFloat(form.fat) || null,
          stock: parseFloat(form.stock) || null,
          extra_price: parseFloat(form.extra_price) || null,
        }),
      });

      if (response.ok) {
        const nuevo = await response.json();
        notify({ type: "success", title: "Ingrediente registrado", duration: 3000 });
        onCreated?.(nuevo); // devuelve el ingrediente creado al padre
        setForm(initialForm);
        onClose();
      } else {
        const error = await response.json();
        notify({
          type: "error",
          title: "Error al registrar",
          message: JSON.stringify(error),
          duration: 5000,
        });
      }
    } catch {
      notify({ type: "error", title: "Error al conectarse al servidor", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-semibold text-gray-700 text-sm";
  const labelClass =
    "text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#F4F3ED] w-full max-w-2xl rounded-[35px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#2D3A22] italic">
            Nuevo Ingrediente
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#2D3A22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* DATOS GENERALES */}
          <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Datos generales
            </h4>

            <div>
              <label className={labelClass}>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange}
                className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                className={`${inputClass} h-20`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Unidad</label>
                <select name="unit" value={form.unit} onChange={handleChange}
                  className={inputClass} required>
                  <option value="">Seleccionar...</option>
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Cantidad base</label>
                <input type="number" name="base_quantity" value={form.base_quantity}
                  onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" name="stock" value={form.stock}
                onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          {/* ALÉRGENOS */}
          <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Alérgenos
            </h4>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_allergen" name="is_allergen"
                checked={form.is_allergen} onChange={handleChange}
                className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
              <label htmlFor="is_allergen"
                className="text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">
                ¿Es alérgeno?
              </label>
            </div>

            {form.is_allergen && (
              <div>
                <label className={labelClass}>Tipo de alérgeno</label>
                <select name="allergen_type" value={form.allergen_type}
                  onChange={handleChange} className={inputClass} required>
                  <option value="">Seleccionar...</option>
                  {ALERGENOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* INFORMACIÓN NUTRICIONAL */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Información nutricional
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "calories", label: "Calorías (kcal)" },
                { name: "protein", label: "Proteína (g)" },
                { name: "carbohydrates", label: "Carbohidratos (g)" },
                { name: "fat", label: "Grasa (g)" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input type="number" step="0.1" name={name}
                    value={form[name]} onChange={handleChange} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* PERSONALIZACIÓN */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Personalización
            </h4>

            <div className="flex gap-6">
              {[
                { name: "allows_extra", label: "¿Permite extra?" },
                { name: "allows_removal", label: "¿Permite retiro?" },
              ].map(({ name, label }) => (
                <div key={name} className="flex items-center gap-2">
                  <input type="checkbox" id={name} name={name}
                    checked={form[name]} onChange={handleChange}
                    className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
                  <label htmlFor={name}
                    className="text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>

            {form.allows_extra && (
              <div>
                <label className={labelClass}>Precio por extra ($)</label>
                <input type="number" step="0.01" name="extra_price"
                  value={form.extra_price} onChange={handleChange} className={inputClass} required />
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-6 py-3.5 text-gray-400 hover:text-gray-600 font-bold text-sm transition">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-[#2D3A22] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md hover:bg-[#1E2717] transition uppercase tracking-wider disabled:opacity-50">
              {loading ? "Guardando..." : "Registrar Ingrediente"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default IngredientForm;