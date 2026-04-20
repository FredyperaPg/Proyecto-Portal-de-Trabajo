# 🚀 BLOQUE 1 — Portal de Empleos: Autenticación y Perfiles

## ✅ Qué fue modificado/creado

### Backend (src/)
| Archivo | Cambio |
|---|---|
| `src/index.js` | Actualizado: registra `/api/perfiles` y todos los módulos |
| `src/config/db.js` | Sin cambios (ya estaba correcto) |
| `src/services/authService.js` | **REESCRITO**: usa `UUID_TO_BIN`, `BIN_TO_UUID`, `bcryptjs`, transacciones |
| `src/services/perfilService.js` | **NUEVO**: CRUD completo candidato + empresa + admin |
| `src/controllers/authController.js` | **CORREGIDO**: retorna `idEmpresa`/`idCandidato` en sesión |
| `src/controllers/perfilController.js` | **NUEVO**: 8 endpoints de perfil |
| `src/routes/perfilRoutes.js` | **NUEVO**: rutas protegidas por rol |
| `src/middlewares/authMiddleware.js` | **NUEVO**: `requireAuth` y `requireRole` |

### Frontend
| Archivo | Vista conectada |
|---|---|
| `public/assets/js/auth/login.js` | `VISTA_01_Login.html` |
| `public/assets/js/auth/register-postulante.js` | `VISTA_03_Register_Postulante.html` |
| `public/assets/js/auth/register-empleador.js` | `VISTA_02_Register_Empleador.html` |
| `public/assets/js/perfil/perfil-postulante.js` | `VISTA_14_PerilPostulante.html` |
| `public/assets/js/perfil/perfil-empresa.js` | `VISTA_29_PerfilEmpresa.html` |

### HTMLs parcheados (se agregaron `id`, `<form>`, `<script>`)
- `VISTA_01_Login.html`
- `VISTA_02_Register_Empleador.html`
- `VISTA_03_Register_Postulante.html`
- `VISTA_14_PerilPostulante.html`
- `VISTA_29_PerfilEmpresa.html`

---

## ⚙️ PASOS PARA PONER EN MARCHA

### 1. Base de datos
```sql
-- Primero ejecuta el script principal:
source BD_Script.sql;

-- Luego ejecuta el seed de roles (OBLIGATORIO):
source BD_Roles_Seed.sql;
```

### 2. Instalar dependencias
```bash
cd portal-trabajo
npm install
```

### 3. Configurar .env
Copia `.env.example` a `.env` y pon tu contraseña de MySQL:
```
DB_PASSWORD=TU_PASSWORD
```

### 4. Iniciar el servidor
```bash
npm run dev
```

### 5. Abrir el frontend
Abre `VISTA_01_Login.html` con **Live Server** en VS Code (puerto 5500).

---

## 📡 Endpoints disponibles (Bloque 1)

### Auth — `/api/auth`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register-postulante` | Registro candidato |
| POST | `/register-empleador` | Registro empresa |
| POST | `/login` | Iniciar sesión |
| GET | `/check` | Verificar sesión activa |
| POST | `/logout` | Cerrar sesión |

### Perfiles — `/api/perfiles`
| Método | Ruta | Rol requerido |
|---|---|---|
| GET | `/candidato/me` | candidato |
| PUT | `/candidato/me` | candidato |
| GET | `/empresa/me` | empleador |
| PUT | `/empresa/me` | empleador |
| GET | `/empresa/:id` | público |
| GET | `/admin/candidatos` | admin |
| GET | `/admin/empresas` | admin |
| PATCH | `/admin/usuarios/:id/estado` | admin |

---

## ⚠️ Problemas críticos que fueron corregidos

1. **`authService.js` original**: usaba `INSERT` sin `UUID_TO_BIN()` — los IDs BINARY(16) nunca habrían funcionado
2. **bcrypt vs bcryptjs**: el original importaba `bcrypt` (nativo) pero `package.json` tiene `bcryptjs` — crash al arrancar
3. **`authMiddleware.js`**: completamente vacío — ninguna ruta privada estaba protegida
4. **HTMLs sin `id` ni `<form>`**: el JS no podía conectarse a ningún input
5. **Sin seed de Roles**: el registro fallaba porque la tabla `Roles` estaba vacía
