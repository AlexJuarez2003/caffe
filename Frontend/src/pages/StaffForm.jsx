import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const StaffForm = ({ isOpen, onClose }) => {
  const [rol, setRol] = useState("cocinero");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turno, setTurno] = useState("matutino");
  const [areas, setAreas] = useState([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rol === "repartidor") {
      fetchWithAuth("http://localhost:8000/logistics/areas/")
        .then((r) => r.json())
        .then((data) => setAreas(data.filter((a) => a.is_active)))
        .catch(() =>
          notify({
            type: "error",
            title: "Error al cargar áreas",
            duration: 3000,
          }),
        );
    }
  }, [rol]);

  const handleClose = () => {
    setRol("cocinero");
    setEmail("");
    setPassword("");
    setTurno("matutino");
    setAreaSeleccionada("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      rol === "cocinero"
        ? "http://localhost:8000/accounts/signup/chef/"
        : "http://localhost:8000/accounts/signup/delivery/";

    const body =
      rol === "cocinero"
        ? { user: { email, password }, shift: turno }
        : {
            user: { email, password },
            delivery_area: parseInt(areaSeleccionada),
          };

    try {
      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        notify({
          type: "success",
          title: `${rol === "cocinero" ? "Cocinero" : "Repartidor"} registrado`,
          duration: 3000,
        });
        handleClose();
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
      notify({
        type: "error",
        title: "Error al conectarse al servidor",
        duration: 4000,
      });
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
      <div className="bg-[#F4F3ED] w-full max-w-lg rounded-[35px] p-10 shadow-2xl border border-white">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#2D3A22] italic">
            Nuevo Personal
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-[#2D3A22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Tipo de personal
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "cocinero", label: "Cocinero" },
                { value: "repartidor", label: "Repartidor" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRol(value)}
                  className={`py-3 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                    rol === value
                      ? "bg-[#2D3A22] text-white shadow-md"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
              Credenciales
            </h4>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-3x1 p-6 shadow-sm border border-gray-100 space-y-4">
            {rol === "cocinero" ? (
              <>
                <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                  Turno
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "matutino", label: "Matutino" },
                    { value: "vespertino", label: "Vespertino" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTurno(value)}
                      className={`py-3 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                        turno === value
                          ? "bg-[#E87324] text-white shadow-md"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className="text-sm font-black text-[#2D3A22] italic border-b border-gray-100 pb-2">
                  Área de reparto
                </h4>
                <div>
                  <label className={labelClass}>Área asignada</label>
                  <select
                    value={areaSeleccionada}
                    onChange={(e) => setAreaSeleccionada(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Seleccionar área...</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name} — {area.estimated_time} min
                      </option>
                    ))}
                  </select>
                  {areaSeleccionada && (
                    <p className="mt-2 text-[11px] text-gray-400 font-semibold">
                      {
                        areas.find((a) => a.id === parseInt(areaSeleccionada))
                          ?.description
                      }
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3.5 text-gray-400 hover:text-gray-600 font-bold text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2D3A22] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-md hover:bg-[#1E2717] transition uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Registrar Personal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
