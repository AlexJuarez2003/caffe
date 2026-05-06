import React from 'react';
import { ShoppingBag, User, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#2d3a1a] p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Coffee className="w-5 h-5 text-orange-500" />
          </div>
          <span className="font-black text-[#2d3a1a] tracking-tighter text-xl italic">CafeMApp</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/perfil')}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-[#2d3a1a]"
          >
            <User className="w-6 h-6" />
          </button>
          
          <button className="relative p-3 bg-[#2d3a1a] rounded-2xl text-white shadow-lg shadow-[#2d3a1a]/20 hover:scale-105 transition-all">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;