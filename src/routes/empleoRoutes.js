import { Router } from 'express';
import * as EmpleoController from '../controllers/empleoController.js';
import { runValidations, registerEmpleoValidators, createPostulacionValidators } from '../middlewares/validators.js';
import { isAuth } from '../middlewares/authMiddleware.js'; // El que creamos antes

const router = Router();

router.get('/', EmpleoController.listarEmpleos);

router.post('/', isAuth, runValidations(registerEmpleoValidators), EmpleoController.publicarEmpleo);

router.get('/:id', EmpleoController.obtenerDetalle);

router.post('/postularse', isAuth, runValidations(createPostulacionValidators), EmpleoController.aplicarAEmpleo);

router.put('/:id', isAuth, EmpleoController.modificarEmpleo);

router.delete('/:id', isAuth, EmpleoController.borrarEmpleo);

export default router;