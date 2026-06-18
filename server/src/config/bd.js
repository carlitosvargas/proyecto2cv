const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuración base de conexión
const configuracionBD = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

const nombreBD = process.env.DB_NAME || 'guia_turistica';

// Crear pool de conexiones a la base de datos ya especificada
const conexionPool = mysql.createPool({
  ...configuracionBD,
  database: nombreBD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para inicializar la base de datos
const inicializarBD = async () => {
  try {
    // 1. Crear conexión temporal SIN especificar base de datos
    const conexionInicial = await mysql.createConnection(configuracionBD);
    
    // 2. Crear la base de datos si no existe
    await conexionInicial.query(`CREATE DATABASE IF NOT EXISTS \`${nombreBD}\``);
    await conexionInicial.end(); // Cerrar la conexión temporal

    // 3. Ahora conectarse usando el pool con la base de datos ya seleccionada
    const conexion = await conexionPool.getConnection();
    
    // Crear tabla de usuarios
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('administrador', 'visitante') DEFAULT 'visitante'
      )
    `);

    // Crear tabla de ubicaciones turísticas
    await conexion.query(`
      CREATE TABLE IF NOT EXISTS ubicaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(50),
        latitud DECIMAL(10, 8),
        longitud DECIMAL(11, 8),
        direccion VARCHAR(255),
        url_imagen VARCHAR(255),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insertar administrador por defecto si no existe
    const [filas] = await conexion.query('SELECT * FROM usuarios WHERE rol = "administrador"');
    if (filas.length === 0) {
      const bcrypt = require('bcryptjs');
      const contrasenaEncriptada = await bcrypt.hash('admin123', 10);
      await conexion.query(
        'INSERT INTO usuarios (nombre_usuario, contrasena, rol) VALUES (?, ?, ?)',
        ['admin', contrasenaEncriptada, 'administrador']
      );
      console.log('Usuario administrador por defecto creado: admin / admin123');
    }

    conexion.release();
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

inicializarBD();

module.exports = conexionPool;
