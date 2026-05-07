# Sistema de Reservas de Salas - Frontend

## 1. Descripción del proyecto

Este proyecto corresponde al frontend del **Sistema de Reservas de Salas**, desarrollado como una aplicación web administrativa utilizando **React.js**, **Vite**, **Bootstrap** y **React Router DOM**.

El sistema permite gestionar de forma centralizada usuarios, salas y reservas dentro de una empresa o institución. La aplicación se conecta a un backend RESTful desarrollado con Node.js, Express, MySQL, Sequelize y autenticación JWT. El backend expone endpoints independientes para autenticación, usuarios, salas y reservas. :contentReference[oaicite:0]{index=0}

## 2. Objetivo del frontend

El objetivo del frontend es entregar una interfaz visual, funcional y responsiva que permita consumir los endpoints del backend y realizar operaciones principales del sistema, tales como:

- Iniciar sesión.
- Gestionar usuarios.
- Visualizar usuarios inactivos.
- Gestionar salas.
- Crear y gestionar reservas.
- Cambiar estados de reservas.
- Utilizar token JWT para acceder a rutas protegidas.

## 3. Tecnologías utilizadas

- React.js
- Vite
- JavaScript
- JSX
- Bootstrap
- React Router DOM
- Fetch API
- HTML
- CSS

## 4. Estructura del proyecto

La estructura principal del frontend es la siguiente:

```txt
reserva_salas2_front/
│
├── public/
│
├── src/
│   ├── assets/
│   │   └── logo.png
│   │
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Usuarios.jsx
│   │   ├── UsuariosInactivos.jsx
│   │   ├── Salas.jsx
│   │   └── Reservas.jsx
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── package-lock.json
├── eslint.config.js
├── index.html
├── vite.config.js
└── README.md
```

## 5. Descripción de carpetas principales

### src/assets

En este proyecto se utiliza para guardar el logo institucional del sistema, el cual se muestra en la pantalla de inicio de sesión.

### src/components

Carpeta destinada a componentes reutilizables del sistema.

Actualmente contiene:

- `Navbar.jsx`: menú principal de navegación del sistema.

### src/pages

Carpeta que contiene las páginas principales del frontend:

- `Login.jsx`: pantalla de inicio de sesión.
- `Dashboard.jsx`: panel principal del sistema.
- `Usuarios.jsx`: gestión de usuarios activos.
- `UsuariosInactivos.jsx`: historial de usuarios inactivos.
- `Salas.jsx`: gestión de salas.
- `Reservas.jsx`: gestión de reservas.

### src/services


En esta versión, las peticiones `fetch` se mantuvieron dentro de cada página principal para facilitar la implementación, prueba y comprensión del flujo completo.

### public

Carpeta generada por Vite para almacenar archivos públicos y estáticos.

En este proyecto se mantuvo como parte de la estructura base, aunque no fue utilizada directamente para los recursos principales.

---

## 6. Archivo eslint.config.js

El archivo `eslint.config.js` fue generado automáticamente por Vite al crear el proyecto React.

Este archivo contiene la configuración base de ESLint, herramienta que permite revisar código JavaScript y React para detectar posibles errores, advertencias, variables sin uso o malas prácticas.

Durante el desarrollo del proyecto, este archivo se mantuvo con la configuración original generada por Vite y no fue necesario modificarlo. El desarrollo del frontend se realizó principalmente en los componentes y páginas ubicados dentro de la carpeta `src`.

---

## 7. Instalación del proyecto

Para instalar las dependencias del frontend, se debe ejecutar el siguiente comando dentro de la carpeta del proyecto:

```bash
npm install
```

En PowerShell también se puede utilizar:

```bash
npm.cmd install
```

---

## 8. Dependencias adicionales instaladas

Para el desarrollo del frontend se instalaron las siguientes dependencias adicionales:

```bash
npm install bootstrap react-router-dom
```

Bootstrap se utilizó para el diseño responsivo y componentes visuales.

React Router DOM se utilizó para manejar la navegación entre páginas del sistema.

---

## 9. Levantar el frontend

Para ejecutar el frontend en entorno local, se debe utilizar el siguiente comando:

```bash
npm run dev
```

En PowerShell:

```bash
npm.cmd run dev
```

El frontend queda disponible en la siguiente dirección:

```txt
http://localhost:5173
```

---

## 10. Levantar el backend

El backend debe estar ejecutándose antes de probar login, usuarios, salas y reservas.

Ruta del backend:

