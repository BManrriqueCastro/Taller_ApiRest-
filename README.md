# Gestión de Salas de Reunión

Este proyecto es una aplicación de gestión de salas de reunión, diseñada para permitir la creación, modificación, y eliminación de reservas de salas. Los usuarios pueden ver las salas disponibles, realizar reservas, y gestionar la disponibilidad de las mismas de manera interactiva y en tiempo real. El sistema también permite verificar la disponibilidad de una sala antes de realizar una reserva para evitar solapamientos.

## Descripción General

Este proyecto tiene como objetivo facilitar la gestión de salas de reuniones a través de una aplicación web. Permite a los usuarios:

- Ver las salas disponibles y su estado (activo o inactivo).
- Realizar reservas de salas especificando el horario de inicio y fin.
- Eliminar reservas existentes.
- Realizar operaciones de manera eficiente y en tiempo real mediante la actualización automática de la interfaz al realizar cambios.

### Funcionalidades principales:
1. **Gestión de Salas**:
    - Añadir nuevas salas con información como nombre, capacidad y estado.
    - Modificar el estado de las salas (activo/inactivo).
    - Eliminar salas si no tienen reservas asociadas.
  
2. **Gestión de Reservas**:
    - Realizar nuevas reservas para salas disponibles.
    - Ver reservas actuales y eliminar aquellas que ya no sean necesarias.
    - El sistema valida que no haya solapamiento de reservas en el mismo horario para una sala.

3. **Interactividad en Tiempo Real**:
    - Se implementa un sistema de WebSocket para actualizar en tiempo real la lista de reservas y el estado de las salas sin necesidad de refrescar la página.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Base de Datos**: Array en memoria (para propósitos de demostración)
- **WebSocket**: Para la comunicación en tiempo real entre el cliente y el servidor
- **Postman**: Para probar las API de creación de salas y reservas

## Descripción de Salas y Reservas

### Salas
Cada sala tiene los siguientes atributos:
- **ID**: Un identificador único de la sala.
- **Nombre**: El nombre de la sala.
- **Capacidad**: El número máximo de personas que puede albergar la sala.
- **Estado**: Puede ser "activo" o "inactivo". Solo las salas activas se pueden reservar.

### Reservas
Las reservas incluyen:
- **ID de la sala**: El identificador de la sala reservada.
- **Nombre del reservante**: El nombre de la persona que realiza la reserva.
- **Inicio**: Fecha y hora de inicio de la reserva.
- **Fin**: Fecha y hora de finalización de la reserva.

El sistema verifica que no haya solapamientos de reservas. Si intentas reservar una sala en un horario que ya está ocupado, el sistema no permitirá realizar la reserva.

## Interactividad en Tiempo Real

La aplicación incluye interactividad en tiempo real utilizando **WebSockets**. Gracias a esta tecnología, cualquier cambio en el estado de las reservas (como la creación o eliminación de reservas) se reflejará instantáneamente en todos los clientes conectados. Esto asegura que todos los usuarios vean la información más actualizada sin necesidad de recargar la página.

### WebSockets:
- Cuando se agrega, edita o elimina una reserva, todos los clientes conectados reciben los cambios al instante.
  
## Interactividad en Tiempo Real con Postman

Para probar la interactividad en tiempo real con Postman, sigue estos pasos:

1. Realiza una **reserva** o **elimina una reserva** usando Postman, haciendo una solicitud `POST` o `DELETE` a la API.
2. Asegúrate de que la API esté ejecutándose en el servidor (puedes probar en `localhost:3500/salas` y `localhost:3500/reservas`).
3. Los cambios que realices a través de Postman se reflejarán automáticamente en la interfaz de usuario en tiempo real si está conectada a través de WebSocket.

## Implementación de la Edición de Reservas

### Plan para la implementación de la edición de reservas:

- La funcionalidad de **editar reservas** aún no está implementada.
- La idea es permitir que los usuarios puedan cambiar la fecha y hora de una reserva previamente realizada, siempre y cuando no haya conflictos con otras reservas.

Para editar una reserva, los usuarios podrán:
- Seleccionar la reserva que desean modificar.
- Cambiar las fechas de inicio y fin.
- Validar que el nuevo horario no se solape con otras reservas.
- Confirmar la edición de la reserva.

Esta funcionalidad se implementará utilizando la misma lógica que la creación de reservas, pero con un paso adicional de validación para asegurar que el cambio no genere conflictos con otras reservas existentes.

## Instalación y Uso

### Prerrequisitos
Para ejecutar el proyecto, necesitas tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/): Descárgalo desde la página oficial.
- [Postman](https://www.postman.com/): Para probar las API (opcional).

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/BManrriqueCastro/Taller_ApiRest-.git

