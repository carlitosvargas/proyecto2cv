const express = require('express');
const enrutador = express.Router();
const { 
  obtenerTodasLasUbicaciones, 
  obtenerUbicacionPorId, 
  crearUbicacion, 
  actualizarUbicacion, 
  eliminarUbicacion 
} = require('../controllers/controladorUbicacion');
const { verificarAdministrador } = require('../middleware/middlewareAutenticacion');

// Rutas públicas
enrutador.get('/', obtenerTodasLasUbicaciones);
enrutador.get('/:id', obtenerUbicacionPorId);

// Rutas exclusivas para el administrador
enrutador.post('/', verificarAdministrador, crearUbicacion);
enrutador.put('/:id', verificarAdministrador, actualizarUbicacion);
enrutador.delete('/:id', verificarAdministrador, eliminarUbicacion);

module.exports = enrutador;
