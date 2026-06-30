const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const aplicacion = express();

aplicacion.use(cors());
aplicacion.use(express.json());

// Importar rutas
const rutasAutenticacion = require('./routes/rutasAutenticacion');
const rutasUbicacion = require('./routes/rutasUbicacion');
const rutasSubida = require('./routes/rutasSubida');

// Usar rutas
aplicacion.use('/api/auth', rutasAutenticacion);
aplicacion.use('/api/ubicaciones', rutasUbicacion);
aplicacion.use('/api/subida', rutasSubida);

// Servir archivos estáticos de la carpeta uploads
const path = require('path');
aplicacion.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PUERTO = process.env.PORT || 5000;

aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});
