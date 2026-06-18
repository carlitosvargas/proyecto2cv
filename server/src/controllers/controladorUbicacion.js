const conexionPool = require('../config/bd');

// Obtener todas las ubicaciones
exports.obtenerTodasLasUbicaciones = async (peticion, respuesta) => {
  try {
    const { categoria, busqueda } = peticion.query;
    let consultaSql = 'SELECT * FROM ubicaciones WHERE 1=1';
    let parametrosConsulta = [];

    if (categoria) {
      consultaSql += ' AND categoria = ?';
      parametrosConsulta.push(categoria);
    }
    
    if (busqueda) {
      consultaSql += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
      parametrosConsulta.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    const [ubicaciones] = await conexionPool.query(consultaSql, parametrosConsulta);
    respuesta.json(ubicaciones);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al obtener ubicaciones' });
  }
};

// Obtener una ubicación por su ID
exports.obtenerUbicacionPorId = async (peticion, respuesta) => {
  try {
    const [ubicaciones] = await conexionPool.query('SELECT * FROM ubicaciones WHERE id = ?', [peticion.params.id]);
    if (ubicaciones.length === 0) {
      return respuesta.status(404).json({ mensaje: 'Ubicación no encontrada' });
    }
    respuesta.json(ubicaciones[0]);
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al obtener la ubicación' });
  }
};

// Crear una nueva ubicación
exports.crearUbicacion = async (peticion, respuesta) => {
  const { nombre, descripcion, categoria, latitud, longitud, direccion, url_imagen } = peticion.body;
  try {
    const [resultado] = await conexionPool.query(
      'INSERT INTO ubicaciones (nombre, descripcion, categoria, latitud, longitud, direccion, url_imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, categoria, latitud, longitud, direccion, url_imagen]
    );
    respuesta.status(201).json({ id: resultado.insertId, mensaje: 'Ubicación creada exitosamente' });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al crear la ubicación' });
  }
};

// Actualizar una ubicación existente
exports.actualizarUbicacion = async (peticion, respuesta) => {
  const { nombre, descripcion, categoria, latitud, longitud, direccion, url_imagen } = peticion.body;
  try {
    await conexionPool.query(
      'UPDATE ubicaciones SET nombre = ?, descripcion = ?, categoria = ?, latitud = ?, longitud = ?, direccion = ?, url_imagen = ? WHERE id = ?',
      [nombre, descripcion, categoria, latitud, longitud, direccion, url_imagen, peticion.params.id]
    );
    respuesta.json({ mensaje: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al actualizar la ubicación' });
  }
};

// Eliminar una ubicación
exports.eliminarUbicacion = async (peticion, respuesta) => {
  try {
    await conexionPool.query('DELETE FROM ubicaciones WHERE id = ?', [peticion.params.id]);
    respuesta.json({ mensaje: 'Ubicación eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    respuesta.status(500).json({ mensaje: 'Error al eliminar la ubicación' });
  }
};
