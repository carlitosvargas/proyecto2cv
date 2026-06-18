const jwt = require('jsonwebtoken');

// Middleware para verificar el token de acceso
const verificarToken = (peticion, respuesta, siguienteMiddleware) => {
  const tokenHeader = peticion.header('Authorization');
  if (!tokenHeader) return respuesta.status(401).json({ mensaje: 'Acceso denegado' });

  try {
    const tokenVerificado = jwt.verify(tokenHeader.replace('Bearer ', ''), process.env.JWT_SECRET);
    peticion.usuario = tokenVerificado;
    siguienteMiddleware();
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Token no válido' });
  }
};

// Middleware para verificar si el usuario es administrador
const verificarAdministrador = (peticion, respuesta, siguienteMiddleware) => {
  verificarToken(peticion, respuesta, () => {
    if (peticion.usuario.rol === 'administrador') {
      siguienteMiddleware();
    } else {
      respuesta.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  });
};

module.exports = { verificarToken, verificarAdministrador };
