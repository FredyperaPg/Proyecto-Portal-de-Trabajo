
CREATE DATABASE portal_trabajos;
USE portal_trabajos;

-- 2. Tabla de Roles (Indispensable para el registro)
CREATE TABLE Roles (
    id BINARY(16) PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL
);

-- 3. Tabla de Usuario (El corazón del sistema)
CREATE TABLE Usuario (
    id BINARY(16) PRIMARY KEY,
    idRol BINARY(16) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    rol VARCHAR(20) NOT NULL, -- 'admin', 'empleador', 'postulante'
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol) REFERENCES Roles(id)
);

-- 4. Perfil Empresa
CREATE TABLE Perfil_Empresa (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    nombreComercial VARCHAR(150) NOT NULL,
    razonSocial VARCHAR(150) NOT NULL,
    nit VARCHAR(20) NOT NULL UNIQUE,
    ubicacion VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correoContacto VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    tipoEmpresa VARCHAR(100) NOT NULL,
    descripcion TEXT,
    urlLogo VARCHAR(255),
    urlBanner VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- 5. Perfil Candidato (Postulante)
CREATE TABLE Perfil_Candidato (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    dui VARCHAR(20) NOT NULL UNIQUE,
    fechaNacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    titulo VARCHAR(150),
    profesion VARCHAR(150),
    anosExperiencia INT DEFAULT 0,
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidato_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- 6. Tabla de Empleos
CREATE TABLE Empleo (
    id BINARY(16) PRIMARY KEY,
    idEmpresa BINARY(16) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    funciones TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    modalidad VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    salarioMin DECIMAL(10,2),
    salarioMax DECIMAL(10,2),
    vacantes INT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'abierta',
    fechaVencimiento DATE, 
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empleo_empresa FOREIGN KEY (idEmpresa) REFERENCES Perfil_Empresa(id) ON DELETE CASCADE
);

-- 7. Tabla de Postulaciones
CREATE TABLE Postulacion (
    id BINARY(16) PRIMARY KEY,
    idCandidato BINARY(16) NOT NULL,
    idEmpleo BINARY(16) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_postulacion_candidato FOREIGN KEY (idCandidato) REFERENCES Perfil_Candidato(id),
    CONSTRAINT fk_postulacion_empleo FOREIGN KEY (idEmpleo) REFERENCES Empleo(id)
);

-- 8. INSERCIÓN DE SEMILLAS (Roles necesarios para que el registro funcione)
INSERT INTO Roles (id, nombreRol) VALUES
    (UUID_TO_BIN(UUID()), 'admin'),
    (UUID_TO_BIN(UUID()), 'empleador'),
    (UUID_TO_BIN(UUID()), 'postulante');

-- 9. VERIFICACIÓN FINAL
SELECT BIN_TO_UUID(id) AS id_rol_uuid, nombreRol FROM Roles;

-- 8. Tabla de Recursos (Blog/Artículos)
CREATE TABLE Recurso (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'Articulo', 'Video', 'Guia'
    estado VARCHAR(20) NOT NULL DEFAULT 'publicado',
    urlBanner VARCHAR(255),
    urlVideo VARCHAR(255),
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recurso_autor FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- 9. Tabla de Publicaciones del Foro
CREATE TABLE Publicacion_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    cantidadLikes INT DEFAULT 0, -- Corregido 'catidad' a 'cantidad'
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- 10. Tabla de Comentarios del Foro
CREATE TABLE Comentario_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    idPublicacion BINARY(16) NOT NULL,
    contenido TEXT NOT NULL,
    actualizadoEl DATETIME ON UPDATE CURRENT_TIMESTAMP,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_publicacion FOREIGN KEY (idPublicacion) REFERENCES Publicacion_Foro(id) ON DELETE CASCADE
);