import { Router } from 'express';

const router = Router();

// Ruta de prueba para verificar que el módulo carga
router.get('/test', (req, res) => {
    res.json({ message: 'Ruta funcionando' });
});

export default router;// Rutas: postulacionRoutes
// Define los endpoints y conecta middlewares con el controlador
