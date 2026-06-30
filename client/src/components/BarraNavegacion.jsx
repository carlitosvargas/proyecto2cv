import { Link, useNavigate } from 'react-router-dom';
import { Map, LogOut, Settings, User } from 'lucide-react';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import LogoPasoPatria from './LogoPasoPatria';
import './BarraNavegacion.css';

const BarraNavegacion = () => {
  const { usuario, cerrarSesion } = usarAutenticacion();
  const navegar = useNavigate();

  const manejarCierreSesion = () => {
    cerrarSesion();
    navegar('/');
  };

  return (
    <nav className="barra-navegacion">
      <div className="contenedor contenedor-barra">
        <Link to="/" className="logo-barra">
          <LogoPasoPatria />
        </Link>
        <div className="enlaces-barra">
          {usuario ? (
            <>
              {usuario.rol === 'administrador' && (
                <Link to="/administrador" className="btn btn-outline">
                  <Settings size={18} /> Panel Admin
                </Link>
              )}
              <div className="perfil-usuario">
                <User size={18} />
                <span>{usuario.nombre_usuario}</span>
              </div>
              <button onClick={manejarCierreSesion} className="btn btn-danger btn-sm">
                <LogOut size={18} /> Salir
              </button>
            </>
          ) : (
            <Link to="/iniciar-sesion" className="btn btn-primary">
              <User size={18} /> Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
