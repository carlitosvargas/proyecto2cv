import { Navigate } from 'react-router-dom';
import { usarAutenticacion } from '../context/ContextoAutenticacion';

const RutaProtegida = ({ children, soloAdministrador }) => {
  const { usuario } = usarAutenticacion();

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (soloAdministrador && usuario.rol !== 'administrador') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;
