import React, { useState } from 'react';

const AdminDashboard = () => {
  // 1. DATOS SIMULADOS DE LOS PRODUCTOS
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Chilaquiles Oaxaqueños', tipo: 'Comida', precio: 65.00, stock: 20, disponible: true },
    { id: 2, nombre: 'Latte Especial', tipo: 'Bebida', precio: 45.00, stock: 15, disponible: true },
  ]);

  // 2. ESTADOS GENERALES DEL FORMULARIO
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoProducto, setTipoProducto] = useState('Meal'); // 'Meal', 'Drink', 'Dessert', 'Snack'
  const [stock, setStock] = useState('');
  const [disponible, setDisponible] = useState(false);
  const [urlImagen, setUrlImagen] = useState('');

  // 3. ESTADOS DINÁMICOS PARA LAS ESPECIFICACIONES
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [volumen, setVolumen] = useState('');
  const [tamanoDessert, setTamanoDessert] = useState('');
  const [tamanoSnack, setTamanoSnack] = useState('');
  const [esEmpaquetado, setEsEmpaquetado] = useState(false);

  // Funciones para abrir y cerrar el modal limpiando datos
  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => {
    setModalAbierto(false);
    setNombre(''); setDescripcion(''); setPrecio(''); setStock('');
    setDisponible(false); setUrlImagen(''); setTiempoPreparacion('');
    setVolumen(''); setTamanoDessert(''); setTamanoSnack(''); setEsEmpaquetado(false);
  };

  // Guardar en la tabla temporal del frontend
  const manejarGuardar = (e) => {
    e.preventDefault();
    let tipoTexto = 'Comida';
    if (tipoProducto === 'Drink') tipoTexto = 'Bebida';
    if (tipoProducto === 'Dessert') tipoTexto = 'Postre';
    if (tipoProducto === 'Snack') tipoTexto = 'Snack';

    const nuevo = {
      id: Date.now(),
      nombre,
      tipo: tipoTexto,
      precio: parseFloat(precio) || 0,
      stock: parseInt(stock) || 0,
      disponible: disponible
    };

    setProductos([...productos, nuevo]);
    cerrarModal();
  };

  return (
    <div className="flex min-h-screen bg-[#F4F3ED]" style={{ fontFamily: 'sans-serif' }}>
      
      {/* BARRA LATERAL (SIDEBAR COMÚN) */}
      <div className="w-64 bg-[#2D3A22] text-white p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold italic tracking-wide">CafeMApp</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1 font-bold">Panel Admin</p>
          </div>
          <nav className="space-y-3">
            <button className="w-full text-left bg-[#E87324] py-3 px-4 rounded-2xl font-bold text-sm">📝 Menú</button>
            <button className="w-full text-left text-gray-300 hover:bg-[#3D4F31] py-3 px-4 rounded-2xl font-bold text-sm transition">📦 Pedidos</button>
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
          <button 
            onClick={abrirModal}
            className="bg-[#E87324] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d6641e] shadow-lg transition text-sm uppercase tracking-wider"
          >
            + Nuevo Producto
          </button>
        </div>

        {/* TABLA PRINCIPAL ESTILO CAFEMAPP */}
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
                  <td className="py-4 pl-4 font-bold text-[#2D3A22]">{prod.nombre}</td>
                  <td className="py-4 text-sm font-semibold text-gray-500">{prod.tipo}</td>
                  <td className="py-4 text-sm font-bold text-orange-600">{prod.stock} pz</td>
                  <td className="py-4 font-black text-lg text-gray-800">${prod.precio.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <button className="text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-wider">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL / FORMULARIO EMERGENTE */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F4F3ED] w-full max-w-2xl rounded-[35px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white">
            
            <h2 className="text-3xl font-black text-[#2D3A22] mb-8 italic">Agregar Producto</h2>
            
            <form onSubmit={manejarGuardar} className="space-y-6">
              
              {/* TARJETA 1: DATOS GENERALES (Mismo estilo que tus vistas de perfil) */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 space-y-4">
                
                <div>
                  <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Nombre</label>
                  <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-semibold text-gray-700 text-sm" required />
                </div>

                <div>
                  <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Descripción</label>
                  <textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-semibold text-gray-700 text-sm h-20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Precio ($)</label>
                    <input type="number" step="0.01" value={precio} onChange={(e)=>setPrecio(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-bold text-gray-800 text-sm" required />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Tipo de Producto</label>
                    <select 
                      value={tipoProducto} 
                      onChange={(e) => setTipoProducto(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-bold text-gray-700 text-sm cursor-pointer"
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
                    <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Stock (Cantidad)</label>
                    <input type="number" value={stock} onChange={(e)=>setStock(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-bold text-gray-800 text-sm" required />
                  </div>
                  <div className="flex items-center sm:pt-5 pl-1">
                    <input type="checkbox" id="disponible" checked={disponible} onChange={(e)=>setDisponible(e.target.checked)} className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
                    <label htmlFor="disponible" className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">¿Está disponible?</label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">URL de la Imagen</label>
                  <input type="text" value={urlImagen} onChange={(e)=>setUrlImagen(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none font-medium text-xs text-gray-500" placeholder="https://..." />
                </div>

              </div>

              {/* TARJETA 2: ESPECIFICACIONES DINÁMICAS (Cambia según el tipo de producto seleccionado) */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                
                {/* 1. SECCIÓN COMIDA */}
                {tipoProducto === 'Meal' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Comida</h4>
                    <div>
                      <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Tiempo de preparación</label>
                      <input type="text" value={tiempoPreparacion} onChange={(e)=>setTiempoPreparacion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none text-sm font-semibold" placeholder="Minutos" />
                    </div>
                  </div>
                )}

                {/* 2. SECCIÓN BEBIDA */}
                {tipoProducto === 'Drink' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Bebida</h4>
                    <div>
                      <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Volumen</label>
                      <input type="text" value={volumen} onChange={(e)=>setVolumen(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none text-sm font-semibold" placeholder="ml" />
                    </div>
                  </div>
                )}

                {/* 3. SECCIÓN POSTRE */}
                {tipoProducto === 'Dessert' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Postre</h4>
                    <div>
                      <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Tamaño</label>
                      <input type="text" value={tamanoDessert} onChange={(e)=>setTamanoDessert(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none text-sm font-semibold" placeholder="Ej. Rebanada, Individual..." />
                    </div>
                  </div>
                )}

                {/* 4. SECCIÓN SNACK */}
                {tipoProducto === 'Snack' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">Snack</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black text-[#E87324] uppercase tracking-wider mb-1 block">Tamaño</label>
                        <input type="text" value={tamanoSnack} onChange={(e)=>setTamanoSnack(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:border-[#2D3A22] outline-none text-sm font-semibold" placeholder="Ej. Regular, Grande" />
                      </div>
                      <div className="flex items-center sm:pt-5 pl-1">
                        <input type="checkbox" id="esEmpaquetado" checked={esEmpaquetado} onChange={(e)=>setEsEmpaquetado(e.target.checked)} className="w-5 h-5 accent-[#2D3A22] cursor-pointer rounded" />
                        <label htmlFor="esEmpaquetado" className="ml-2 text-[11px] font-black text-gray-500 uppercase tracking-wide cursor-pointer">¿Es empaquetado?</label>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* BOTONES DE ACCIÓN */}
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
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;