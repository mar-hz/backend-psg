const express = require('express');
const cors = require('cors');
const metaRoutes = require('./routes/metaRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/metas', metaRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('API de Metas funcionando correctamente con PostgreSQL');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});