import React, { useState } from "react";
import { X, Mail, Lock, Phone, Save, User, CreditCard, LayoutGrid } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const ENDPOINTS = {
  Cliente: "http://localhost:8000/accounts/profile/customer/",
  Cocinero: "http://localhost:8000/accounts/profile/chef/",
  Repartidor: "http://localhost:8000/accounts/profile/delivery/",
};

const ModalEditarPerfil = ({ isOpen, onClose, currentData, getUser }) => {
  if (!isOpen) return null;

  const esCliente = currentData.role === "Cliente";

  const [formData, setFormData] = useState({
    user: {
      email: currentData.email || "",
      first_name: currentData.first_name || "",
      last_name: currentData.last_name || "",
      phone_number: currentData.phone_number || "",
      password: "",
    },
    ...(esCliente && {
      control_number: currentData.profile?.control_number || "",
      department: currentData.profile?.department || "",
    }),
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      user: { ...formData.user, [name]: value },
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = { ...formData };

    if (!body.user.password) delete body.user.password;

    try {
      const endpoint = ENDPOINTS[currentData.role];
      const response = await fetchWithAuth(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        notify({
          type: "success",
          title: "Datos actualizados",
          message: "Sus cambios se han guardado correctamente.",
          duration: 4000,
        });
        getUser();
        onClose();
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
        title: "Error de conexión",
        message: "No se ha podido comunicar con el servidor.",
        duration: 4000,
      });
    }
  };

  const inputClass =
    "w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none";
  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black text-[#2d3a1a] mb-2 tracking-tighter">
          Editar Información Personal
        </h3>
        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-8">
          {currentData.role}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className={iconClass} />
              <input
                name="email"
                value={formData.user.email}
                onChange={handleUserChange}
                placeholder="Correo electrónico"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Phone className={iconClass} />
              <input
                name="phone_number"
                value={formData.user.phone_number}
                onChange={handleUserChange}
                placeholder="Teléfono"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <User className={iconClass} />
              <input
                name="first_name"
                value={formData.user.first_name}
                onChange={handleUserChange}
                placeholder="Nombre"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <User className={iconClass} />
              <input
                name="last_name"
                value={formData.user.last_name}
                onChange={handleUserChange}
                placeholder="Apellidos"
                className={inputClass}
              />
            </div>

            {/* CAMPOS EXCLUSIVOS DE CLIENTE */}
            {esCliente && (
              <>
                <div className="relative">
                  <CreditCard className={iconClass} />
                  <input
                    name="control_number"
                    value={formData.control_number}
                    onChange={handleProfileChange}
                    placeholder="Número de control"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <LayoutGrid className={iconClass} />
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleProfileChange}
                    placeholder="Departamento / Carrera"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <div className="relative md:col-span-2">
              <Lock className={iconClass} />
              <input
                type="password"
                name="password"
                value={formData.user.password}
                onChange={handleUserChange}
                placeholder="Nueva contraseña (dejar vacío para no cambiar)"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#2d3a1a] hover:bg-[#3d4d24] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 mt-4"
          >
            Guardar Cambios <Save className="w-4 h-4 text-orange-500" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPerfil;