```txt
C:\Users\rosita\reservas_salas2_mvc
```

Comando para levantar backend:

```bash
npm run dev
```

En PowerShell:

```bash
npm.cmd run dev
```

El backend queda disponible en:

```txt
http://localhost:3000
```

---

## 11. Credenciales de prueba

Usuario administrador:

```txt
Correo: admin@reservas.cl
Contraseña: admin123
```

Estas credenciales permiten ingresar al panel administrativo del sistema.

---

## 12. Rutas principales del frontend

Las rutas principales implementadas en el frontend son:

```txt
/login
/dashboard
/usuarios
/usuarios-inactivos
/salas
/reservas
```

---

## 13. Módulos implementados

### Login

Permite iniciar sesión mediante correo electrónico y contraseña.

Al iniciar sesión correctamente, el frontend guarda el token JWT en `localStorage` y redirige al usuario al panel principal.

### Dashboard

Pantalla principal del sistema.

Presenta una vista general del sistema y accesos rápidos a los módulos principales:

- Usuarios
- Usuarios inactivos
- Salas
- Reservas

### Usuarios

Permite:

- Crear usuarios.
- Listar usuarios.
- Editar usuarios.
- Eliminar usuarios de forma lógica.

La eliminación lógica cambia el estado del usuario a `inactivo`, sin borrarlo físicamente de la base de datos.

### Usuarios inactivos

Permite visualizar usuarios eliminados lógicamente.

Esta vista permite mantener trazabilidad histórica de los registros y diferenciar entre usuarios activos e inactivos.

### Salas

Permite:

- Crear salas.
- Listar salas.
- Editar salas.
- Eliminar salas de forma lógica.

Cuando una sala se elimina, cambia su estado a `no_disponible`.

### Reservas

Permite:

- Crear reservas.
- Listar reservas.
- Cambiar estado de reservas.

Las reservas pueden tener los siguientes estados:

```txt
pendiente
confirmada
finalizada
cancelada
```

---

## 14. Lógica funcional del sistema

El sistema separa los conceptos principales de la siguiente manera:

```txt
Usuarios = personas o funcionarios registrados en el sistema.
Salas = espacios físicos disponibles para reserva.
Reservas = uso de una sala en una fecha y horario específico.
```

El módulo Salas funciona como un catálogo de espacios físicos.

Una sala debe registrarse una sola vez y luego puede ser utilizada en múltiples reservas, siempre que no exista cruce de horario.

Ejemplo:

```txt
Sala Reunión A

Reserva 1: 09:00 a 10:00
Reserva 2: 11:00 a 12:00
```

La disponibilidad por horario se controla desde el módulo Reservas, no cambiando manualmente el estado de la sala.

---

## 15. Estado de salas

El estado de una sala representa su condición general.

Los estados utilizados son:

```txt
disponible
no_disponible
mantenimiento / mantención
```

Una sala en estado `disponible` puede ser seleccionada al crear una reserva.

Una sala en estado `no_disponible` o `mantenimiento` no aparece como opción para reservar.

Esto permite evitar que se generen reservas sobre salas que no están habilitadas para uso.

---

## 16. Observación en reservas

El campo observación permite registrar detalles adicionales de la reserva, como:

```txt
Solicitante
Motivo de la reunión
Cantidad de asistentes
Área o departamento
```

Ejemplo:

```txt
Solicitante: Rosa Pérez.
Motivo: reunión de coordinación.
Asistentes: 8 personas.
```

En esta versión, el sistema funciona como un panel administrativo. Por ello, la reserva puede ser registrada por un usuario administrador o funcionario del sistema, mientras que los detalles del solicitante pueden quedar registrados en el campo observación.

---

## 17. Manejo de token JWT

El frontend utiliza el token JWT entregado por el backend al iniciar sesión.

El token se guarda en:

```js
localStorage
```

Luego se envía en las peticiones protegidas mediante el encabezado:

```txt
Authorization: Bearer token
```

Si el token expira o no existe, el sistema redirige al usuario nuevamente al login.

Esto permite proteger las operaciones principales del sistema, como usuarios, salas y reservas.

---

## 18. Diseño responsivo

El sistema utiliza Bootstrap para lograr una interfaz responsiva y adaptable a distintos tamaños de pantalla.

Se implementaron elementos como:

- Navbar responsivo.
- Cards.
- Formularios.
- Tablas responsivas.
- Botones de acción.
- Alertas visuales.
- Diseño adaptable para escritorio y dispositivos móviles.

---