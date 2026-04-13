# Portal de Trabajo — DAW

## Pasos para iniciar el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la base de datos
- Abrir MySQL Workbench o tu cliente preferido
- Ejecutar el archivo `BD_Script.sql` que está en la raíz del proyecto

### 3. Configurar variables de entorno
- Editar el archivo `.env` con tus credenciales de MySQL:
```
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

### 4. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

### 5. Abrir en el navegador
```
http://localhost:3000
```

---

## Estructura del proyecto

```
portal-trabajo/
├── BD_Script.sql               ← Script de la base de datos
├── .env                        ← Variables de entorno (credenciales)
├── package.json
├── public/
│   ├── views/                  ← Las 12 vistas HTML
│   └── assets/                 ← CSS, JS e imágenes del frontend
└── src/
    ├── index.js                ← Servidor principal
    ├── db.js                   ← Conexión a MySQL
    ├── routes/
    │   ├── authRoutes.js       ← /api/auth
    │   ├── empleoRoutes.js     ← /api/empleos
    │   ├── postulacionRoutes.js← /api/postulacion
    │   ├── foroRoutes.js       ← /api/foro
    │   ├── recursoRoutes.js    ← /api/recursos
    │   └── perfilRoutes.js     ← /api/perfil
    ├── controllers/
    │   ├── authController.js
    │   ├── empleoController.js
    │   ├── postulacionController.js
    │   ├── foroController.js
    │   ├── recursoController.js
    │   └── perfilController.js
    ├── services/
    │   ├── authService.js
    │   ├── empleoService.js
    │   ├── postulacionService.js
    │   ├── foroService.js
    │   ├── recursoService.js
    │   └── perfilService.js
    ├── middlewares/
    │   ├── errorHandler.js     ← Manejo centralizado de errores
    │   ├── validators.js       ← Validaciones con express-validator
    │   └── authMiddleware.js   ← Protección de rutas
    └── utils/
        └── helpers.js          ← Funciones utilitarias
```
