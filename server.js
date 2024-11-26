const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const salasRouter = require('./routes/salas').router;
const reservasRouter = require('./routes/reservas').router;
const { setupWebSocket: setupSalasWebSocket } = require('./routes/salas');
const { setupWebSocket: setupReservasWebSocket } = require('./routes/reservas');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rutas
app.use('/salas', salasRouter);
app.use('/reservas', reservasRouter);

// Configuración de WebSocket
setupSalasWebSocket(wss);
setupReservasWebSocket(wss);

// Servir archivos estáticos desde la carpeta "Frontend"
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

const PORT = 3500;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

