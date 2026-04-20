import { Router } from 'express';
import * as PostulacionController from '../controllers/postulacionController.js';

const router = Router();

// GET /api/postulaciones/mis-aplicaciones?idUsuario=xxx  → por idUsuario
router.get('/mis-aplicaciones', PostulacionController.getMisAplicacionesPorUsuario);

// POST /api/postulaciones  → postulante aplica a empleo
router.post('/', PostulacionController.crearPostulacion);

// GET /api/postulaciones/candidato/:idCandidato  → Mis Aplicaciones
router.get('/candidato/:idCandidato', PostulacionController.getMisPostulaciones);

// GET /api/postulaciones/empresa/:idEmpresa  → postulaciones recibidas
router.get('/empresa/:idEmpresa', PostulacionController.getPostulacionesPorEmpresa);

// PATCH /api/postulaciones/:id  → empresa cambia estado
router.patch('/:id', PostulacionController.updateEstadoPostulacion);

export default router;
