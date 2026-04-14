import { body, validationResult } from 'express-validator';

// Manejador de validaciones
export const runValidations = (validations) => {
    return async (req, res, next) => {
        for (const validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    };
};

// 1. Login
export const loginValidators = [
    body('correo')
        .trim()
        .isEmail().withMessage('El correo debe ser una dirección válida')
        .notEmpty().withMessage('El correo es obligatorio'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 5 }).withMessage("La contraseña debe tener al menos 5 caracteres")
];

// 2. Registro de Postulante
export const registerPostulanteValidators = [
    body('nombre')
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

    body('apellido')
        .trim()
        .notEmpty().withMessage("El apellido es obligatorio")
        .isLength({ min: 3 }).withMessage("El apellido debe tener al menos 3 caracteres"),

    body('correo')
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido'),

    body('password')
        .isLength({ min: 5 }).withMessage("La contraseña debe tener al menos 5 caracteres"),

    body('dui')
        .trim()
        .notEmpty().withMessage("El DUI es obligatorio")
        .matches(/^\d{8}-\d{1}$/).withMessage("El DUI debe tener el formato 00000000-0"),

    body('fechaNacimiento')
        .isDate().withMessage("La fecha de nacimiento es obligatoria y debe ser una fecha válida"),

    body('direccion')
        .trim()
        .notEmpty().withMessage("La dirección es obligatoria")
        .isLength({ min: 10 }).withMessage("La dirección debe tener al menos 10 caracteres"),

    body('telefono')
        .trim()
        .notEmpty().withMessage("El teléfono es obligatorio")
        .matches(/^[267]\d{3}-?\d{4}$/).withMessage("Formato de teléfono inválido (Ej: 7777-7777)")
];

// 3. Registro de Empleador
export const registerEmpleadorValidators = [
    body(['nombre', 'apellido', 'sector', 'tipoEmpresa'])
        .trim()
        .notEmpty().withMessage("Este campo es obligatorio")
        .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres"),

    body('correo').trim().isEmail().withMessage('Correo de contacto inválido'),
    body('correoEmpresa').trim().isEmail().withMessage('Correo de la empresa inválido'),

    body('password').isLength({ min: 5 }).withMessage("Contraseña de al menos 5 caracteres"),

    body('nombreEmpresa').trim().notEmpty().withMessage("El nombre de la empresa es obligatorio"),

    body('nit')
        .trim()
        .notEmpty().withMessage("El NIT es obligatorio")
        .matches(/^\d{4}-\d{6}-\d{3}-\d{1}$/).withMessage("Formato de NIT inválido (0000-000000-000-0)"),

    body('telefono')
        .trim()
        .notEmpty().withMessage("El teléfono es obligatorio")
];

// 4. Registro de Empleo (Vacante)
export const registerEmpleoValidators = [
    body(['titulo', 'descripcion', 'requisitos', 'funciones', 'categoria', 'modalidad', 'ubicacion'])
        .trim()
        .notEmpty().withMessage("Este campo es obligatorio"),

    body('salarioMinimo')
        .isNumeric().withMessage("Debe ser un valor numérico"),

    body('salarioMaximo')
        .isNumeric().withMessage("Debe ser un valor numérico")
        .custom((value, { req }) => {
            if (parseFloat(value) < parseFloat(req.body.salarioMinimo)) {
                throw new Error('El salario máximo no puede ser menor al mínimo');
            }
            return true;
        }),

    body('vacantes')
        .isInt({ min: 1 }).withMessage("Debe haber al menos 1 vacante"),

    body(['fechaPublicacion', 'fechaVencimiento']).isDate().withMessage("Fecha inválida")
];

// 5. Postulaciones
export const createPostulacionValidators = [
    body(['idEmpleo', 'idPostulante']).notEmpty().withMessage("ID obligatorio")
];

// 6. Recursos Educativos
export const createRecursoValidators = [
    body(['titulo', 'contenido', 'tipo']).trim().notEmpty().withMessage("Campo obligatorio"),
    body('idUsuario').notEmpty().withMessage("ID de usuario obligatorio")
];

// 7. Foro
export const createForoValidators = [
    body(['titulo', 'contenido']).trim().notEmpty().withMessage("Campo obligatorio"),
    body('idUsuario').notEmpty().withMessage("ID de usuario obligatorio")
];

// 8. Comentarios en Foro
export const createComentarioValidators = [
    body('idForo').notEmpty().withMessage("El ID del foro es obligatorio"),
    body('contenido').trim().notEmpty().withMessage("El comentario no puede estar vacío"),
    body('idUsuario').notEmpty().withMessage("El ID del usuario es obligatorio")
];