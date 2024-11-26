# Gestión de Salas de Reunión

Este es un proyecto de **Gestión de Salas de Reunión**, que permite gestionar salas de reuniones, realizar reservas y visualizar la disponibilidad de las salas. El sistema ofrece una interfaz web para agregar, editar, eliminar salas, así como para hacer y eliminar reservas.

## Tecnologías utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Base de Datos**: In-memory (Array) para simplificar el desarrollo
- **WebSocket**: Comunicación en tiempo real para actualizar la interfaz cuando se agregan o eliminan reservas.

## Descripción

El sistema permite lo siguiente:

1. **Gestión de Salas**:
   - Agregar nuevas salas de reunión.
   - Editar información de las salas.
   - Eliminar salas.
   - Ver la lista de salas activas e inactivas.

2. **Gestión de Reservas**:
   - Realizar una nueva reserva para una sala.
   - Eliminar una reserva existente.
   - Ver las reservas activas para las salas.

3. **Interactividad en Tiempo Real**:
   - Las acciones (agregar/eliminar) en salas y reservas se reflejan en tiempo real a través de WebSockets.

## Instalación

### 1. Clonar el repositorio

Para comenzar, clona el repositorio a tu máquina local:

```bash
git clone https://github.com/tuusuario/tu-repositorio.git
cd tu-repositorio
