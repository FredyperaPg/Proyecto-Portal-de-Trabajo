import { Router } from 'express';
import * as ForoController from '../controllers/foroController.js';

const router = Router();

router.get('/',                   ForoController.getPublicaciones);
router.get('/:id',                ForoController.getPublicacion);
router.get('/:id/comentarios',    ForoController.getComentarios);
router.post('/',                  ForoController.crearPublicacion);
router.post('/:id/comentarios',   ForoController.crearComentario);
router.post('/:id/like',          ForoController.darLike);

export default router;
