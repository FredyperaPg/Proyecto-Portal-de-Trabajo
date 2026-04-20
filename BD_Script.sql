

CREATE DATABASE IF NOT EXISTS portal_trabajos;

USE portal_trabajos;

CREATE TABLE Roles (
    id BINARY(16) PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    id BINARY(16) PRIMARY KEY,
    idRol BINARY(16) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    rol VARCHAR(20) NOT NULL, 
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol) REFERENCES Roles(id)
);

CREATE TABLE Perfil_Administrador (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    dui VARCHAR(20) NOT NULL UNIQUE,
    fechaNacimiento DATE,
    direccion VARCHAR(255),
    estado VARCHAR(20) NOT NULL,
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Perfil_Empresa (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    nombreComercial VARCHAR(150) NOT NULL,
    razonSocial VARCHAR(150) NOT NULL,
    nit VARCHAR(20) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correoContacto VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    tipoEmpresa VARCHAR(100) NOT NULL,
    descripcion TEXT,
    urlLogo VARCHAR(255),
    urlBanner VARCHAR(255),
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Perfil_Candidato (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    dui VARCHAR(20) NOT NULL UNIQUE,
    fechaNacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    titulo VARCHAR(150),
    profesion VARCHAR(150),
    añosExperiencia INT,
    urlFoto VARCHAR(255),
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidato_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

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
    estado VARCHAR(20) NOT NULL,
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaVencimiento DATE, 
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empleo_empresa FOREIGN KEY (idEmpresa) REFERENCES Perfil_Empresa(id)
);

CREATE TABLE Postulacion (
    id BINARY(16) PRIMARY KEY,
    idCandidato BINARY(16) NOT NULL,
    idEmpleo BINARY(16) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fechaPostulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_postulacion_candidato FOREIGN KEY (idCandidato) REFERENCES Perfil_Candidato(id),
    CONSTRAINT fk_postulacion_empleo FOREIGN KEY (idEmpleo) REFERENCES Empleo(id)
);

CREATE TABLE Recurso (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    urlBanner VARCHAR(255),
    urlVideo VARCHAR(255),
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recurso_autor FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Publicacion_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    catidadLikes INT DEFAULT 0,
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);

CREATE TABLE Comentario_Foro (
    id BINARY(16) PRIMARY KEY,
    idUsuario BINARY(16) NOT NULL,
    idPublicacion BINARY(16) NOT NULL,
    contenido TEXT NOT NULL,
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizadoEl DATETIME,
    creadoEl DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    CONSTRAINT fk_comentario_publicacion FOREIGN KEY (idPublicacion) REFERENCES Publicacion_Foro(id)
);