// Conexión al WebSocket
const socket = new WebSocket('ws://localhost:3500');

// Elementos del DOM para las salas y reservas
const formSala = document.getElementById('formSala');
const salasDisponibles = document.getElementById('salasDisponibles');
const salasNoDisponibles = document.getElementById('salasNoDisponibles');
const formReserva = document.getElementById('formReserva');
const reservasList = document.getElementById('salasReservadas');
const selectSalaReserva = document.getElementById('salaReserva');

// Escucha mensajes del WebSocket
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (['add', 'update', 'delete'].includes(data.action)) {
        obtenerSalas();
        obtenerReservas();
    }
};

// Función para actualizar la lista de salas en el DOM
function actualizarSalas(salas) {
    salasDisponibles.innerHTML = '';
    salasNoDisponibles.innerHTML = '';

    salas.forEach(sala => {
        const li = document.createElement('li');
        li.textContent = `${sala.nombre} - Capacidad: ${sala.capacidad} - Estado: ${sala.estado}`;

        const editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar';
        editarBtn.onclick = () => editarSala(sala);

        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarSala(sala.id);

        li.appendChild(editarBtn);
        li.appendChild(eliminarBtn);

        if (sala.estado === 'activo') {
            salasDisponibles.appendChild(li);
        } else {
            salasNoDisponibles.appendChild(li);
        }
    });

    actualizarOpcionesDeSalas(salas);
}

// Función para actualizar el select de salas para reservas
function actualizarOpcionesDeSalas(salas) {
    selectSalaReserva.innerHTML = ''; // Limpiar opciones previas

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona una sala';
    selectSalaReserva.appendChild(defaultOption);

    salas
        .filter(sala => sala.estado === 'activo') // Solo salas activas
        .forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = `${sala.nombre} - Capacidad: ${sala.capacidad}`;
            selectSalaReserva.appendChild(option);
        });
}

// Función para obtener todas las salas
async function obtenerSalas() {
    try {
        const response = await fetch('http://localhost:3500/salas');
        const salas = await response.json();
        actualizarSalas(salas);
    } catch (error) {
        console.error('Error al obtener salas:', error);
    }
}

// Función para obtener todas las reservas
async function obtenerReservas() {
    try {
        const response = await fetch('http://localhost:3500/reservas');
        const reservas = await response.json();
        actualizarReservas(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
    }
}

// Función para actualizar la lista de reservas en el DOM
function actualizarReservas(reservas) {
    reservasList.innerHTML = '';

    reservas.forEach(reserva => {
        const li = document.createElement('li');
        li.textContent = `Sala ID: ${reserva.salaId}, Reservante: ${reserva.nombreReservante}, Inicio: ${reserva.inicio}, Fin: ${reserva.fin}`;

        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.onclick = () => eliminarReserva(reserva.id);

        li.appendChild(eliminarBtn);
        reservasList.appendChild(li);
    });
}

// Función para agregar una sala nueva
formSala.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombreSala').value;
    const capacidad = document.getElementById('capacidadSala').value;
    const estado = document.getElementById('estadoSala').value;

    try {
        const response = await fetch('http://localhost:3500/salas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, capacidad, estado })
        });
        const data = await response.json();

        if (data.mensaje) {
            console.log(data.mensaje);
            obtenerSalas();
            formSala.reset();
        } else if (data.error) {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error al crear sala:', error);
    }
});

// Función para editar una sala existente
async function editarSala(sala) {
    const nuevoNombre = prompt('Nuevo nombre de la sala:', sala.nombre);
    const nuevaCapacidad = prompt('Nueva capacidad de la sala:', sala.capacidad);
    const nuevoEstado = prompt('Nuevo estado de la sala (activo/inactivo):', sala.estado);

    try {
        const response = await fetch(`http://localhost:3500/salas/${sala.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nuevoNombre,
                capacidad: nuevaCapacidad,
                estado: nuevoEstado
            })
        });
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            obtenerSalas();
        }
    } catch (error) {
        console.error('Error al editar sala:', error);
    }
}

// Función para eliminar una sala
async function eliminarSala(salaId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
        try {
            const response = await fetch(`http://localhost:3500/salas/${salaId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                obtenerSalas();
            } else {
                alert('Error al eliminar sala');
            }
        } catch (error) {
            console.error('Error al eliminar sala:', error);
        }
    }
}

// Función para agregar una nueva reserva
formReserva.addEventListener('submit', async (event) => {
    event.preventDefault();

    const salaId = document.getElementById('salaReserva').value;
    const nombreReservante = document.getElementById('reservante').value;
    const inicio = document.getElementById('inicioReserva').value;
    const fin = document.getElementById('finReserva').value;

    // Verificación de campos vacíos
    if (!salaId || !nombreReservante || !inicio || !fin) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const datosReserva = { salaId, nombreReservante, inicio, fin };

    try {
        const response = await fetch('http://localhost:3500/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosReserva)
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa, mostramos un mensaje de error
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.mensaje) {
            console.log(data.mensaje);
            obtenerReservas(); // Actualizar la lista de reservas
            formReserva.reset(); // Limpiar el formulario
        } else if (data.error) {
            alert(data.error); // Mostrar el error que devuelve el servidor
        }
    } catch (error) {
        // Mostrar detalles del error en la consola
        console.error('Error al crear reserva:', error);
        alert(`Ocurrió un error al intentar realizar la reserva. Detalles: ${error.message}`);
    }
});



// Función para eliminar una reserva
async function eliminarReserva(reservaId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
        try {
            const response = await fetch(`http://localhost:3500/reservas/${reservaId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                obtenerReservas();
            } else {
                alert('Error al eliminar reserva');
            }
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
        }
    }
}

// Llamada inicial para cargar las salas y reservas cuando se carga la página
obtenerSalas();
obtenerReservas();

