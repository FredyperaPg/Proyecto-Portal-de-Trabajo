// Middleware centralizado de manejo de errores
// Captura errores lanzados con next(err) y responde con formato uniforme

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error(`[Error] ${req.method} ${req.url}:`, err.message);

    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Ocurrió un error inesperado en el servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};