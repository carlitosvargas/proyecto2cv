const express = require('express');
const enrutador = express.Router();
const multer = require('multer');
const path = require('path');
const { verificarAdministrador } = require('../middleware/middlewareAutenticacion');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, sufijoUnico + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para subir imágenes
enrutador.post('/', verificarAdministrador, upload.array('imagenes', 10), (peticion, respuesta) => {
  try {
    if (!peticion.files || peticion.files.length === 0) {
      return respuesta.status(400).json({ mensaje: 'No se subió ninguna imagen' });
    }
    
    // Obtener las URLs de los archivos subidos
    const urls = peticion.files.map(file => `/uploads/${file.filename}`);
    respuesta.json({ urls });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al subir las imágenes' });
  }
});

module.exports = enrutador;
