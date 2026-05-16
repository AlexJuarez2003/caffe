import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Lock, User, UserPlus } from "lucide-react";
import logoCafeMApp from "../assets/logo_cafemapp.png";
import { notify } from "../components/Notificacion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const imagenFondo =
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1470&auto=format&fit=crop";

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const mostrarErrores = (objetoError, prefijo = "") => {

          Object.entries(objetoError).forEach(([llave, valor]) => {

            if (Array.isArray(valor)) {

              // Si es un array de mensajes, mostrarlos
              valor.forEach((msg) => {
                notify({
                  type: "error",
                  title: `Error en ${llave}`,
                  message: msg,
                  duration: 6000,
                });
              });
            } else if (typeof valor === "object" && valor !== null) {

              // Recursivo
              mostrarErrores(valor, llave);

            } else {

              // Por si es un string directo
              notify({
                type: "error",
                title: "Error",
                message: valor,
                duration: 6000,
              });
            }
          });
        };

        mostrarErrores(data);
      
      } else {
        // Guardar en localstorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirige
        navigate("/menu");

        // console.log(JSON.stringify(data))
      }
    } catch (err) {
      notify({
          type: "error",
          title: "Error de conexión",
          message: "No se ha podido comunicar con el servidor.",
          duration: 4000,
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4ed] flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* COLUMNA 1: IMAGEN DE AMBIENTE */}
        <div className="w-full md:w-3/5 relative h-48 md:h-auto">
          <img
            src={imagenFondo}
            alt="Cafetería ITO"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2d3a1a]/40 p-12 flex flex-col justify-end">
            <h2 className="text-white text-5xl font-black italic tracking-tighter leading-none">
              "Compilando ideas,
              <br />
              consumiendo cafe.
            </h2>
          </div>
        </div>

        {/* COLUMNA 2: LOGO Y FORMULARIO */}
        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <img
              src={logoCafeMApp}
              alt="Logo CafeMApp"
              className="w-40 mx-auto mb-4 drop-shadow-md"
            />
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em]">
              Iniciar Sesión
            </p>
          </div>

          <form onSubmit={manejarLogin} className="space-y-4">
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
              type="submit"
              className="w-full py-4 bg-[#2d3a1a] hover:bg-[#3d4d24] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              Iniciar Sesión <LogIn className="w-5 h-5 text-orange-500" />
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              ¿No tienes cuenta?{" "}
              <a
                href="/signup"
                className="font-bold text-[#2d3a1a] hover:underline cursor-pointer"
              >
                Regístrate
              </a>
            </p>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-4"></p>

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
