# Sistema de Reservas de Salas - Backend MVC

## 1. Descripción del proyecto

Este proyecto corresponde al backend de un sistema de reservas de salas, desarrollado como una API RESTful utilizando Node.js, Express, MySQL y Sequelize ORM.

El sistema permite gestionar usuarios, salas y reservas mediante operaciones CRUD. Además, incorpora autenticación mediante token JWT, validación de roles, validación de horarios, estados de reserva, verificación de disponibilidad de salas y eliminación lógica de registros.

El backend fue construido bajo el patrón MVC, separando la lógica del sistema en modelos, controladores, rutas y middlewares.

## 2. Tecnologías utilizadas

- Node.js
- Express
- MySQL
- Sequelize ORM
- Sequelize CLI
- JWT
- bcryptjs
- dotenv
- cors
- nodemon
- Postman

## 3. Arquitectura del proyecto

El proyecto utiliza una arquitectura basada en el patrón MVC, separando responsabilidades en modelos, controladores, rutas y middlewares.

```txt
reservas_salas2_mvc/
│
├── config/
├── migrations/
├── seeders/
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── routes/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── package-lock.json
├── package.json
└── server.js
```

---

## 4. Instalación del proyecto

Para instalar las dependencias del proyecto, se debe ejecutar el siguiente comando en la terminal:

```bash
npm install
```

En caso de utilizar PowerShell y presentar bloqueo de scripts, se puede usar:

```bash
npm.cmd install
```

## 5. Configuración de variables de entorno

El proyecto utiliza un archivo `.env` para almacenar la configuración del servidor, la conexión a la base de datos y la clave secreta utilizada para generar los tokens JWT.

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservas_salas2_mvc
DB_PORT=3306

JWT_SECRET=reservas_salas2_clave_secreta
JWT_EXPIRES_IN=1h
```

---

## 6. Base de datos y migraciones

El proyecto utiliza MySQL como sistema gestor de base de datos.  
La base de datos debe crearse manualmente, pero las tablas se generan mediante migraciones de Sequelize.

Crear la base de datos en phpMyAdmin o MySQL con el siguiente comando:

```sql
CREATE DATABASE IF NOT EXISTS reservas_salas2_mvc
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

No se deben crear tablas manualmente, ya que las tablas del sistema son generadas mediante migraciones.

Para ejecutar las migraciones se utiliza el siguiente comando:

```bash
npx sequelize-cli db:migrate
```

En caso de utilizar PowerShell y presentar bloqueo de scripts, se puede usar:

```bash
npx.cmd sequelize-cli db:migrate
```

Las migraciones crean las siguientes tablas:

- usuarios
- salas
- reservas
- SequelizeMeta

---

## 7. Seeders y datos de prueba

El proyecto utiliza seeders de Sequelize para cargar datos iniciales de prueba en la base de datos.

Para ejecutar los seeders se utiliza el siguiente comando:

```bash
npx sequelize-cli db:seed:all
```

En caso de utilizar PowerShell y presentar bloqueo de scripts, se puede usar:

```bash
npx.cmd sequelize-cli db:seed:all
```

Los seeders cargan usuarios, salas y reservas de prueba.

### Usuario administrador

```txt
email: admin@reservas.cl
password: admin123
rol: admin
```

### Usuario normal

```txt
email: usuario@reservas.cl
password: usuario123
rol: usuario
```

Estos usuarios permiten realizar pruebas de autenticación, autorización y consumo de endpoints protegidos.

---

## 8. Ejecutar el servidor

Para levantar el backend en modo desarrollo se utiliza el siguiente comando:

```bash
npm run dev
```

En caso de utilizar PowerShell y presentar bloqueo de scripts, se puede usar:

```bash
npm.cmd run dev
```

Si la conexión con la base de datos es correcta, la terminal mostrará un mensaje similar al siguiente:

```txt
Conexión a MySQL establecida correctamente
Servidor ejecutándose en http://localhost:3000
```

Para probar que la API está funcionando, se puede abrir en el navegador:

```txt
http://localhost:3000
```

También se puede probar el endpoint de verificación:

```txt
http://localhost:3000/api/test
```

## 9. Endpoints principales

En esta sección se muestran las rutas principales de la API. Estas rutas permiten iniciar sesión, validar el token, gestionar usuarios, gestionar salas y administrar reservas.

Cada endpoint fue probado mediante Postman, utilizando los métodos HTTP solicitados: GET, POST, PUT, PATCH y DELETE.

## 10. Autenticación y roles

El sistema utiliza autenticación mediante token JWT. Esto permite que el usuario inicie sesión y luego pueda acceder a rutas protegidas usando el token entregado por el backend.

