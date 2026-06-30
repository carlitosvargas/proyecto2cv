import { useState, useEffect } from 'react';
import axios from 'axios';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import './PanelAdministrador.css';

const PanelAdministrador = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const { usuario } = usarAutenticacion();
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    latitud: '',
    longitud: '',
    direccion: '',
    url_imagen: '',
    imagenes_extra: []
  });

  const obtenerUbicaciones = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5000/api/ubicaciones');
      setUbicaciones(respuesta.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerUbicaciones();
  }, []);

  const manejarCambioEntrada = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const configuracion = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (idEdicion) {
        await axios.put(`http://localhost:5000/api/ubicaciones/${idEdicion}`, datosFormulario, configuracion);
      } else {
        await axios.post('http://localhost:5000/api/ubicaciones', datosFormulario, configuracion);
      }
      setMostrarModal(false);
      setIdEdicion(null);
      obtenerUbicaciones();
      reiniciarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la ubicación');
    }
  };

  const manejarEdicion = (ubicacion) => {
    setDatosFormulario({
      nombre: ubicacion.nombre,
      descripcion: ubicacion.descripcion,
      categoria: ubicacion.categoria,
      latitud: ubicacion.latitud || '',
      longitud: ubicacion.longitud || '',
      direccion: ubicacion.direccion,
      url_imagen: ubicacion.url_imagen || '',
      imagenes_extra: typeof ubicacion.imagenes_extra === 'string' ? JSON.parse(ubicacion.imagenes_extra) : (ubicacion.imagenes_extra || [])
    });
    setIdEdicion(ubicacion.id);
    setMostrarModal(true);
  };

  const manejarSubidaImagenes = async (e) => {
    const archivos = e.target.files;
    if (!archivos || archivos.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < archivos.length; i++) {
      formData.append('imagenes', archivos[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const respuesta = await axios.post('http://localhost:5000/api/subida', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      const nuevasUrls = respuesta.data.urls.map(url => `http://localhost:5000${url}`);
      setDatosFormulario(prev => ({
        ...prev,
        imagenes_extra: [...prev.imagenes_extra, ...nuevasUrls]
      }));
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Hubo un error al subir las imágenes');
    }
  };

  const eliminarImagenExtra = (index) => {
    setDatosFormulario(prev => ({
      ...prev,
      imagenes_extra: prev.imagenes_extra.filter((_, i) => i !== index)
    }));
  };

  const manejarEliminacion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este punto turístico?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/ubicaciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        obtenerUbicaciones();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const reiniciarFormulario = () => {
    setDatosFormulario({ nombre: '', descripcion: '', categoria: '', latitud: '', longitud: '', direccion: '', url_imagen: '', imagenes_extra: [] });
  };

  const abrirNuevoModal = () => {
    reiniciarFormulario();
    setIdEdicion(null);
    setMostrarModal(true);
  };

  return (
    <div className="pagina-admin contenedor animate-fade-in">
      <div className="cabecera-admin">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestiona los puntos turísticos de la ciudad</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevoModal}>
          <Plus size={20} /> Nuevo Punto Turístico
        </button>
      </div>

      <div className="card tarjeta-tabla">
        <div className="tabla-responsiva">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map(ubi => (
                <tr key={ubi.id}>
                  <td>
                    <img src={ubi.url_imagen || 'https://via.placeholder.com/50'} alt={ubi.nombre} className="img-tabla" />
                  </td>
                  <td className="fuente-media">{ubi.nombre}</td>
                  <td><span className="etiqueta">{ubi.categoria}</span></td>
                  <td>
                    <div className="direccion-tabla">
                      <MapPin size={14} /> {ubi.direccion}
                    </div>
                  </td>
                  <td>
                    <div className="botones-accion">
                      <button className="btn-icono texto-primario hover-bg-primario" onClick={() => manejarEdicion(ubi)}>
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-icono texto-peligro hover-bg-peligro" onClick={() => manejarEliminacion(ubi.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ubicaciones.length === 0 && (
                <tr>
                  <td colSpan="5" className="texto-centro py-4 texto-secundario">No hay ubicaciones registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && (
        <div className="superposicion-modal">
          <div className="contenido-modal card animate-fade-in">
            <h2 className="titulo-modal">{idEdicion ? 'Editar Punto Turístico' : 'Nuevo Punto Turístico'}</h2>
            <form onSubmit={manejarEnvio} className="formulario-admin">
              <div className="cuadricula-formulario">
                <div className="grupo-formulario">
                  <label>Nombre</label>
                  <input type="text" name="nombre" className="campo-entrada" value={datosFormulario.nombre} onChange={manejarCambioEntrada} required />
                </div>
                <div className="grupo-formulario">
                  <label>Categoría</label>
                  <select name="categoria" className="campo-entrada" value={datosFormulario.categoria} onChange={manejarCambioEntrada} required>
                    <option value="">Selecciona una categoría</option>
                    <option value="Monumento">Monumento</option>
                    <option value="Museo">Museo</option>
                    <option value="Parque">Parque</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Historia">Historia</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Alquileres">Alquileres</option>
                  </select>
                </div>
                <div className="grupo-formulario">
                  <label>Dirección</label>
                  <input type="text" name="direccion" className="campo-entrada" value={datosFormulario.direccion} onChange={manejarCambioEntrada} required />
                </div>
                <div className="grupo-formulario">
                  <label>URL de la Imagen (Portada)</label>
                  <input type="text" name="url_imagen" className="campo-entrada" value={datosFormulario.url_imagen} onChange={manejarCambioEntrada} />
                </div>
                <div className="grupo-formulario">
                  <label>Imágenes Adicionales</label>
                  <input type="file" multiple accept="image/*" className="campo-entrada" onChange={manejarSubidaImagenes} />
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {datosFormulario.imagenes_extra.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={img} alt="extra" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        <button type="button" onClick={() => eliminarImagenExtra(idx)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grupo-formulario">
                  <label>Latitud (Google Maps)</label>
                  <input type="text" name="latitud" className="campo-entrada" placeholder="Ej: -34.603722" value={datosFormulario.latitud} onChange={manejarCambioEntrada} />
                </div>
                <div className="grupo-formulario">
                  <label>Longitud (Google Maps)</label>
                  <input type="text" name="longitud" className="campo-entrada" placeholder="Ej: -58.381592" value={datosFormulario.longitud} onChange={manejarCambioEntrada} />
                </div>
              </div>
              <div className="grupo-formulario ancho-completo">
                <label>Descripción</label>
                <textarea name="descripcion" className="campo-entrada area-texto" rows="4" value={datosFormulario.descripcion} onChange={manejarCambioEntrada} required></textarea>
              </div>
              <div className="acciones-modal">
                <button type="button" className="btn btn-outline" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{idEdicion ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdministrador;
