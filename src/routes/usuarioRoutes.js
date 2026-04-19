import { Router } from 'express';
import * as UsuarioController from '../controllers/usuarioController.js';
import { isAuth, isEmpresa, isCandidato, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/all', isAuth, isAdmin, UsuarioController.listarUsuarios);

router.get('/:id', isAuth, isAdmin, UsuarioController.getUsuarioById);

router.put('/candidato', isAuth, isCandidato, UsuarioController.updateCandidato);

router.put('/empresa', isAuth, isEmpresa, UsuarioController.updateEmpresa);

export default router;