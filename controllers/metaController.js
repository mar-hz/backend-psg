const pool = require('../db');

// Obtener todas las metas
exports.getAllMetas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM meta ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las metas:', error);
        res.status(500).json({ error: 'Error al obtener las metas' });
    }
};

// Obtener una meta por ID
exports.getMetaById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM meta WHERE idMeta = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la meta:', error);
        res.status(500).json({ error: 'Error al obtener la meta' });
    }
};

// Crear un nueva meta
exports.createMeta = async (req, res) => {
    const { nombre, montoActual, fechaFin, montoMeta } = req.body;
    // Validación básica
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la meta es obligatorio' });
    }
    if (!fechaFin) {
        return res.status(400).json({ error: 'La fecha de finalización de la meta es obligatoria' });
    }
    if (!montoMeta) {
        return res.status(400).json({ error: 'El monto deseado de la meta es obligatorio' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO meta (nombre, montoActual, fechaInicio, fechaFin, montoMeta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, montoActual || 0, new Date(), fechaFin, montoMeta]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la meta:', error);
        res.status(500).json({ error: 'Error al crear la meta' });
    }
};

// Actualizar una meta existente
exports.updateMeta = async (req, res) => {
    const { nombre, montoActual, fechaFin, montoMeta } = req.body;
    const metaId = req.params.id;
    // Validación básica
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la meta es obligatorio' });
    }
    try {
        // Verificar si la meta existe
        const checkResult = await pool.query('SELECT * FROM meta WHERE idMeta = $1', [metaId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }
        // Actualizar la meta
        const updateResult = await pool.query(
            'UPDATE meta SET nombre = $1, montoActual = $2, fechaFin = $3, montoMeta = $4 WHERE idMeta = $5 RETURNING *',
            [nombre, montoActual, fechaFin, montoMeta, metaId]
        );
        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error('Error al actualizar la meta:', error);
        res.status(500).json({ error: 'Error al actualizar la meta' });
    }
};

// Eliminar una meta
exports.deleteMeta = async (req, res) => {
    const metaId = req.params.id;
    try {
        // Verificar si la meta existe
        const checkResult = await pool.query('SELECT * FROM meta WHERE idMeta = $1', [metaId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }
        // Eliminar la meta
        await pool.query('DELETE FROM meta WHERE idMeta = $1', [metaId]);
        res.json({ message: 'Meta eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la meta:', error);
        res.status(500).json({ error: 'Error al eliminar la meta' });
    }
};