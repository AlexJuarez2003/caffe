import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, CheckCircle2, Loader2, Plus } from 'lucide-react';

const ModalPago = ({ isOpen, onClose, total }) => {
  // Estados para la lógica de selección y éxito
  const [metodoSeleccionado, setMetodoSeleccionado] = useState('efectivo');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  if (!isOpen) return null;

  const handleFinalizar = () => {
    setStatus('loading');
    // Simulamos el proceso para que se vea el cargando
    setTimeout(() => {
      setStatus('success');
      // Cerramos todo después de mostrar el éxito por 3 segundos
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3000);
    }, 1500);
  };

  const metodos = [
    { id: 'efectivo', nombre: 'EFECTIVO', desc: 'PAGA AL RECIBIR', icono: <Banknote className="w-6 h-6" /> },
    { id: 'tarjeta', nombre: 'TARJETA', desc: 'DÉBITO O CRÉDITO', icono: <CreditCard className="w-6 h-6" /> },
    { id: 'transferencia', nombre: 'TRANSFERENCIA', desc: 'SPEI O CODI', icono: <Smartphone className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque profesional */}
      <div className="absolute inset-0 bg-[#2d3a1a]/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl overflow-hidden border border-gray-100">
        
        {/* --- VISTA DE ÉXITO (BONITA Y REDONDEADA) --- */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-white z-[210] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-[#2d3a1a] italic uppercase tracking-tighter">¡Pedido Confirmado!</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-[2rem] w-full border border-gray-100">
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Pago registrado mediante</p>
              <p className="text-[#2d3a1a] font-black text-sm uppercase mt-1">{metodoSeleccionado}</p>
            </div>
            <p className="text-[10px] text-gray-300 font-bold uppercase mt-8 tracking-widest italic">
              * Gracias por elegir CafeMApp
            </p>
          </div>
        )}

        {/* --- CONTENIDO PARA SELECCIONAR PAGO --- */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-[#2d3a1a] italic tracking-tighter uppercase">Método de Pago</h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">TOTAL A PAGAR: ${total}.00</p>
        </div>

        <div className="space-y-3 mb-8">
          {metodos.map((metodo) => (
            <button 
              key={metodo.id}
              onClick={() => setMetodoSeleccionado(metodo.id)}
              className={`w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all text-left ${
                metodoSeleccionado === metodo.id 
                ? 'border-orange-500 bg-orange-50/30' 
                : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl shadow-sm bg-white ${metodoSeleccionado === metodo.id ? 'text-orange-500' : 'text-gray-400'}`}>
                  {metodo.icono}
                </div>
                <div>
                  <p className="font-black text-[#2d3a1a] text-sm tracking-tight">{metodo.nombre}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{metodo.desc}</p>
                </div>
              </div>

              {/* Círculo de selección marcado */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                metodoSeleccionado === metodo.id ? 'border-orange-500' : 'border-gray-200'
              }`}>
                {metodoSeleccionado === metodo.id && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={handleFinalizar}
          disabled={status === 'loading'}
          className="w-full bg-orange-500 text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 transition-all"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              PROCESANDO...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              FINALIZAR PEDIDO
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ModalPago;