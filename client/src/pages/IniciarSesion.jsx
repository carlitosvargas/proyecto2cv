import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';
import { Lock, User } from 'lucide-react';
import './IniciarSesion.css';

const IniciarSesion = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = usarAutenticacion();
  const navegar = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    const exito = await iniciarSesion(nombreUsuario, contrasena);
    if (exito) {
      navegar('/');
    } else {
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="pagina-inicio-sesion animate-fade-in">
      <div className="tarjeta-inicio-sesion card">
        <div className="cabecera-inicio-sesion">
          <h2>Bienvenido</h2>
          <p>Ingresa para administrar la guía turística</p>
        </div>
        
        {error && <div className="mensaje-error">{error}</div>}
        
        <form onSubmit={manejarEnvio} className="formulario-inicio-sesion">
          <div className="grupo-entrada">
            <User className="icono-entrada" size={20} />
            <input
              type="text"
              className="campo-entrada con-icono"
              placeholder="Usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          
          <div className="grupo-entrada">
            <Lock className="icono-entrada" size={20} />
            <input
              type="password"
              className="campo-entrada con-icono"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