Para iniciar sesión se usa el endpoint:

```txt
POST /api/auth/login
```

Ejemplo de body:

```json
{
  "email": "admin@reservas.cl",
  "password": "admin123"
}
```

Si los datos son correctos, el sistema responde con un token JWT y los datos básicos del usuario.

Para usar rutas protegidas en Postman, el token se debe enviar en la pestaña **Authorization**, seleccionando la opción **Bearer Token**.

El sistema trabaja con dos roles:

| Rol | Descripción |
|---|---|
| admin | Puede gestionar usuarios, salas y reservas |
| usuario | Puede consultar información y crear reservas según las reglas del sistema |

El uso de roles permite controlar qué acciones puede realizar cada usuario dentro de la API.

---

## 11. Reglas de negocio implementadas

El backend incluye algunas reglas para que el sistema no solo guarde datos, sino que también valide la información antes de realizar una acción.

Las principales reglas implementadas son:

- El usuario debe iniciar sesión con credenciales correctas.
- Las contraseñas se guardan encriptadas.
- Algunas rutas requieren token JWT para poder ser utilizadas.
- Algunas acciones solo pueden ser realizadas por usuarios con rol admin.
- No se permite crear usuarios con correos repetidos.
- Las salas tienen estados como disponible, no_disponible o mantencion.
- Las reservas tienen estados como pendiente, confirmada, cancelada y finalizada.
- Las reservas solo pueden realizarse entre las 08:00 y las 18:00.
- La hora de término debe ser mayor que la hora de inicio.
- No se permite reservar una sala si ya existe otra reserva en el mismo horario.
- La eliminación de usuarios, salas y reservas se realiza de forma lógica, cambiando su estado en vez de borrar físicamente el registro.

Estas reglas permiten que el sistema sea más seguro, ordenado y cercano a un funcionamiento real.

## 12. Pruebas con Postman

Las pruebas de la API se realizaron utilizando Postman. Con esta herramienta se verificó que los endpoints respondieran correctamente y que los datos se guardaran o modificaran en la base de datos.

Se probaron los siguientes métodos HTTP:

- GET
- POST
- PUT
- PATCH
- DELETE

También se realizaron pruebas de casos correctos y casos con error, por ejemplo:

- Login correcto.
- Login incorrecto.
- Validación de token.
- Listado de usuarios, salas y reservas.
- Creación de usuarios, salas y reservas.
- Actualización de registros.
- Cambio de estado mediante PATCH.
- Eliminación lógica mediante DELETE.
- Validación de horario fuera del rango permitido.
- Validación de sala ocupada.
- Consulta de disponibilidad de sala.

Estas pruebas permiten comprobar que la API responde en formato JSON y maneja correctamente tanto las operaciones exitosas como los errores.


---

## 13. Comandos útiles

Estos son algunos comandos utilizados durante el desarrollo del proyecto.

### Levantar el servidor

```bash
npm.cmd run dev
```

### Ejecutar migraciones

```bash
npx.cmd sequelize-cli db:migrate
```

### Revertir migraciones

```bash
npx.cmd sequelize-cli db:migrate:undo:all
```

### Ejecutar seeders

```bash
npx.cmd sequelize-cli db:seed:all
```

### Revertir seeders

```bash
npx.cmd sequelize-cli db:seed:undo:all
```

Estos comandos permiten instalar, ejecutar y mantener el proyecto durante el desarrollo.

---

## 14. Estado del proyecto

El backend del sistema de reservas de salas se encuentra funcional y fue probado mediante Postman.

Hasta este punto, el proyecto incluye:

- Conexión con base de datos MySQL.
- Uso de Sequelize ORM.
- Migraciones para crear tablas.
- Seeders para cargar datos de prueba.
- Autenticación con token JWT.
- Validación de roles.
- CRUD completo de usuarios.
- CRUD completo de salas.
- CRUD completo de reservas.
- Validación de horarios.
- Consulta de disponibilidad de salas.
- Respuestas en formato JSON.

El proyecto queda preparado para ser conectado posteriormente con un frontend.

---

## 15. Autor y contexto

Proyecto desarrollado como parte de la Evaluación Sumativa de Desarrollo Backend.

Sistema desarrollado: Sistema de Reservas de Salas  
Arquitectura utilizada: MVC  
Backend: Node.js + Express + Sequelize + MySQL  
Herramienta de pruebas: Postman  

El objetivo principal del proyecto fue construir una API RESTful funcional, conectada a una base de datos, con endpoints independientes, validaciones, respuestas JSON y operaciones CRUD completas.
