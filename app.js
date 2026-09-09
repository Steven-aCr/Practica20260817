const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://camposrecinos10_db_user:ACR2510@ac-22jq50n-shard-00-00.6csnzru.mongodb.net:27017,ac-22jq50n-shard-00-01.6csnzru.mongodb.net:27017,ac-22jq50n-shard-00-02.6csnzru.mongodb.net:27017/Practica20260905?ssl=true&replicaSet=atlas-npg020-shard-0&authSource=admin&appName=Cluster0')
    .then(() => { console.log('Conectado exitosamente a la base de datos'); })
    .catch((error) => { console.error('Error de conexion a MongoDB:', error); });

const Equipo = mongoose.model('Equipo', new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    marca: { type: String, required: true },
    serie: { type: String, required: true, unique: true },
    estado: { type: String, enum: ['Asignado', 'Stock', 'Mantenimiento'], default: 'Stock' },
    fechaIngreso: { type: Date, default: Date.now }
}));

app.post('/equipos', async (req, res) => {
    try {
        const nuevoEquipo = new Equipo(req.body);
        const equipoGuardado = await nuevoEquipo.save();
        res.status(201).json(equipoGuardado);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo guardar el equipo', details: error.message });
    }
});

app.get('/equipos', async (req, res) => {
    try {
        const equipos = await Equipo.find(req.query);
        res.status(200).json(equipos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los equipos', details: error.message });
    }
});

app.get('/equipos/:id', async (req, res) => {
    try {
        const equipo = await Equipo.findById(req.params.id);
        if (!equipo) {
            return res.status(404).json({ mensaje: 'Equipo no encontrado' });
        }
        res.status(200).json(equipo);
    } catch(error) {
        res.status(400).json({ error: 'ID invalido o error en consulta', datalle: error.message });
    }
});

app.put('/equipos/:id', async (req, res) => {
    try {
        const equipoActualizado = await Equipo.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!equipoActualizado) {
            return res.status(404).json({ mensaje: 'Equipo no encontrado para modificar' });
        }
        res.status(200).json(equipoActualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al modificar el equipo', detalle: error.message });
    }
});

app.delete('/equipos/:id', async (req, res) => {
    try {
        const equipoEliminado = await Equipo.findByIdAndDelete(req.params.id);
        if (!equipoEliminado) {
            return res.status(404).json({ mensaje: 'Equipo no encontrado para eliminar' });
        }
        res.status(200).json({ mensaje: 'Equipo eliminado correctamente', equipo: equipoEliminado });
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar el equipo', detalle: error.message });
    }
}); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});