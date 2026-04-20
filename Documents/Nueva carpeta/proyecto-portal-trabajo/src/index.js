import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes        from './routes/authRoutes.js';
import empleoRoutes      from './routes/empleoRoutes.js';
import perfilRoutes      from './routes/perfilRoutes.js';
import postulacionRoutes from './routes/postulacionRoutes.js';
import foroRoutes        from './routes/foroRoutes.js';
import recursoRoutes     from './routes/recursoRoutes.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── ESTÁTICOS ─────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ── MIDDLEWARES ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_universidad_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

// ── HELPER ─────────────────────────────────────────────────────────────────────
const vista = (rel) => (req, res) =>
    res.sendFile(path.join(__dirname, '../public/views', rel));

// ── RUTAS PÚBLICAS ─────────────────────────────────────────────────────────────
app.get('/',                  vista('Publicas/VISTA_04_Inicio.html'));
app.get('/inicio',            vista('Publicas/VISTA_04_Inicio.html'));
app.get('/login',             vista('Publicas/VISTA_01_Login.html'));
app.get('/registro-empresa',  vista('Publicas/VISTA_02_Register_Empleador.html'));
app.get('/registro',          vista('Publicas/VISTA_03_Register_Postulante.html'));
app.get('/empleos',           vista('Publicas/VISTA_05_Empleos.html'));
app.get('/empleo/detalle',    vista('Publicas/VISTA_06_DetallesEmpleo.html'));
app.get('/empresa/perfil-publico', vista('Publicas/VISTA_07_PerfilEmpresa.html'));
app.get('/empresa/empleos-publico', vista('Publicas/VISTA_08_PerfilEmpresaEmpleos.html'));
app.get('/recursos',          vista('Publicas/VISTA_09_Recursos.html'));
app.get('/recurso/detalle',   vista('Publicas/VISTA_10_DetallesRecurso.html'));
app.get('/foro',              vista('Publicas/VISTA_11_Foro.html'));
app.get('/foro/detalle',      vista('Publicas/VISTA_12_DetallesForo.html'));

// ── POSTULANTE ────────────────────────────────────────────────────────────────
app.get('/postulante/inicio',           vista('Privadas/postulante/VISTA_13_InicioPostulante.html'));
app.get('/postulante/perfil',           vista('Privadas/postulante/VISTA_14_PerilPostulante.html'));
app.get('/postulante/empleos',          vista('Privadas/postulante/VISTA_15_Empleos_Postulante.html'));
app.get('/postulante/empleo/detalle',   vista('Privadas/postulante/VISTA_16_DetallesEmpleo_Postulante.html'));
app.get('/postulante/aplicaciones',     vista('Privadas/postulante/VISTA_17_MisAplicaciones.html'));
app.get('/postulante/recursos',         vista('Privadas/postulante/VISTA_18_Recursos_Postulante.html'));
app.get('/postulante/recurso/detalle',  vista('Privadas/postulante/VISTA_19_DetallesRecurso_Postulante.html'));
app.get('/postulante/foro',             vista('Privadas/postulante/VISTA_20_Foro_Postulante.html'));
app.get('/postulante/foro/detalle',     vista('Privadas/postulante/VISTA_21_DetallesForo_Postulante.html'));

// ── EMPRESA ───────────────────────────────────────────────────────────────────
app.get('/empresa/inicio',              vista('Privadas/empresa/VISTA_22_InicioEmpresa.html'));
app.get('/empresa/ofertas',             vista('Privadas/empresa/VISTA_23_OfertasEmpresa.html'));
app.get('/empresa/oferta/detalle',      vista('Privadas/empresa/VISTA_24_DetallesOfertaEmpresa.html'));
app.get('/empresa/oferta/aplicaciones', vista('Privadas/empresa/VISTA_25_AplicacionesOfertaEmpresa.html'));
app.get('/empresa/aplicaciones',        vista('Privadas/empresa/VISTA_26_AplicacionesEmpresa.html'));
app.get('/empresa/publicar',            vista('Privadas/empresa/VISTA_27_PublicarOfertaEmpresa.html'));
app.get('/empresa/postulante',          vista('Privadas/empresa/VISTA_28_PerilPostulanteEmpresa.html'));
app.get('/empresa/mi-perfil',           vista('Privadas/empresa/VISTA_29_PerfilEmpresa.html'));

// ── ADMIN ─────────────────────────────────────────────────────────────────────
app.get('/admin/inicio',                vista('Privadas/Admin/VISTA_30_InicioAdmin.html'));
app.get('/admin/usuarios',              vista('Privadas/Admin/VISTA_31_UsuariosAdmin.html'));
app.get('/admin/usuario/perfil',        vista('Privadas/Admin/VISTA_32_PerilUsuarioAdmin.html'));
app.get('/admin/empleos',               vista('Privadas/Admin/VISTA_33_EmpleosAdmin.html'));
app.get('/admin/empleo/detalle',        vista('Privadas/Admin/VISTA_34_DetallesEmpleoAdmin.html'));
app.get('/admin/foro',                  vista('Privadas/Admin/VISTA_35_ForoAdmin.html'));
app.get('/admin/foro/detalle',          vista('Privadas/Admin/VISTA_36_DetallesForoAdmin.html'));
app.get('/admin/recursos',              vista('Privadas/Admin/VISTA_37_Recursos.html'));
app.get('/admin/recurso/detalle',       vista('Privadas/Admin/VISTA_38_DetallesRecurso.html'));

// ── API ───────────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/empleos',       empleoRoutes);
app.use('/api/perfil',        perfilRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/foro',          foroRoutes);
app.use('/api/recursos',      recursoRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀  PORTAL EMPLEOS SV  →  http://localhost:${PORT}`);
    console.log('==============================================');
});
