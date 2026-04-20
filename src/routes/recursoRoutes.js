import { Router } from 'express';
import * as RecursoController from '../controllers/recursoController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', RecursoController.listar);

router.get('/:id', RecursoController.obtenerPorId);

router.post('/', isAuth, isAdmin, RecursoController.publicar);

router.put('/:id', isAuth, isAdmin, RecursoController.modificar);

router.delete('/:id', isAuth, isAdmin, RecursoController.eliminar);

export default router;