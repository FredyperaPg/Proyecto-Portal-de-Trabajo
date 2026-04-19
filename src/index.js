import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import empleoRoutes from './routes/empleoRoutes.js';
import foroRoutes from './routes/foroRoutes.js';
import recursoRoutes from './routes/recursoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_universidad_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.get('/', (req, res) => {
    res.json({ mensaje: 'API de PortalTrabajos funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/empleos', empleoRoutes);
app.use('/api/foro', foroRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/usuarios', usuarioRoutes);


app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
    console.log(`📡 Esperando peticiones de: ${process.env.FRONTEND_URL || 'http://127.0.0.1:5500'}`);
    console.log('==============================================');
});