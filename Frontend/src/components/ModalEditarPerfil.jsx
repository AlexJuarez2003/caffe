import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  Phone,
  Save,
  CreditCard,
  LayoutGrid,
} from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
//import { updateUser } from '../helper/updateUser';

const ModalEditarPerfil = ({
  isOpen,
  onClose,
  currentData,
  onSave,
  getUser,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    control_number: currentData.profile.control_number
      ? currentData.profile.control_number
      : "",
    department: currentData.profile.department
      ? currentData.profile.department
      : "",
    user: {
      email: currentData.email || "",
      first_name: currentData.first_name || "",
      last_name: currentData.last_name || "",
      phone_number: currentData.phone_number || "",
      password: "",
    },
  });

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        [name]: value,
      },
    });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchWithAuth(
        "http://localhost:8000/accounts/profile/customer/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data.user));

        getUser();

        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black text-[#2d3a1a] mb-8 tracking-tighter">
          Editar Información Personal
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="email"
                value={formData.user.email}
                onChange={handleUserChange}
                placeholder="Email"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="phone_number"
                value={formData.user.phone_number}
                onChange={handleUserChange}
                placeholder="Teléfono"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="first_name"
                value={formData.user.first_name}
                onChange={handleUserChange}
                placeholder="Nombre"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="last_name"
                value={formData.user.last_name}
                onChange={handleUserChange}
                placeholder="Apellidos"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="control_number"
                value={formData.control_number}
                onChange={handleCustomerChange}
                placeholder="Número de control"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                name="department"
                value={formData.department}
                onChange={handleCustomerChange}
                placeholder="Departamento"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div className="relative md:col-span-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.user.password}
                onChange={handleUserChange}
                placeholder="Nueva Contraseña (dejar vacío para no cambiar)"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#2d3a1a] hover:bg-[#3d4d24] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 mt-4"
          >
            Guardar Todos los Cambios{" "}
            <Save className="w-4 h-4 text-orange-500" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPerfil;
