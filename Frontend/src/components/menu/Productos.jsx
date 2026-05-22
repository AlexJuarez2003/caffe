import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchWithAuth } from "../../helper/FetchWithAuth";
import { notify } from "../../components/Notificacion";
import IngredientForm from "../../pages/IngredientForm";

const UNIDADES_TIPO = {
  Meal: {
    label: "Comida",
    campo: "preparation_time",
    placeholder: "Minutos",
    tipo: "number",
  },
  Drink: {
    label: "Bebida",
    campo: "volume",
    placeholder: "ml",
    tipo: "number",
  },
  Dessert: {
    label: "Postre",
    campo: "size",
    placeholder: "Ej. Rebanada, Individual...",
    tipo: "text",
  },
  Snack: { label: "Snack", campos: ["size", "is_packaged"] },
};

const initialForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  tipoProducto: "Meal",
  stock: "",
  disponible: false,
  urlImagen: "",
  tiempoPreparacion: "",
  volumen: "",
  tamanoDessert: "",
  tamanoSnack: "",
  esEmpaquetado: false,
};

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [ingredientesCatalogo, setIngredientesCatalogo] = useState([]);
  const [ingredientesProducto, setIngredientesProducto] = useState([]);
  const [busquedaIngrediente, setBusquedaIngrediente] = useState("");
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
  const [form, setForm] = useState(initialForm);
  const [productoEditar, setProductoEditar] = useState(null);
  const esEdicion = productoEditar !== null;

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/menu/products/")
      .then((r) => r.json())
      .then((data) => setProductos(data))
      .catch(() =>
        notify({
          type: "error",
          title: "Error al cargar productos",
          duration: 3000,
        }),
      );
  }, []);

  const abrirModal = () => {
    setModalAbierto(true);
    fetchWithAuth("http://localhost:8000/menu/ingredients/")
      .then((r) => r.json())
      .then((data) => setIngredientesCatalogo(data))
      .catch(() =>
        notify({
          type: "error",
          title: "Error al cargar ingredientes",
          duration: 3000,
        }),
      );
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditar(null);
    setForm(initialForm);
    setIngredientesProducto([]);
    setIngredienteSeleccionado(null);
    setBusquedaIngrediente("");
    setConfigIngrediente({
      quantity: "",
      unit: "",
      is_optional: false,
      max_quantity: "",
      min_quantity: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAgregarIngrediente = () => {
    if (!ingredienteSeleccionado) return;

    const yaExiste = ingredientesProducto.some(
      (i) => i.ingredient === ingredienteSeleccionado.id,
    );
    if (yaExiste) {
      notify({
        type: "warning",
        title: "Este ingrediente ya fue agregado",
        duration: 3000,
      });
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
    setBusquedaIngrediente("");
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
    setBusquedaIngrediente(nuevoIngrediente.name);
    setConfigIngrediente((prev) => ({ ...prev, unit: nuevoIngrediente.unit }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    const body = {
      name: form.nombre,
      description: form.descripcion,
      price: parseFloat(form.precio) || null,
      product_type: form.tipoProducto.toLowerCase(),
      stock: parseInt(form.stock) || null,
      is_available: form.disponible,
      image_url: form.urlImagen,
      ingredients: ingredientesProducto.map(
        ({
          ingredient,
          quantity,
          unit,
          is_optional,
          max_quantity,
          min_quantity,
        }) => ({
          ingredient,
          quantity,
          unit,
          is_optional,
          max_quantity,
          min_quantity,
        }),
      ),
      meal:
        form.tipoProducto === "Meal"
          ? { preparation_time: parseInt(form.tiempoPreparacion) || null }
          : null,
      drink:
        form.tipoProducto === "Drink"
          ? { volume: parseInt(form.volumen) || null }
          : null,
      dessert:
        form.tipoProducto === "Dessert" ? { size: form.tamanoDessert } : null,
      snack:
        form.tipoProducto === "Snack"
          ? { size: form.tamanoSnack, is_packaged: form.esEmpaquetado }
          : null,
    };

    const url = esEdicion
      ? `http://localhost:8000/menu/products/${productoEditar.id}/`
      : "http://localhost:8000/menu/products/";
    const method = esEdicion ? "PATCH" : "POST";

    try {
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const resultado = await response.json();
        setProductos((prev) =>
          esEdicion
            ? prev.map((p) => (p.id === resultado.id ? resultado : p))
            : [...prev, resultado],
        );
        notify({
          type: "success",
          title: esEdicion ? "Producto actualizado" : "Producto registrado",
          duration: 3000,
        });
        cerrarModal();
      } else {
        const error = await response.json();
        notify({
          type: "error",
          title: "Error al guardar",
          message: JSON.stringify(error),
          duration: 5000,
        });
      }
    } catch {
      notify({
        type: "error",
        title: "Error al conectarse al servidor",
        duration: 4000,
      });
    }
  };

  const handleDeleteProducto = (id) => {
    notify({
      type: "warning",
      title: "¿Eliminar producto?",
      message: "Esta acción no se puede deshacer.",
      duration: 6000,
      action: {
        label: "Eliminar",
        onClick: () => {
          fetchWithAuth(`http://localhost:8000/menu/products/${id}/`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              if (response.ok) {
                setProductos((prev) => prev.filter((p) => p.id !== id));
                notify({
                  type: "success",
                  title: "Producto eliminado",
                  duration: 3000,
                });
              }
            })
            .catch(() =>
              notify({
                type: "error",
                title: "Error al eliminar producto",
                duration: 3000,
              }),
            );
        },
      },
    });
  };

  const abrirModalEdicion = async (prod) => {
    setProductoEditar(prod);
    setModalAbierto(true);

    try {
      const [productoRes, ingredientesRes] = await Promise.all([
        fetchWithAuth(`http://localhost:8000/menu/products/${prod.id}/`),
        fetchWithAuth("http://localhost:8000/menu/ingredients/"),
      ]);

      const productoCompleto = await productoRes.json();
      const catalogo = await ingredientesRes.json();

      setIngredientesCatalogo(catalogo);

      setForm({
        nombre: productoCompleto.name,
        descripcion: productoCompleto.description || "",
        precio: productoCompleto.price,
        tipoProducto:
          productoCompleto.product_type.charAt(0).toUpperCase() +
          productoCompleto.product_type.slice(1),
        stock: productoCompleto.stock,
        disponible: productoCompleto.is_available,
        urlImagen: productoCompleto.image_url || "",
        tiempoPreparacion: productoCompleto.meal?.preparation_time || "",
        volumen: productoCompleto.drink?.volume || "",
        tamanoDessert: productoCompleto.dessert?.size || "",
        tamanoSnack: productoCompleto.snack?.size || "",
        esEmpaquetado: productoCompleto.snack?.is_packaged || false,
      });

      setIngredientesProducto(
        productoCompleto.ingredients.map((ing) => ({
          ingredient: ing.ingredient,
          nombre:
            catalogo.find((c) => c.id === ing.ingredient)?.name ||
            ing.ingredient,
          unit: ing.unit,
          quantity: ing.quantity,
          is_optional: ing.is_optional,
          max_quantity: ing.max_quantity,
          min_quantity: ing.min_quantity,
        })),
      );
    } catch {
      notify({
        type: "error",
        title: "Error al cargar producto",
        duration: 3000,
      });
    }
  };

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-semibold text-gray-700 text-sm";
  const labelClass =
    "text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#2D3A22] italic">
            Gestión de Inventario
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controla los productos disponibles de la cafetería.
          </p>
        </div>
        <button
          onClick={abrirModal}
          className="bg-[#E87324] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d6641e] shadow-lg transition text-sm uppercase tracking-wider"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-4x1 p-8 shadow-md border border-gray-100">
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
              <tr
                key={prod.id}
                className="hover:bg-gray-50/50 transition text-gray-700"
              >
                <td className="py-4 pl-4 font-bold text-[#2D3A22]">
                  {prod.name}
                </td>
                <td className="py-4 text-sm font-semibold text-gray-500 capitalize">
                  {prod.product_type}
                </td>
                <td className="py-4 text-sm font-bold text-orange-600">
                  {prod.stock} pz
                </td>
                <td className="py-4 font-black text-lg text-gray-800">
                  ${parseFloat(prod.price).toFixed(2)}
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => abrirModalEdicion(prod)}
                      className="text-gray-400 hover:text-[#2D3A22] font-bold text-xs uppercase tracking-wider"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProducto(prod.id)}
                      className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-300 font-black text-sm uppercase tracking-widest"
                >
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4F3ED] w-full max-w-2xl rounded-[35px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white">
            <h2 className="text-3xl font-black text-[#2D3A22] mb-8 italic">
              {esEdicion ? "Editar Producto" : "Agregar Producto"}
            </h2>

            <form onSubmit={handleGuardar} className="space-y-6">
              <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleFormChange}
                    className={`${inputClass} h-20`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio"
                      value={form.precio}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de Producto</label>
                    <select
                      name="tipoProducto"
                      value={form.tipoProducto}
                      onChange={handleFormChange}
                      className={inputClass}
                    >
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
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="flex items-center sm:pt-5 pl-1">
                    <input
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={form.disponible}
                      onChange={handleFormChange}
                      className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded"
                    />
                    <label
                      htmlFor="disponible"
                      className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer"
                    >
                      ¿Está disponible?
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>URL de la Imagen</label>
                  <input
                    name="urlImagen"
                    value={form.urlImagen}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100">
                {form.tipoProducto === "Meal" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                      Comida
                    </h4>
                    <div>
                      <label className={labelClass}>
                        Tiempo de preparación (min)
                      </label>
                      <input
                        type="number"
                        name="tiempoPreparacion"
                        value={form.tiempoPreparacion}
                        onChange={handleFormChange}
                        className={inputClass}
                        placeholder="Minutos"
                      />
                    </div>
                  </div>
                )}
                {form.tipoProducto === "Drink" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                      Bebida
                    </h4>
                    <div>
                      <label className={labelClass}>Volumen (ml)</label>
                      <input
                        type="number"
                        name="volumen"
                        value={form.volumen}
                        onChange={handleFormChange}
                        className={inputClass}
                        placeholder="ml"
                      />
                    </div>
                  </div>
                )}
                {form.tipoProducto === "Dessert" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                      Postre
                    </h4>
                    <div>
                      <label className={labelClass}>Tamaño</label>
                      <input
                        name="tamanoDessert"
                        value={form.tamanoDessert}
                        onChange={handleFormChange}
                        className={inputClass}
                        placeholder="Ej. Rebanada, Individual..."
                      />
                    </div>
                  </div>
                )}
                {form.tipoProducto === "Snack" && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                      Snack
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Tamaño</label>
                        <input
                          name="tamanoSnack"
                          value={form.tamanoSnack}
                          onChange={handleFormChange}
                          className={inputClass}
                          placeholder="Ej. Regular, Grande"
                        />
                      </div>
                      <div className="flex items-center sm:pt-5 pl-1">
                        <input
                          type="checkbox"
                          id="esEmpaquetado"
                          name="esEmpaquetado"
                          checked={form.esEmpaquetado}
                          onChange={handleFormChange}
                          className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded"
                        />
                        <label
                          htmlFor="esEmpaquetado"
                          className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer"
                        >
                          ¿Es empaquetado?
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
                <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                  Ingredientes
                </h4>

                <div className="relative">
                  <label className={labelClass}>Buscar ingrediente</label>
                  <input
                    type="text"
                    value={busquedaIngrediente}
                    onChange={(e) => {
                      setBusquedaIngrediente(e.target.value);
                      setIngredienteSeleccionado(null);
                    }}
                    placeholder="Escribe para buscar..."
                    className={inputClass}
                  />
                  {busquedaIngrediente && !ingredienteSeleccionado && (
                    <div className="absolute z-10 w-full bg-white border border-gray-100 rounded-2xl mt-1 shadow-lg overflow-hidden">
                      {ingredientesCatalogo
                        .filter((i) =>
                          i.name
                            .toLowerCase()
                            .includes(busquedaIngrediente.toLowerCase()),
                        )
                        .slice(0, 5)
                        .map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            onClick={() => {
                              setIngredienteSeleccionado(i);
                              setBusquedaIngrediente(i.name);
                              setConfigIngrediente((prev) => ({
                                ...prev,
                                unit: i.unit,
                              }));
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-bold text-[#2D3A22] transition-colors border-b border-gray-50 last:border-0"
                          >
                            {i.name}
                            <span className="ml-2 text-[10px] text-gray-400 font-semibold uppercase">
                              {i.unit}
                            </span>
                          </button>
                        ))}
                      {ingredientesCatalogo.filter((i) =>
                        i.name
                          .toLowerCase()
                          .includes(busquedaIngrediente.toLowerCase()),
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
                          <label className="text-[10px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">
                            {label}
                          </label>
                          <input
                            type={name === "unit" ? "text" : "number"}
                            value={configIngrediente[name]}
                            onChange={(e) =>
                              setConfigIngrediente((prev) => ({
                                ...prev,
                                [name]: e.target.value,
                              }))
                            }
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
                        onChange={(e) =>
                          setConfigIngrediente((prev) => ({
                            ...prev,
                            is_optional: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-[#2D3A22] cursor-pointer"
                      />
                      <label
                        htmlFor="is_optional"
                        className="text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer"
                      >
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
                      <div
                        key={ing.ingredient}
                        className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"
                      >
                        <div>
                          <span className="text-sm font-black text-[#2D3A22]">
                            {ing.nombre}
                          </span>
                          <span className="ml-2 text-[10px] text-gray-400 font-semibold">
                            {ing.quantity} {ing.unit} • min {ing.min_quantity} •
                            max {ing.max_quantity}
                            {ing.is_optional && " • opcional"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleEliminarIngrediente(ing.ingredient)
                          }
                          className="text-gray-300 hover:text-red-500 transition-colors ml-4"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-6 py-3.5 text-gray-400 hover:text-gray-600 font-bold text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2D3A22] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md hover:bg-[#1E2717] transition uppercase tracking-wider"
                >
                  {esEdicion ? "Guardar Cambios" : "Publicar Producto"}
                </button>
              </div>
            </form>
          </div>

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

export default Productos;
