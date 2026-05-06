import React from 'react';

// Esta es la pieza que muestra un café o comida
const ProductCard = ({ nombre, precio, descripcion, etiquetas }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '10px', width: '250px', textAlign: 'center', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ backgroundColor: '#f0f0f0', height: '150px', borderRadius: '5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         🖼️ Imagen aquí
      </div>
      <h3 style={{ margin: '5px 0' }}>{nombre}</h3>
      <p style={{ fontSize: '0.9em', color: '#666' }}>{descripcion}</p>
      
      {/* Esto muestra si es "Picante" o "Nuevo" */}
      <div style={{ marginBottom: '10px' }}>
        {etiquetas && etiquetas.map(tag => (
          <span key={tag} style={{ backgroundColor: '#ffeb3b', padding: '2px 5px', fontSize: '0.7em', borderRadius: '3px', marginRight: '5px' }}>
            {tag}
          </span>
        ))}
      </div>

      <p style={{ fontWeight: 'bold', color: '#2ecc71' }}>${precio}</p>
      
      <button style={{ background: '#6f4e37', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>
        Agregar
      </button>
      <button style={{ background: '#e67e22', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}>
        Personalizar
      </button>
    </div>
  );
};

export default ProductCard;