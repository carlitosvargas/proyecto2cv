const express = require('express');
const enrutador = express.Router();
const { iniciarSesion, registrarUsuario } = require('../controllers/controladorAutenticacion');

// Definir rutas
enrutador.post('/iniciar-sesion', iniciarSesion);
enrutador.post('/registro', registrarUsuario);

module.exports = enrutador;
