import React, { useState, useEffect } from "react";
import { X, MapPin, Building, DoorOpen, ChevronRight } from "lucide-react";
import { fetchWithAuth } from "../helper/FetchWithAuth";
import { notify } from "../components/Notificacion";

const ModalUbicacion = ({ isOpen, onClose, onConfirmar }) => {
  const [areas, setAreas] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [salones, setSalones] = useState([]);

  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);
  const [salonSeleccionado, setSalonSeleccionado] = useState(null);
  const [indicaciones, setIndicaciones] = useState("");
  const [paso, setPaso] = useState("area");

  useEffect(() => {
    if (!isOpen) return;
    fetchWithAuth("http://localhost:8000/logistics/areas/")
      .then((r) => r.json())
      .then((data) => setAreas(data.filter((a) => a.is_active)))
      .catch(() => notify({ type: "error", title: "Error al cargar áreas", duration: 3000 }));
  }, [isOpen]);

  useEffect(() => {
    if (!areaSeleccionada) return;
    setEdificios([]);
    setEdificioSeleccionado(null);
    setSalonSeleccionado(null);
    fetchWithAuth(`http://localhost:8000/logistics/buildings/?area_id=${areaSeleccionada.id}`)
      .then((r) => r.json())
      .then((data) => setEdificios(data))
      .catch(() => notify({ type: "error", title: "Error al cargar edificios", duration: 3000 }));
  }, [areaSeleccionada]);

  useEffect(() => {
    if (!edificioSeleccionado) return;
    setSalones([]);
    setSalonSeleccionado(null);
    fetchWithAuth(`http://localhost:8000/logistics/classrooms/?building_id=${edificioSeleccionado.id}`)
      .then((r) => r.json())
      .then((data) => setSalones(data))
      .catch(() => notify({ type: "error", title: "Error al cargar salones", duration: 3000 }));
  }, [edificioSeleccionado]);

  const handleConfirmar = () => {
    onConfirmar({
      classroom: salonSeleccionado?.id || null,
      delivery_area: areaSeleccionada?.id || null,
      reference: indicaciones || null,
      custom_location: null,
    });
  };

  const resetear = () => {
    setAreaSeleccionada(null);
    setEdificioSeleccionado(null);
    setSalonSeleccionado(null);
    setIndicaciones("");
    setPaso("area");
  };

  const handleClose = () => {
    resetear();
    onClose();
  };

  if (!isOpen) return null;

  const opcionClass = (seleccionado) =>
    `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
      seleccionado
        ? "border-orange-500 bg-orange-50/30"
        : "border-transparent bg-gray-50 hover:bg-gray-100"
    }`;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#2d3a1a] italic tracking-tighter uppercase">
            Ubicación
          </h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">
            ¿Dónde entregamos tu pedido?
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {[
              { key: "area", label: areaSeleccionada?.name || "Área" },
              { key: "edificio", label: edificioSeleccionado?.name || "Edificio" },
              { key: "salon", label: salonSeleccionado?.name || "Salón" },
            ].map((item, idx) => (
              <React.Fragment key={item.key}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                  paso === item.key
                    ? "bg-[#2d3a1a] text-white"
                    : idx < ["area", "edificio", "salon"].indexOf(paso)
                    ? "bg-orange-100 text-orange-600 cursor-pointer"
                    : "bg-gray-100 text-gray-400"
                }`}
                  onClick={() => {
                    if (idx < ["area", "edificio", "salon"].indexOf(paso)) {
                      setPaso(item.key);
                    }
                  }}
                >
                  {item.label.length > 15 ? item.label.slice(0, 15) + "…" : item.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {paso === "area" && (
          <div className="space-y-3">
            <p className="text-[11px] font-black text-[#2d3a1a] uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" /> Selecciona el área
            </p>
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => { setAreaSeleccionada(area); setPaso("edificio"); }}
                className={opcionClass(areaSeleccionada?.id === area.id)}
              >
                <div>
                  <p className="font-black text-[#2d3a1a] text-sm">{area.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{area.description}</p>
                  <p className="text-[10px] text-orange-500 font-black mt-1 uppercase">~{area.estimated_time} min</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {paso === "edificio" && (
          <div className="space-y-3">
            <p className="text-[11px] font-black text-[#2d3a1a] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-500" /> Selecciona el edificio
            </p>
            {edificios.length === 0 && (
              <p className="text-center text-gray-300 font-black text-sm py-8 uppercase tracking-widest">
                Cargando edificios...
              </p>
            )}
            {edificios.map((edificio) => (
              <button
                key={edificio.id}
                onClick={() => { setEdificioSeleccionado(edificio); setPaso("salon"); }}
                className={opcionClass(edificioSeleccionado?.id === edificio.id)}
              >
                <p className="font-black text-[#2d3a1a] text-sm">{edificio.name}</p>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {paso === "salon" && (
          <div className="space-y-3">
            <p className="text-[11px] font-black text-[#2d3a1a] uppercase tracking-widest mb-4 flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-orange-500" /> Selecciona el salón
            </p>
            {salones.length === 0 && (
              <p className="text-center text-gray-300 font-black text-sm py-8 uppercase tracking-widest">
                Cargando salones...
              </p>
            )}
            {salones.map((salon) => (
              <button
                key={salon.id}
                onClick={() => { setSalonSeleccionado(salon); setPaso("indicaciones"); }}
                className={opcionClass(salonSeleccionado?.id === salon.id)}
              >
                <div>
                  <p className="font-black text-[#2d3a1a] text-sm">{salon.name}</p>
                  {salon.floor && (
                    <p className="text-[10px] text-gray-400 font-semibold">Piso {salon.floor}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {paso === "indicaciones" && (
          <div className="space-y-4">
            <p className="text-[11px] font-black text-[#2d3a1a] uppercase tracking-widest mb-4">
              Indicaciones adicionales
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
              {[
                { label: "Área", value: areaSeleccionada?.name },
                { label: "Edificio", value: edificioSeleccionado?.name },
                { label: "Salón", value: salonSeleccionado?.name },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{label}</span>
                  <span className="text-[10px] text-[#2d3a1a] font-black uppercase">{value}</span>
                </div>
              ))}
            </div>

            <textarea
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
              placeholder="Ej: Entregar a Iris Josselyn, junto a la ventana..."
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 h-24 resize-none"
            />

            <button
              onClick={handleConfirmar}
              className="w-full bg-[#2d3a1a] hover:bg-[#1a2310] text-white py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              Confirmar ubicación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUbicacion;