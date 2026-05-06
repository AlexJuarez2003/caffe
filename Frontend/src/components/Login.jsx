import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';
import logoCafeMApp from '../assets/logo_cafemapp.png'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const imagenFondo = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1470&auto=format&fit=crop";

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!response.ok) {
        setError("Credenciales incorrectas");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      setError("Error de conexión");
    }

  };

  return (
    <div className="min-h-screen bg-[#f3f4ed] flex items-center justify-center p-4 md:p-10">
      <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* COLUMNA 1: IMAGEN DE AMBIENTE */}
        <div className="w-full md:w-3/5 relative h-48 md:h-auto">
          <img 
            src={imagenFondo} 
            alt="Cafetería ITO" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2d3a1a]/40 p-12 flex flex-col justify-end">
            <h2 className="text-white text-5xl font-black italic tracking-tighter leading-none">"Compilando ideas,<br/>consumiendo cafe.</h2>
          </div>
        </div>

        {/* COLUMNA 2: LOGO Y FORMULARIO */}
        <div className="w-full md:w-2/5 p-10 md:p-14 flex flex-col justify-center bg-white">
          
          <div className="text-center mb-10">
            {/* AQUÍ VA TU LOGO GRANDE */}
            <img 
              src={logoCafeMApp} 
              alt="Logo CafeMApp" 
              className="w-48 mx-auto mb-4 drop-shadow-md"
            />
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">Instituto Tecnológico de Oaxaca</p>
          </div>

          <form onSubmit={manejarLogin} className="space-y-5">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <button 
              className="w-full py-4 bg-[#2d3a1a] hover:bg-[#3d4d24] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              Iniciar Sesión <LogIn className="w-5 h-5 text-orange-500" />
            </button>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-6">
              © 2026 - Departamento de Sistemas
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;