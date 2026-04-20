import { Router } from 'express';
import * as AuthController from '../controllers/authController.js';
import {
    runValidations,
    registerPostulanteValidators,
    registerEmpleadorValidators,
    loginValidators
} from '../middlewares/validators.js';

const router = Router();

// --- RUTAS DE REGISTRO ---
// Estas rutas reciben los datos de los formularios de registro
router.post('/register-postulante', 
    runValidations(registerPostulanteValidators), 
    AuthController.registerPostulante
);

router.post('/register-empleador', 
    runValidations(registerEmpleadorValidators), 
    AuthController.registerEmpleador
);

// --- RUTA DE LOGIN ---
// Esta es la que llamaremos desde assets/js/login.js
router.post('/login', 
    runValidations(loginValidators), 
    AuthController.login
);

// --- GESTIÓN DE SESIÓN ---
// 'check' sirve para que el Frontend verifique si la sesión sigue activa al recargar la página
router.get('/check', AuthController.checkSession);

// 'logout' destruye la sesión en el servidor
router.post('/logout', AuthController.logout);

export default router;