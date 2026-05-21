import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";
import IngredientForm from "./IngredientForm";

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);

  const [ingredientesCatalogo, setIngredientesCatalogo] = useState([]);
  const [ingredientesProducto, setIngredientesProducto] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [modalIngredienteAbierto, setModalIngredienteAbierto] = useState(false);
  const [configIngrediente, setConfigIngrediente] = useState({
    quantity: "",
    unit: "",
    is_optional: false,
    max_quantity: "",
    min_quantity: "",
  });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipoProducto, setTipoProducto] = useState("Meal");
  const [stock, setStock] = useState("");
  const [disponible, setDisponible] = useState(false);
  const [urlImagen, setUrlImagen] = useState("");

  const [tiempoPreparacion, setTiempoPreparacion] = useState("");
  const [volumen, setVolumen] = useState("");
  const [tamanoDessert, setTamanoDessert] = useState("");
  const [tamanoSnack, setTamanoSnack] = useState("");
  const [esEmpaquetado, setEsEmpaquetado] = useState(false);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/menu/products/")
      .then((r) => r.json())
      .then((data) => setProductos(data))
      .catch(() =>
        notify({ type: "error", title: "Error al cargar productos", duration: 3000 })
      );
  }, []);

  const abrirModal = () => {
    setModalAbierto(true);
    fetchWithAuth("http://localhost:8000/menu/ingredients/")
      .then((r) => r.json())
      .then((data) => setIngredientesCatalogo(data))
      .catch(() =>
        notify({ type: "error", title: "Error al cargar ingredientes", duration: 3000 })
      );
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setDisponible(false);
    setUrlImagen("");
    setTiempoPreparacion("");
    setVolumen("");
    setTamanoDessert("");
    setTamanoSnack("");
    setEsEmpaquetado(false);
    setIngredientesProducto([]);
    setIngredienteSeleccionado(null);
    setBusqueda("");
    setConfigIngrediente({
      quantity: "",
      unit: "",
      is_optional: false,
      max_quantity: "",
      min_quantity: "",
    });
  };

  const handleAgregarIngrediente = () => {
    if (!ingredienteSeleccionado) return;

    const yaExiste = ingredientesProducto.some(
      (i) => i.ingredient === ingredienteSeleccionado.id
    );
    if (yaExiste) {
      notify({ type: "warning", title: "Este ingrediente ya fue agregado", duration: 3000 });
      return;
    }

    setIngredientesProducto((prev) => [
      ...prev,
      {
        ingredient: ingredienteSeleccionado.id,
        nombre: ingredienteSeleccionado.name,
        unit: configIngrediente.unit || ingredienteSeleccionado.unit,
        quantity: configIngrediente.quantity,
        is_optional: configIngrediente.is_optional,
        max_quantity: configIngrediente.max_quantity,
        min_quantity: configIngrediente.min_quantity,
      },
    ]);

    setIngredienteSeleccionado(null);
    setBusqueda("");
    setConfigIngrediente({
      quantity: "",
      unit: "",
      is_optional: false,
      max_quantity: "",
      min_quantity: "",
    });
  };

  const handleEliminarIngrediente = (id) => {
    setIngredientesProducto((prev) => prev.filter((i) => i.ingredient !== id));
  };

  const handleIngredienteCreado = (nuevoIngrediente) => {
    setIngredientesCatalogo((prev) => [...prev, nuevoIngrediente]);
    setIngredienteSeleccionado(nuevoIngrediente);
    setBusqueda(nuevoIngrediente.name);
    setConfigIngrediente((prev) => ({ ...prev, unit: nuevoIngrediente.unit }));
  };

  const manejarGuardar = async (e) => {
    e.preventDefault();

    const body = {
      name: nombre,
      description: descripcion,
      price: parseFloat(precio) || null,
      product_type: tipoProducto.toLowerCase(),
      stock: parseInt(stock) || null,
      is_available: disponible,
      image_url: urlImagen,
      ingredients: ingredientesProducto.map(
        ({ ingredient, quantity, unit, is_optional, max_quantity, min_quantity }) => ({
          ingredient,
          quantity,
          unit,
          is_optional,
          max_quantity,
          min_quantity,
        })
      ),
      meal: tipoProducto === "Meal" ? { preparation_time: parseInt(tiempoPreparacion) || null } : undefined,
      drink: tipoProducto === "Drink" ? { volume: parseInt(volumen) || null } : undefined,
      dessert: tipoProducto === "Dessert" ? { size: tamanoDessert } : undefined,
      snack: tipoProducto === "Snack" ? { size: tamanoSnack, is_packaged: esEmpaquetado } : undefined,
    };

    try {
      const response = await fetchWithAuth("http://localhost:8000/menu/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const nuevo = await response.json();
        setProductos((prev) => [...prev, nuevo]);
        notify({ type: "success", title: "Producto registrado", duration: 3000 });
        cerrarModal();
      } else {
        const error = await response.json();
        notify({ type: "error", title: "Error al registrar", message: JSON.stringify(error), duration: 5000 });
      }
    } catch {
      notify({ type: "error", title: "Error al conectarse al servidor", duration: 4000 });
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-semibold text-gray-700 text-sm";
  const labelClass = "text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block";

  return (
    <div className="flex min-h-screen bg-[#F4F3ED]" style={{ fontFamily: "sans-serif" }}>

      {/* SIDEBAR */}
      <div className="w-64 bg-[#2D3A22] text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold italic tracking-wide">CafeMApp</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1 font-bold">Panel Admin</p>
          </div>
          <nav className="space-y-3">
            <button className="w-full text-left bg-[#E87324] py-3 px-4 rounded-2xl font-bold text-sm">
              📝 Menú
            </button>
            <button className="w-full text-left text-gray-300 hover:bg-[#3D4F31] py-3 px-4 rounded-2xl font-bold text-sm transition">
              📦 Pedidos
            </button>
          </nav>
        </div>
        <div className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wide">
          Instituto Tecnológico de Oaxaca
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#2D3A22] italic">Gestión de Inventario</h1>
            <p className="text-gray-500 text-sm mt-1">Controla los productos disponibles de la cafetería.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModalIngredienteAbierto(true)}
              className="bg-[#3D4F31] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#2D3A22] shadow-lg transition text-sm uppercase tracking-wider"
            >
              + Nuevo Ingrediente
            </button>
            <button
              onClick={abrirModal}
              className="bg-[#E87324] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d6641e] shadow-lg transition text-sm uppercase tracking-wider"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-[32px] p-8 shadow-md border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] tracking-widest text-gray-400 uppercase font-bold">
                <th className="pb-4 pl-4">Producto</th>
                <th className="pb-4">Tipo</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4">Precio</th>
                <th className="pb-4 pr-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/50 transition text-gray-700">
                  <td className="py-4 pl-4 font-bold text-[#2D3A22]">{prod.name}</td>
                  <td className="py-4 text-sm font-semibold text-gray-500">{prod.product_type}</td>
                  <td className="py-4 text-sm font-bold text-orange-600">{prod.stock} pz</td>
                  <td className="py-4 font-black text-lg text-gray-800">${parseFloat(prod.price).toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INGREDIENTE (desde el botón del header) */}
      <IngredientForm
        isOpen={modalIngredienteAbierto && !modalAbierto}
        onClose={() => setModalIngredienteAbierto(false)}
        onCreated={(nuevo) => {
          setIngredientesCatalogo((prev) => [...prev, nuevo]);
        }}
      />

      {/* MODAL PRODUCTO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4F3ED] w-full max-w-2xl rounded-[35px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white">

            <h2 className="text-3xl font-black text-[#2D3A22] mb-8 italic">Agregar Producto</h2>

            <form onSubmit={manejarGuardar} className="space-y-6">

              {/* DATOS GENERALES */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Descripción</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={`${inputClass} h-20`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Precio ($)</label>
                    <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de Producto</label>
                    <select value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)} className={inputClass}>
                      <option value="Meal">Comida (Meal)</option>
                      <option value="Drink">Bebida (Drink)</option>
                      <option value="Dessert">Postre (Dessert)</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className={labelClass}>Stock (Cantidad)</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="flex items-center sm:pt-5 pl-1">
                    <input type="checkbox" id="disponible" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
                    <label htmlFor="disponible" className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">¿Está disponible?</label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>URL de la Imagen</label>
                  <input type="text" value={urlImagen} onChange={(e) => setUrlImagen(e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
              </div>

              {/* ESPECIFICACIONES */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                {tipoProducto === "Meal" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Comida</h4>
                    <div>
                      <label className={labelClass}>Tiempo de preparación (min)</label>
                      <input type="number" value={tiempoPreparacion} onChange={(e) => setTiempoPreparacion(e.target.value)} className={inputClass} placeholder="Minutos" />
                    </div>
                  </div>
                )}
                {tipoProducto === "Drink" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Bebida</h4>
                    <div>
                      <label className={labelClass}>Volumen (ml)</label>
                      <input type="number" value={volumen} onChange={(e) => setVolumen(e.target.value)} className={inputClass} placeholder="ml" />
                    </div>
                  </div>
                )}
                {tipoProducto === "Dessert" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Postre</h4>
                    <div>
                      <label className={labelClass}>Tamaño</label>
                      <input type="text" value={tamanoDessert} onChange={(e) => setTamanoDessert(e.target.value)} className={inputClass} placeholder="Ej. Rebanada, Individual..." />
                    </div>
                  </div>
                )}
                {tipoProducto === "Snack" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Snack</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Tamaño</label>
                        <input type="text" value={tamanoSnack} onChange={(e) => setTamanoSnack(e.target.value)} className={inputClass} placeholder="Ej. Regular, Grande" />
                      </div>
                      <div className="flex items-center sm:pt-5 pl-1">
                        <input type="checkbox" id="esEmpaquetado" checked={esEmpaquetado} onChange={(e) => setEsEmpaquetado(e.target.checked)} className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
                        <label htmlFor="esEmpaquetado" className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">¿Es empaquetado?</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* INGREDIENTES */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
                <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Ingredientes</h4>

                <div className="relative">
                  <label className={labelClass}>Buscar ingrediente</label>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setIngredienteSeleccionado(null); }}
                    placeholder="Escribe para buscar..."
                    className={inputClass}
                  />
                  {busqueda && !ingredienteSeleccionado && (
                    <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-2xl mt-1 shadow-lg overflow-hidden">
                      {ingredientesCatalogo
                        .filter((i) => i.name.toLowerCase().includes(busqueda.toLowerCase()))
                        .slice(0, 5)
                        .map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => {
                              setIngredienteSeleccionado(i);
                              setBusqueda(i.name);
                              setConfigIngrediente((prev) => ({ ...prev, unit: i.unit }));
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold text-[#2D3A22] transition-colors border-b border-gray-50 last:border-0"
                          >
                            {i.name}
                            <span className="ml-2 text-[10px] text-gray-400 font-semibold uppercase">{i.unit}</span>
                          </button>
                        ))}
                      {ingredientesCatalogo.filter((i) =>
                        i.name.toLowerCase().includes(busqueda.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-400 font-semibold flex justify-between items-center">
                          No encontrado
                          <button
                            type="button"
                            onClick={() => setModalIngredienteAbierto(true)}
                            className="text-[#E87324] font-black text-xs uppercase tracking-wider hover:underline"
                          >
                            + Registrar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {ingredienteSeleccionado && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                    <p className="text-xs font-black text-[#2D3A22] uppercase tracking-wider">
                      {ingredienteSeleccionado.name}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "quantity", label: "Cantidad base" },
                        { name: "min_quantity", label: "Mínimo" },
                        { name: "max_quantity", label: "Máximo" },
                        { name: "unit", label: "Unidad" },
                      ].map(({ name, label }) => (
                        <div key={name}>
                          <label className="text-[10px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">{label}</label>
                          <input
                            type={name === "unit" ? "text" : "number"}
                            value={configIngrediente[name]}
                            onChange={(e) => setConfigIngrediente((prev) => ({ ...prev, [name]: e.target.value }))}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none font-semibold text-gray-700 text-sm focus:border-[#2D3A22]"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_optional"
                        checked={configIngrediente.is_optional}
                        onChange={(e) => setConfigIngrediente((prev) => ({ ...prev, is_optional: e.target.checked }))}
                        className="w-4 h-4 accent-[#2D3A22] cursor-pointer"
                      />
                      <label htmlFor="is_optional" className="text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">
                        ¿Es opcional?
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAgregarIngrediente}
                      className="w-full py-2.5 bg-[#2D3A22] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#1E2717] transition"
                    >
                      + Agregar ingrediente
                    </button>
                  </div>
                )}

                {ingredientesProducto.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Ingredientes del producto
                    </p>
                    {ingredientesProducto.map((ing) => (
                      <div key={ing.ingredient} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <div>
                          <span className="text-sm font-black text-[#2D3A22]">{ing.nombre}</span>
                          <span className="ml-2 text-[10px] text-gray-400 font-semibold">
                            {ing.quantity} {ing.unit} • min {ing.min_quantity} • max {ing.max_quantity}
                            {ing.is_optional && " • opcional"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEliminarIngrediente(ing.ingredient)}
                          className="text-gray-300 hover:text-red-500 transition-colors ml-4"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTONES */}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={cerrarModal} className="px-6 py-3.5 text-gray-400 hover:text-gray-600 font-bold text-sm transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-[#2D3A22] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md hover:bg-[#1E2717] transition uppercase tracking-wider">
                  Publicar Producto
                </button>
              </div>
            </form>
          </div>

          {/* MODAL INGREDIENTE (desde dentro del modal de producto) */}
          <IngredientForm
            isOpen={modalIngredienteAbierto}
            onClose={() => setModalIngredienteAbierto(false)}
            onCreated={handleIngredienteCreado}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;