import { Router } from 'express';
import * as RecursoController from '../controllers/recursoController.js';

const router = Router();

router.get('/',      RecursoController.getRecursos);
router.get('/:id',   RecursoController.getRecurso);
router.post('/',     RecursoController.crearRecurso);

export default router;
