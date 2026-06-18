const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexionPool = require('../config/bd');

// Controlador para iniciar sesión
exports.iniciarSesion = async (peticion, respuesta) => {
  const { nombre_usuario, contrasena } = peticion.body;
  try {
    const [usuarios] = await conexionPool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    if (usuarios.length === 0) {
      return respuesta.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuarioEncontrado = usuarios[0];
    const esCoincidencia = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
    if (!esCoincidencia) {
      return respuesta.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const datosCarga = {
      id: usuarioEncontrado.id,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      rol: usuarioEncontrado.rol
    };

    const tokenAcceso = jwt.sign(datosCarga, process.env.JWT_SECRET, { expiresIn: '1d' });

    respuesta.json({ token: tokenAcceso, usuario: datosCarga });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Controlador para registrar un nuevo usuario
exports.registrarUsuario = async (peticion, respuesta) => {
  const { nombre_usuario, contrasena } = peticion.body;
  try {
    const [usuariosExistentes] = await conexionPool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    if (usuariosExistentes.length > 0) {
      return respuesta.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
    await conexionPool.query('INSERT INTO usuarios (nombre_usuario, contrasena, rol) VALUES (?, ?, ?)', [nombre_usuario, contrasenaEncriptada, 'visitante']);
    
    respuesta.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
