import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Navigation } from 'lucide-react';
import './Inicio.css';

const Inicio = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState('');
  const [limiteVisible, setLimiteVisible] = useState(9);

  const obtenerUbicaciones = async () => {
    try {
      const parametros = {};
      if (busqueda) parametros.busqueda = busqueda;
      if (categoriaActual) parametros.categoria = categoriaActual;

      const respuesta = await axios.get('http://localhost:5000/api/ubicaciones', { params: parametros });
      setUbicaciones(respuesta.data);
      setLimiteVisible(9);
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
    }
  };

  useEffect(() => {
    obtenerUbicaciones();
  }, [busqueda, categoriaActual]);

  const categorias = ['Todos', 'Monumento', 'Museo', 'Parque', 'Gastronomía', 'Historia', 'Aventura', 'Alquileres'];

  const manejarVerMas = () => {
    setLimiteVisible(prev => prev + 9);
  };

  return (
    <div className="pagina-inicio animate-fade-in">
      <div className="seccion-hero">
        <div className="contenedor contenido-hero">
          <h1>Descubre lo mejor de la ciudad</h1>
          <p>Explora monumentos, parques, museos, alquileres y la mejor gastronomía local.</p>

          <div className="barra-busqueda">
            <Search className="icono-busqueda" size={20} />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="entrada-busqueda"
            />
          </div>

          <div className="filtro-categorias">
            {categorias.map(categoria => (
              <button
                key={categoria}
                className={`btn-categoria ${categoriaActual === (categoria === 'Todos' ? '' : categoria) ? 'activo' : ''}`}
                onClick={() => setCategoriaActual(categoria === 'Todos' ? '' : categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="contenedor seccion-ubicaciones">
        <h2 className="titulo-seccion">Puntos Turísticos Destacados</h2>

        {ubicaciones.length === 0 ? (
          <div className="estado-vacio">
            <MapPin size={48} className="icono-vacio" />
            <p>No se encontraron puntos turísticos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <>
            <div className="cuadricula-ubicaciones">
              {ubicaciones.slice(0, limiteVisible).map(ubicacion => (
                <Link to={`/ubicacion/${ubicacion.id}`} key={ubicacion.id} className="tarjeta-ubicacion card">
                  <div className="contenedor-img-ubicacion">
                    <img
                      src={ubicacion.url_imagen || 'https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={ubicacion.nombre}
                      className="img-ubicacion"
                    />
                    <span className="etiqueta-categoria-ubicacion">{ubicacion.categoria}</span>
                  </div>
                  <div className="contenido-ubicacion">
                    <h3>{ubicacion.nombre}</h3>
                    <p className="desc-ubicacion">{ubicacion.descripcion?.substring(0, 100)}...</p>
                    <div className="pie-ubicacion">
                      <span className="direccion-ubicacion">
                        <MapPin size={16} /> {ubicacion.direccion}
                      </span>
                      <button className="btn-icon">
                        <Navigation size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {limiteVisible < ubicaciones.length && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn btn-primary" onClick={manejarVerMas} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', borderRadius: '50px' }}>
                  Ver más
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inicio;
