import { Router } from 'express';
import * as EmpleoController from '../controllers/empleoController.js';

const router = Router();

// GET  /api/empleos                        → todos los empleos activos (público)
router.get('/', EmpleoController.getEmpleos);

// GET  /api/empleos/empresa/:idEmpresa     → vacantes de una empresa (VISTA_22/23)
router.get('/empresa/:idEmpresa', EmpleoController.getEmpleosDeEmpresa);

// GET  /api/empleos/:id                    → detalle de un empleo (VISTA_16)
router.get('/:id', EmpleoController.getEmpleo);

// POST /api/empleos                        → publicar empleo (empresa - VISTA_27)
router.post('/', EmpleoController.crearEmpleo);

// PATCH /api/empleos/:id                   → actualizar estado (abrir/cerrar)
router.patch('/:id/estado', EmpleoController.updateEstadoEmpleo);

export default router;
