import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ContextoAutenticacion = createContext();

export const usarAutenticacion = () => useContext(ContextoAutenticacion);

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const datosUsuario = localStorage.getItem('usuario');
    if (token && datosUsuario) {
      setUsuario(JSON.parse(datosUsuario));
    }
    setCargando(false);
  }, []);

  const iniciarSesion = async (nombre_usuario, contrasena) => {
    try {
      const respuesta = await axios.post('http://localhost:5000/api/auth/iniciar-sesion', { nombre_usuario, contrasena });
      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));
      setUsuario(respuesta.data.usuario);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <ContextoAutenticacion.Provider value={{ usuario, iniciarSesion, cerrarSesion, cargando }}>
      {!cargando && children}
    </ContextoAutenticacion.Provider>
  );
};
