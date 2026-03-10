const express = require('express');
const metaController = require('../controllers/metaController');

const router = express.Router();

// Rutas para los países
router.get('/', metaController.getAllMetas);
router.get('/:id', metaController.getMetaById);
router.post('/', metaController.createMeta);
router.put('/:id', metaController.updateMeta);
router.delete('/:id', metaController.deleteMeta);

module.exports = router;