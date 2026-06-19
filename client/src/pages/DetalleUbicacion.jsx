import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Navigation, Map } from 'lucide-react';
import './DetalleUbicacion.css';

const DetalleUbicacion = () => {
  const { id } = useParams();
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:5000/api/ubicaciones/${id}`);
        setUbicacion(respuesta.data);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      } finally {
        setCargando(false);
      }
    };
    obtenerUbicacion();
  }, [id]);

  if (cargando) {
    return <div className="estado-cargando">Cargando información...</div>;
  }

  if (!ubicacion) {
    return <div className="estado-error">Ubicación no encontrada.</div>;
  }

  return (
    <div className="pagina-detalle-ubicacion animate-fade-in">
      <div 
        className="hero-detalle" 
        style={{ backgroundImage: `url(${ubicacion.url_imagen || 'https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})` }}
      >
        <div className="contenedor capa-top">
          <Link to="/" className="btn-volver">
            <ArrowLeft size={20} /> Volver a explorar
          </Link>
        </div>
        <div className="contenedor capa-hero">
          <span className="etiqueta-detalle">{ubicacion.categoria}</span>
          <h1 className="titulo-detalle">{ubicacion.nombre}</h1>
          <p className="direccion-detalle">
            <MapPin size={20} /> {ubicacion.direccion}
          </p>
        </div>
      </div>

      <div className="contenedor contenido-detalle">
        <div className="principal-detalle">
          <div className="card tarjeta-info">
            <h2>Acerca de este lugar</h2>
            <p className="descripcion-detalle">{ubicacion.descripcion}</p>
          </div>
        </div>

        <div className="barra-lateral-detalle">
          <div className="card tarjeta-mapa">
            <div className="cabecera-mapa">
              <Map size={20} className="texto-primario" />
              <h3>Ubicación en el Mapa</h3>
            </div>
            <div className="contenedor-mapa">
              {ubicacion.latitud && ubicacion.longitud ? (
                <iframe
                  title="Google Maps"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}&hl=es&z=15&output=embed`}
                ></iframe>
              ) : (
                <div className="sin-mapa">Coordenadas no disponibles</div>
              )}
            </div>
            {ubicacion.latitud && ubicacion.longitud && (
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${ubicacion.latitud},${ubicacion.longitud}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-primary btn-block mt-3"
              >
                <Navigation size={18} /> ¿Cómo llegar?
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleUbicacion;
