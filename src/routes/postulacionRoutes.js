import { Router } from 'express';
import * as PostulacionController from '../controllers/postulacionController.jsontroller.js';
import { isAuth, isEmpresa, isCandidato } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/mis-aplicaciones', isAuth, isCandidato, PostulacionController.getMisPostulaciones);

router.get('/empleo/:idEmpleo', isAuth, isEmpresa, PostulacionController.getPostulantes);

router.put('/:idPostulacion', isAuth, isEmpresa, PostulacionController.updateEstado);

export default router;