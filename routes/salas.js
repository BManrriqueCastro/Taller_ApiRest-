const express = require('express');
const WebSocket = require('ws');
const router = express.Router();

let salas = [];
let wss;

router.get('/', (req, res) => {
    res.json(salas);
});

function nombreSalaUnico(nombre, id = null) {
    return !salas.some(sala => sala.nombre === nombre && sala.id !== id);
}

router.post('/', (req, res) => {
    const { nombre, capacidad, estado } = req.body;

    if (!nombre || !capacidad || !estado) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    if (!nombreSalaUnico(nombre)) {
        return res.status(400).json({ error: 'El nombre de la sala ya existe.' });
    }

    const id = salas.length + 1;
    const nuevaSala = { id, nombre, capacidad, estado };
    salas.push(nuevaSala);
    
    broadcast({ action: 'add', sala: nuevaSala });
    res.status(201).json({ mensaje: 'Sala creada', sala: nuevaSala });
});

router.put('/:id', (req, res) => {
    const salaId = parseInt(req.params.id);
    const { nombre, capacidad, estado } = req.body;
    const sala = salas.find(s => s.id === salaId);

    if (!sala) {
        return res.status(404).json({ error: 'Sala no encontrada.' });
    }

    if (nombre && !nombreSalaUnico(nombre, salaId)) {
        return res.status(400).json({ error: 'El nombre de la sala ya existe.' });
    }

    if (nombre) sala.nombre = nombre;
    if (capacidad) sala.capacidad = parseInt(capacidad);
    if (estado) sala.estado = estado;

    broadcast({ action: 'update', sala });
    res.json(sala);
});

router.delete('/:id', (req, res) => {
    const salaId = parseInt(req.params.id);
    const index = salas.findIndex(s => s.id === salaId);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }

    const salaEliminada = salas.splice(index, 1)[0];
    broadcast({ action: 'delete', sala: salaEliminada });

    res.json({ mensaje: 'Sala eliminada con éxito.', sala: salaEliminada });
});

function broadcast(data) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

function setupWebSocket(webSocketServer) {
    wss = webSocketServer;
}

module.exports = { router, salas, setupWebSocket };


