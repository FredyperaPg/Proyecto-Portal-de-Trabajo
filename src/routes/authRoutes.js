import { Router } from 'express';
import * as AuthController from '../controllers/authController.js';
import {
    runValidations,
    registerPostulanteValidators,
    registerEmpleadorValidators,
    loginValidators
} from '../middlewares/validators.js';

const router = Router();

router.post('/register-postulante', runValidations(registerPostulanteValidators), AuthController.registerPostulante);

router.post('/register-empleador', runValidations(registerEmpleadorValidators), AuthController.registerEmpleador);

router.post('/login', runValidations(loginValidators), AuthController.login);

router.get('/check', AuthController.checkSession);
router.post('/logout', AuthController.logout);

export default router;