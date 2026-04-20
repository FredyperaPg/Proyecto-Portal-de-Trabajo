import { Router } from 'express';
import * as PerfilController from '../controllers/perfilController.js';

const router = Router();

// ── POSTULANTE ────────────────────────────────────────────────────────────────
router.get('/postulante/:idUsuario',  PerfilController.getPerfilPostulante);
router.put('/postulante/:idUsuario',  PerfilController.updatePerfilPostulante);

// ── EMPRESA ───────────────────────────────────────────────────────────────────
router.get('/empresa/:idUsuario',     PerfilController.getPerfilEmpresa);
router.put('/empresa/:idUsuario',     PerfilController.updatePerfilEmpresa);

// ── ADMIN STATS ───────────────────────────────────────────────────────────────
// IMPORTANT: /admin/stats and /admin/usuarios must come BEFORE /admin/:id
router.get('/admin/stats',            PerfilController.getAdminStats);
router.get('/admin/usuarios',         PerfilController.getUsuarios);
router.get('/admin/usuario/:id',      PerfilController.getUsuarioPorId);
router.patch('/admin/usuario/:id',    PerfilController.updateEstadoUsuario);

export default router;
