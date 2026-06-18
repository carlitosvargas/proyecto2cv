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

// Usar rutas
aplicacion.use('/api/auth', rutasAutenticacion);
aplicacion.use('/api/ubicaciones', rutasUbicacion);

const PUERTO = process.env.PORT || 5000;

aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});
