const express = require('express');
const WebSocket = require('ws');
const router = express.Router();
const { salas } = require('./salas');

let reservas = [];
let wss;

router.get('/', (req, res) => {
    res.json(reservas);
});

router.post('/', (req, res) => {
    console.log(req.body);  // Añadir esto para depurar

    const { salaId, nombreReservante, inicio, fin } = req.body;
    // Convertir las fechas de inicio y fin a objetos Date
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    
    const sala = salas.find(s => s.id === parseInt(salaId));
    if (!sala) {
        return res.status(400).json({ message: 'Sala no encontrada' });
    }

    if (sala.estado !== 'activo') {
        return res.status(400).json({ message: 'La sala está inactiva' });
    }

    // Comprobar si hay solapamiento de reservas
    for (let reserva of reservas) {
        const reservaInicio = new Date(reserva.inicio);
        const reservaFin = new Date(reserva.fin);

        if (
            reserva.salaId === salaId &&
            ((fechaInicio >= reservaInicio && fechaInicio < reservaFin) ||
            (fechaFin > reservaInicio && fechaFin <= reservaFin))
        ) {
            return res.status(400).json({ message: 'La reserva se solapa con otra' });
        }
    }

    const id = reservas.length + 1;
    const nuevaReserva = { id, salaId, nombreReservante, inicio: fechaInicio, fin: fechaFin };
    reservas.push(nuevaReserva);

    broadcast({ action: 'add', reserva: nuevaReserva });
    res.status(201).json({ mensaje: 'Reserva creada', reserva: nuevaReserva });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const reservaEliminada = reservas.find(r => r.id === parseInt(id));

    if (reservaEliminada) {
        reservas = reservas.filter(r => r.id !== parseInt(id));
        broadcast({ action: 'delete', reserva: reservaEliminada });
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Reserva no encontrada' });
    }
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

module.exports = { router, setupWebSocket };


