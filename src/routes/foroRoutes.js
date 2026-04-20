import { Router } from 'express';
import * as ForoController from '../controllers/foroController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', ForoController.listarForo);

router.post('/', isAuth, ForoController.publicar);

router.post('/comentario', isAuth, ForoController.agregarComentario);

router.get('/:id/comentarios', ForoController.listarComentarios);

router.put('/:id', isAuth, ForoController.modificarPost);

router.delete('/:id', isAuth, ForoController.borrarPost);

router.delete('/comentario/:id', isAuth, ForoController.borrarComentario);

export default router;