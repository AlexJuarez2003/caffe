import React, { useState } from 'react';
import { X, Mail, Lock, Phone, Save, CreditCard, LayoutGrid } from 'lucide-react';

const ModalEditarPerfil = ({ isOpen, onClose, currentData, onSave }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({ ...currentData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 relative animate-in fade-in zoom-in duration-200">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-orange-500 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-black text-[#2d3a1a] mb-8 tracking-tighter">Editar Información Personal</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Institucional"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* No. Control */}
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                name="noControl"
                value={formData.noControl}
                onChange={handleChange}
                placeholder="No. de Control"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Carrera */}
            <div className="relative">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Carrera"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Teléfono */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Contraseña */}
            <div className="relative md:col-span-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Nueva Contraseña (dejar vacío para no cambiar)"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#2d3a1a] hover:bg-[#3d4d24] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 mt-4"
          >
            Guardar Todos los Cambios <Save className="w-4 h-4 text-orange-500" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPerfil;