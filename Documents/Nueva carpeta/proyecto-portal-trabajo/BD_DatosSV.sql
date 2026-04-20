-- ============================================================
-- PORTAL DE EMPLEOS — DATOS REALES EL SALVADOR
-- v2: UUIDs corregidos (solo caracteres hex válidos 0-9, A-F)
-- Error 1411 resuelto: NO se usan letras fuera del rango hex
-- ============================================================

USE portal_trabajos;

-- ============================================================
-- VARIABLES DE ROL (deben existir del BD_Script.sql)
-- ============================================================
SET @rol_admin      = (SELECT id FROM Roles WHERE nombreRol = 'admin'      LIMIT 1);
SET @rol_empleador  = (SELECT id FROM Roles WHERE nombreRol = 'empleador'  LIMIT 1);
SET @rol_postulante = (SELECT id FROM Roles WHERE nombreRol = 'postulante' LIMIT 1);

-- ============================================================
-- 0. USUARIO ADMINISTRADOR (fredyperazag28@gmail.com / 12345678)
-- NOTA: El hash de bcrypt se genera al ejecutar seed-admin.js
--       Este INSERT usa un hash PRE-GENERADO con bcrypt cost=10
--       para la contraseña "12345678".
--       Si falla la autenticación, ejecuta: node seed-admin.js
-- ============================================================
INSERT IGNORE INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, estado, rol) VALUES
(UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'), @rol_admin,
 'Fredy', 'Peraza',
 'fredyperazag28@gmail.com',
 '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi',
 'activo', 'admin');
-- ⚠️  IMPORTANTE: Ejecuta "node seed-admin.js" para actualizar
--    el hash con la contraseña correcta "12345678"

-- ============================================================
-- 1. USUARIOS EMPLEADORES
-- ============================================================
INSERT IGNORE INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, estado, rol) VALUES
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000001'), @rol_empleador, 'María',    'González',   'rrhh@bancoagricola.com.sv', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000002'), @rol_empleador, 'Roberto',  'Martínez',   'rrhh@tigo.com.sv',          '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000003'), @rol_empleador, 'Ana',      'Hernández',  'rrhh@applaudo.com',         '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000004'), @rol_empleador, 'Luis',     'Pérez',      'rrhh@superselectos.com.sv', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000005'), @rol_empleador, 'Sofía',    'Ramírez',    'rrhh@telus.com',            '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000006'), @rol_empleador, 'Jorge',    'Castillo',   'rrhh@claro.com.sv',         '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000007'), @rol_empleador, 'Daniela',  'Flores',     'rrhh@bac.com.sv',           '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000008'), @rol_empleador, 'Miguel',   'Torres',     'rrhh@grupoadoc.com',        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-000000000009'), @rol_empleador, 'Patricia', 'Vásquez',    'rrhh@almaviva.com',         '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador'),
(UUID_TO_BIN('B0000000-0000-4000-A000-00000000000A'), @rol_empleador, 'Héctor',   'Ortiz',      'rrhh@siman.com.sv',         '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'empleador');

-- ============================================================
-- 2. USUARIOS POSTULANTES
-- ============================================================
INSERT IGNORE INTO Usuario (id, idRol, nombres, apellidos, email, passwordHash, estado, rol) VALUES
(UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'), @rol_postulante, 'Kevin',   'Mejía',     'kevin.mejia@gmail.com',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'postulante'),
(UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'), @rol_postulante, 'Valeria', 'Cisneros',  'valeria.cisn@gmail.com',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'postulante'),
(UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'), @rol_postulante, 'Ernesto', 'Guardado',  'ernesto.guardado@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'postulante'),
(UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'), @rol_postulante, 'Rebeca',  'Molina',    'rebeca.molina@outlook.com',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'postulante'),
(UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'), @rol_postulante, 'Diego',   'Chávez',    'diego.chavez@gmail.com',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdEeBZiKNi', 'activo', 'postulante');

-- ============================================================
-- 3. PERFILES DE EMPRESA (20 empresas reales de El Salvador)
--    UUIDs: E1 a EA + EB a F4 — solo caracteres 0-9 y A-F
-- ============================================================
INSERT IGNORE INTO Perfil_Empresa (id, idUsuario, nombreComercial, razonSocial, nit, ubicacion, telefono, correoContacto, sector, tipoEmpresa, descripcion) VALUES
(UUID_TO_BIN('D0000000-0000-4000-A000-000000000001'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000001'),
 'Banco Agrícola','Banco Agrícola S.A.','0614-010195-103-8','San Salvador','2210-0000','rrhh@bancoagricola.com.sv','Finanzas y Banca','Gran Empresa',
 'Uno de los bancos más grandes de El Salvador con más de 100 años de historia brindando servicios financieros de calidad.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000002'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000002'),
 'Tigo El Salvador','Millicom Cable El Salvador S.A.','0614-030212-101-5','San Salvador','2132-0000','rrhh@tigo.com.sv','Telecomunicaciones','Gran Empresa',
 'Empresa líder en telecomunicaciones en El Salvador ofreciendo servicios de telefonía móvil, internet y televisión.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000003'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000003'),
 'Applaudo Studios','Applaudo Studios S.A. de C.V.','0614-090815-104-2','San Salvador','2505-6000','rrhh@applaudo.com','Tecnología','Mediana Empresa',
 'Empresa tecnológica salvadoreña de clase mundial especializada en desarrollo de software y aplicaciones móviles para clientes globales.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000004'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000004'),
 'Super Selectos','Súper Selectos S.A. de C.V.','0614-010195-201-1','San Salvador','2560-0000','rrhh@superselectos.com.sv','Retail y Comercio','Gran Empresa',
 'La cadena de supermercados más grande de El Salvador con más de 100 sucursales a nivel nacional.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000005'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000005'),
 'Telus International','Telus International El Salvador','0614-120215-105-0','San Salvador','2134-5000','rrhh@telus.com','BPO / Servicios','Gran Empresa',
 'Empresa global de BPO con sede en El Salvador especializada en servicio al cliente y soporte técnico bilingüe.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000006'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000006'),
 'Claro El Salvador','América Móvil El Salvador S.A. de C.V.','0614-050207-102-3','San Salvador','2513-0000','rrhh@claro.com.sv','Telecomunicaciones','Gran Empresa',
 'Operadora de telecomunicaciones con presencia en todo El Salvador parte del grupo América Móvil.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000007'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000007'),
 'BAC Credomatic','BAC El Salvador S.A.','0614-070198-106-7','San Salvador','2216-0000','rrhh@bac.com.sv','Finanzas y Banca','Gran Empresa',
 'Institución financiera con amplia red de sucursales en El Salvador parte del grupo BAC Credomatic.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000008'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000008'),
 'Grupo ADOC','Calzado ADOC S.A. de C.V.','0614-010170-108-4','Santa Ana','2441-0000','rrhh@grupoadoc.com','Manufactura','Gran Empresa',
 'Empresa salvadoreña líder en fabricación y venta de calzado con marcas reconocidas a nivel centroamericano.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000009'), UUID_TO_BIN('B0000000-0000-4000-A000-000000000009'),
 'Almaviva El Salvador','Almaviva do Brasil El Salvador S.A.','0614-150317-109-9','San Salvador','2560-4000','rrhh@almaviva.com','BPO / Servicios','Gran Empresa',
 'Centro de contact center y BPO con más de 3,000 empleados atendiendo clientes en español e inglés.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000A'), UUID_TO_BIN('B0000000-0000-4000-A000-00000000000A'),
 'SIMAN','Simán S.A. de C.V.','0614-010150-110-6','San Salvador','2211-0000','rrhh@siman.com.sv','Retail y Comercio','Gran Empresa',
 'Tienda por departamentos con más de 70 años en El Salvador ofreciendo moda, tecnología y artículos para el hogar.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000B'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Davivienda El Salvador','Banco Davivienda Salvadoreño S.A.','0614-020305-111-2','San Salvador','2246-0000','rrhh@davivienda.com.sv','Finanzas y Banca','Gran Empresa',
 'Banco colombiano con fuerte presencia en El Salvador brindando servicios de banca personal y empresarial.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000C'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Grupo Roble','Grupo Roble S.A. de C.V.','0614-010190-112-8','San Salvador','2560-9000','rrhh@gruporoble.com.sv','Bienes Raíces','Gran Empresa',
 'Desarrolladora inmobiliaria salvadoreña con proyectos residenciales y comerciales en toda Centroamérica.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000D'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'AES El Salvador','AES El Salvador S.A. de C.V.','0614-040297-113-5','Santa Ana','2229-0000','rrhh@aes.com.sv','Energía','Gran Empresa',
 'Empresa distribuidora de energía eléctrica que abastece a más de 1 millón de clientes en El Salvador.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000E'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Industrias La Constancia','Industrias La Constancia S.A. de C.V.','0614-010135-114-1','San Miguel','2661-0000','rrhh@ilc.com.sv','Manufactura / Bebidas','Gran Empresa',
 'Empresa salvadoreña productora de cerveza y bebidas carbonatadas parte del grupo AB InBev.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-00000000000F'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Corporación Dinant','Dinant El Salvador S.A.','0614-080309-115-7','San Salvador','2247-5000','rrhh@dinant.com','Manufactura / Alimentos','Gran Empresa',
 'Corporación líder en alimentos con productos distribuidos en toda Centroamérica.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000010'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'CCA El Salvador','Centro de Contact de América S.A.','0614-120419-116-3','San Salvador','2250-8000','rrhh@cca.sv','BPO / Call Center','Mediana Empresa',
 'Centro de llamadas bilingüe brindando soporte a empresas internacionales desde El Salvador.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000011'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Econocom El Salvador','Econocom Technologies S.A.','0614-050518-117-9','San Salvador','2209-7000','rrhh@econocom.sv','Tecnología','Mediana Empresa',
 'Empresa especializada en soluciones IT, outsourcing tecnológico y transformación digital.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000012'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Hospital de Diagnóstico','Servicios Médicos Santa Ana S.A.','0614-030280-118-6','Santa Ana','2440-6000','rrhh@hdd.com.sv','Salud','Gran Empresa',
 'Red hospitalaria privada reconocida por sus servicios de diagnóstico y especialidades médicas.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000013'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Universidad Don Bosco','Universidad Don Bosco','0614-010189-119-4','Soyapango','2251-5200','rrhh@udb.edu.sv','Educación','Gran Empresa',
 'Universidad privada salesiana con más de 30 años formando profesionales en ingeniería, tecnología y negocios.'),

(UUID_TO_BIN('D0000000-0000-4000-A000-000000000014'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Walmart El Salvador','Walmart de México y Centroamérica','0614-060200-120-0','San Salvador','2212-0000','rrhh@walmart.com.sv','Retail y Comercio','Gran Empresa',
 'La mayor cadena minorista del mundo con sucursales en todas las ciudades principales de El Salvador.');

-- ============================================================
-- 4. PERFILES DE CANDIDATOS
-- ============================================================
INSERT IGNORE INTO Perfil_Candidato (id, idUsuario, dui, fechaNacimiento, direccion, titulo, profesion, anosExperiencia) VALUES
(UUID_TO_BIN('E0000000-0000-4000-A000-000000000001'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'),
 '01234567-8','1998-03-15','Col. Escalón, San Salvador','Ingeniero en Sistemas','Desarrollador Full Stack',3),
(UUID_TO_BIN('E0000000-0000-4000-A000-000000000002'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'),
 '02345678-9','1997-07-22','Santa Ana Centro','Licenciada en Marketing','Especialista en Marketing Digital',4),
(UUID_TO_BIN('E0000000-0000-4000-A000-000000000003'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'),
 '03456789-0','1995-11-10','Soyapango, San Salvador','Licenciado en Contaduría','Contador Público',6),
(UUID_TO_BIN('E0000000-0000-4000-A000-000000000004'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'),
 '04567890-1','2000-01-05','San Miguel Centro','Estudiante de Medicina','Asistente de Salud',1),
(UUID_TO_BIN('E0000000-0000-4000-A000-000000000005'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'),
 '05678901-2','1993-09-30','Antiguo Cuscatlán','Ingeniero Industrial','Analista de Operaciones',8);

-- ============================================================
-- 5. EMPLEOS (20 ofertas — UUIDs con solo 0-9 y A-F)
-- ============================================================
INSERT IGNORE INTO Empleo (id, idEmpresa, titulo, descripcion, requisitos, funciones, categoria, modalidad, ubicacion, salarioMin, salarioMax, vacantes, estado, fechaVencimiento) VALUES

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000001'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000001'),
 'Ejecutivo de Crédito',
 'Banco Agrícola busca ejecutivos apasionados por las finanzas para atender a clientes en sucursales de San Salvador.',
 'Licenciatura en Administración o afín. Mínimo 2 años en banca. Manejo de Office.',
 'Atención al cliente, análisis de crédito, gestión de cartera, cumplimiento de metas.',
 'Finanzas','Presencial','San Salvador',700.00,950.00,3,'abierta','2026-06-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000002'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000002'),
 'Técnico de Soporte de Red',
 'Tigo El Salvador requiere técnicos para mantenimiento de infraestructura de red en la región central.',
 'Carrera técnica en telecomunicaciones. Conocimientos en fibra óptica. Disponibilidad de horario.',
 'Instalación y mantenimiento de redes, diagnóstico de fallas, atención a clientes empresariales.',
 'Tecnología','Presencial','San Salvador',550.00,750.00,5,'abierta','2026-07-15'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000003'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000003'),
 'Desarrollador React Senior',
 'Applaudo Studios busca React Senior para proyectos de clase mundial con clientes en Estados Unidos.',
 'Mínimo 4 años con React.js. TypeScript, Redux, GraphQL. Inglés avanzado B2+.',
 'Desarrollo frontend, code reviews, mentoría a juniors, comunicación con clientes.',
 'Tecnología','Remoto','San Salvador',2000.00,3500.00,2,'abierta','2026-06-15'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000004'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000004'),
 'Supervisor de Tienda',
 'Super Selectos busca supervisor para sucursal de Santa Ana con enfoque en atención al cliente.',
 'Bachillerato o estudios en Administración. Experiencia mínima de 2 años en retail. Liderazgo.',
 'Supervisión de personal, control de inventario, gestión de caja, cumplimiento de metas.',
 'Retail / Ventas','Presencial','Santa Ana',450.00,600.00,2,'abierta','2026-05-31'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000005'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000005'),
 'Agente Bilingüe de Atención al Cliente',
 'Telus International busca agentes con inglés fluido para soporte a clientes canadienses.',
 'Inglés avanzado C1. Bachillerato completo. Disponibilidad de turno mixto.',
 'Atención de llamadas en inglés, resolución de problemas, documentación de casos.',
 'Atención al Cliente','Presencial','San Salvador',600.00,900.00,20,'abierta','2026-07-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000006'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000006'),
 'Asesor Comercial Empresarial',
 'Claro El Salvador busca asesores para clientes corporativos en Santa Ana y Sonsonate.',
 'Licenciatura en Administración o Mercadeo. Vehículo propio. Experiencia en ventas B2B.',
 'Visita a clientes, negociación de contratos, activación de servicios, seguimiento post-venta.',
 'Ventas','Presencial','Santa Ana',500.00,1200.00,4,'abierta','2026-06-20'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000007'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000007'),
 'Analista de Riesgo Crediticio',
 'BAC Credomatic requiere analista para evaluar créditos corporativos en San Salvador.',
 'Licenciatura en Finanzas o Contaduría. Mínimo 3 años en banca. Conocimientos de Basel III.',
 'Análisis de estados financieros, evaluación de riesgo, informes para comité de crédito.',
 'Finanzas','Presencial','San Salvador',900.00,1400.00,2,'abierta','2026-06-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000008'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000008'),
 'Operario de Producción de Calzado',
 'Grupo ADOC contrata operarios para línea de producción en planta de Santa Ana.',
 'Bachillerato técnico. Turno rotativo. Atención al detalle.',
 'Operación de maquinaria, control de calidad, cumplimiento de metas de producción.',
 'Manufactura','Presencial','Santa Ana',365.00,450.00,10,'abierta','2026-05-20'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000009'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000009'),
 'Supervisor de Call Center',
 'Almaviva busca supervisor para equipo de 20 agentes en campaña de telecomunicaciones en inglés.',
 'Mínimo 2 años como supervisor en call center. Inglés avanzado. Métricas AHT, FCR.',
 'Monitoreo de agentes, coaching, análisis de métricas, reportes a cliente.',
 'Atención al Cliente','Presencial','San Salvador',800.00,1100.00,2,'abierta','2026-07-01'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000A'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000A'),
 'Vendedor de Piso (Tecnología)',
 'SIMAN busca vendedor para departamento de tecnología en Metrocentro San Salvador.',
 'Bachillerato. Conocimientos básicos de electrónica. Disponibilidad de fin de semana.',
 'Asesoría a clientes, exhibición de productos, cierre de ventas, inventario de sección.',
 'Ventas','Presencial','San Salvador',365.00,550.00,3,'abierta','2026-05-25'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000B'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000B'),
 'Oficial de Cumplimiento AML',
 'Davivienda busca profesional para prevención de lavado de dinero en San Salvador.',
 'Licenciatura en Derecho o Finanzas. Certificación CAMS deseable. Mínimo 3 años en banca.',
 'Monitoreo de transacciones, análisis de reportes UAFE, capacitación a personal.',
 'Finanzas','Presencial','San Salvador',1200.00,1800.00,1,'abierta','2026-06-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000C'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000C'),
 'Arquitecto de Proyectos Residenciales',
 'Grupo Roble requiere arquitecto para diseño de proyectos residenciales en la zona metropolitana.',
 'Licenciatura en Arquitectura. AutoCAD, Revit, SketchUp. Mínimo 4 años en proyectos habitacionales.',
 'Diseño arquitectónico, elaboración de planos, supervisión de obra, coordinación con ingenieros.',
 'Ingeniería / Construcción','Presencial','San Salvador',1000.00,1600.00,2,'abierta','2026-07-15'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000D'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000D'),
 'Electricista Industrial',
 'AES El Salvador busca electricistas para mantenimiento de subestaciones en la región occidental.',
 'Técnico electricista. Licencia SIGET deseable. Disponibilidad para trabajo en campo.',
 'Mantenimiento preventivo y correctivo, instalación de tableros, lectura de planos eléctricos.',
 'Ingeniería / Construcción','Presencial','Santa Ana',600.00,900.00,4,'abierta','2026-06-15'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000E'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000E'),
 'Promotor de Ventas (Bebidas)',
 'Industrias La Constancia busca promotores para impulso de marcas en San Miguel y zona oriental.',
 'Bachillerato. Motocicleta propia. Experiencia en ventas de consumo masivo.',
 'Visita a tiendas, exhibición de productos, toma de pedidos, reporte de competencia.',
 'Ventas','Presencial','San Miguel',400.00,650.00,5,'abierta','2026-05-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-00000000000F'), UUID_TO_BIN('D0000000-0000-4000-A000-00000000000F'),
 'Jefe de Planta de Alimentos',
 'Corporación Dinant busca jefe de planta en San Salvador con estándares BPM.',
 'Ingeniero en Alimentos o Industrial. Mínimo 5 años en industria alimentaria. ISO 22000.',
 'Planificación de producción, control de calidad, gestión de HACCP, supervisión de personal.',
 'Manufactura','Presencial','San Salvador',1200.00,1800.00,1,'abierta','2026-07-01'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000010'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000010'),
 'Agente Bilingüe Español/Inglés',
 'CCA El Salvador contrata agentes para campaña de soporte técnico.',
 'Inglés B2 o superior. Bachillerato completo. Habilidades de resolución de problemas.',
 'Atención de llamadas entrantes, soporte nivel 1, documentación en CRM.',
 'Atención al Cliente','Presencial','San Salvador',550.00,800.00,15,'abierta','2026-08-01'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000011'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000011'),
 'Analista de Seguridad Informática',
 'Econocom El Salvador busca analista de ciberseguridad para clientes corporativos.',
 'Ingeniería en Sistemas. Certificaciones CEH o CompTIA Security+ deseables. Inglés intermedio.',
 'Análisis de vulnerabilidades, monitoreo SIEM, respuesta a incidentes, políticas de seguridad.',
 'Tecnología','Híbrido','San Salvador',1000.00,1600.00,2,'abierta','2026-06-30'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000012'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000012'),
 'Enfermera Instrumentista',
 'Hospital de Diagnóstico busca enfermera instrumentista para quirófanos en Santa Ana.',
 'Licenciatura en Enfermería. Especialidad en instrumentación quirúrgica. Mínimo 2 años en sala de operaciones.',
 'Instrumentación en cirugías, preparación de campo estéril, manejo de equipo quirúrgico.',
 'Salud','Presencial','Santa Ana',700.00,950.00,2,'abierta','2026-07-15'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000013'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000013'),
 'Docente de Ingeniería en Sistemas',
 'Universidad Don Bosco busca docente de tiempo completo para programación y bases de datos.',
 'Maestría en Ingeniería o afín. Experiencia docente mínima de 3 años.',
 'Impartir clases, asesoría a estudiantes, proyectos de investigación.',
 'Educación','Presencial','Soyapango',900.00,1300.00,2,'abierta','2026-06-01'),

(UUID_TO_BIN('F0000000-0000-4000-A000-000000000014'), UUID_TO_BIN('D0000000-0000-4000-A000-000000000014'),
 'Gerente de Tienda',
 'Walmart El Salvador busca gerente para sucursal en San Miguel.',
 'Licenciatura en Administración. Mínimo 5 años en retail y 2 en gerencia.',
 'Gestión integral de tienda, liderazgo de más de 50 personas, control de P&L.',
 'Retail / Ventas','Presencial','San Miguel',1400.00,2000.00,1,'abierta','2026-07-31');

-- ============================================================
-- 6. PUBLICACIONES DEL FORO (20 registros)
-- ============================================================
INSERT IGNORE INTO Publicacion_Foro (id, idUsuario, titulo, contenido, cantidadLikes) VALUES
(UUID_TO_BIN('00100000-0000-4000-A000-000000000001'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'),
 '¿Cómo preparar el CV para empresas tech en El Salvador?',
 'Hola a todos, estoy por graduarme de Ingeniería en Sistemas y quiero aplicar a empresas como Applaudo o Telus. ¿Qué recomiendan incluir en el CV? ¿Proyectos de GitHub, certificados, o experiencia freelance?',24),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000002'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'),
 'Salarios en el sector BPO vs Tech en El Salvador 2026',
 'Comparando ofertas que he recibido: el sector tech ofrece entre $1,000 y $3,500 mientras que BPO ronda $600-$1,200. ¿Alguien tiene experiencia reciente en ambos?',41),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000003'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'),
 'Experiencia trabajando en Banco Agrícola',
 'Llevo 3 años en Banco Agrícola y puedo responder dudas sobre el proceso de selección, cultura laboral y beneficios. El proceso incluye prueba psicométrica, técnica y 2 entrevistas.',38),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000004'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'),
 'Trabajar como freelancer en El Salvador ¿es viable?',
 'Me ofrecieron un puesto remoto pagado en dólares desde EE.UU. ¿Cómo manejan los impuestos? ¿Qué figura legal usan?',55),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000005'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'),
 'Certificaciones en tecnología que más valoran las empresas SV',
 'Según entrevistas recientes, las certificaciones más solicitadas son: AWS Cloud Practitioner, Scrum Master y Google Analytics.',62),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000006'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'),
 'Tips para la entrevista de inglés en Telus International',
 'La entrevista dura ~45 minutos y evalúan pronunciación, comprensión y respuesta bajo presión. Practiquen con shadowing de videos en inglés neutro al menos 2 semanas antes.',29),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000007'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'),
 'Oportunidades laborales en San Miguel 2026',
 'Soy de San Miguel y noto que la mayoría de ofertas se concentran en San Salvador. ¿Conocen empresas que estén expandiéndose al oriente?',17),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000008'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'),
 'Negociación de salario: ¿cuándo y cómo?',
 'Muchos salvadoreños tenemos miedo de negociar salario. Mi experiencia: pregunten el rango ANTES de la última entrevista.',73),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000009'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'),
 '¿Cuánto tiempo tarda el proceso de selección en empresas grandes?',
 'Apliqué a BAC Credomatic hace 3 semanas y aún no recibo respuesta. ¿Es normal?',19),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000A'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'),
 'Trabajo híbrido en El Salvador: ¿realidad o mito?',
 'Busqué empleos con modalidad híbrida y encontré muy pocos fuera del sector tech.',45),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000B'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'),
 'Beneficios laborales más valorados: ¿cuáles priorizar?',
 'Ante dos ofertas similares en salario, ¿qué beneficios priorizan? Para mí el seguro médico es innegociable.',51),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000C'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'),
 'Cómo destacar en LinkedIn si eres recién graduado en SV',
 'Tips: (1) completa el perfil al 100%, (2) pide recomendaciones a docentes, (3) publica contenido de tu área, (4) conéctate con reclutadores de empresas target.',84),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000D'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'),
 'Sector financiero vs tecnología: ¿dónde crecer más?',
 'Trabajo en banca hace 6 años y estoy considerando pasarme a tech. El salario es mejor pero ¿la estabilidad también?',36),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000E'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'),
 'Pruebas psicométricas: cómo no reprobarse',
 'En casi todas las empresas grandes aplican pruebas tipo Cleaver o Wonderlic. Practiquen en 123test.com para familiarizarse con el formato.',47),

(UUID_TO_BIN('00100000-0000-4000-A000-00000000000F'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'),
 'Experiencia aplicando a Applaudo Studios',
 'El proceso: (1) Revisión de CV y portafolio, (2) Prueba técnica HackerRank 90 min, (3) Entrevista técnica, (4) Entrevista cultural en inglés, (5) Oferta. Todo duró 3 semanas.',92),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000010'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000001'),
 'Empleos en sector salud: ¿hay buenas oportunidades en SV?',
 'Soy enfermero y me pregunto si vale la pena especializarme para mejorar mis opciones. Los hospitales privados pagan mejor pero exigen más.',22),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000011'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000002'),
 'Primer empleo sin experiencia: ¿por dónde empezar?',
 'Recién gradué de bachillerato y quiero trabajar pero todos piden experiencia. Mi consejo: busquen primer empleo en retail o call center.',66),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000012'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000003'),
 'Emprendimiento vs empleo en El Salvador 2026',
 'La Ley del Emprendedor de 2024 simplificó el registro. ¿Prefieren la seguridad del empleo o la libertad del emprendimiento?',38),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000013'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000004'),
 'Trabajo en el exterior siendo salvadoreño',
 'Con el crecimiento del trabajo remoto, cada vez más salvadoreños trabajan para empresas de EE.UU. ¿Han pasado por ese proceso?',54),

(UUID_TO_BIN('00100000-0000-4000-A000-000000000014'), UUID_TO_BIN('C0000000-0000-4000-A000-000000000005'),
 'Inteligencia Artificial: ¿amenaza o oportunidad para el empleo?',
 'Las empresas en SV están usando IA para automatizar tareas repetitivas pero necesitan más personas para gestionar esas herramientas. ¿Cuál es su experiencia?',77);

-- ============================================================
-- 7. RECURSOS (20 artículos, videos y guías)
-- ============================================================
INSERT IGNORE INTO Recurso (id, idUsuario, titulo, contenido, tipo, estado) VALUES
(UUID_TO_BIN('00200000-0000-4000-A000-000000000001'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Cómo hacer un CV que supere el filtro ATS en 2026',
 'Los sistemas ATS filtran entre el 70-90% de CVs antes de que un reclutador los vea. Para superarlos: usa palabras clave del descriptor, evita tablas y gráficos, usa fuentes estándar como Arial o Calibri, guarda en PDF con texto seleccionable.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000002'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Guía completa para entrevistas de trabajo en El Salvador',
 'Esta guía cubre los aspectos más importantes para tener éxito en una entrevista laboral en el contexto salvadoreño. Desde la preparación previa hasta el follow-up post-entrevista.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000003'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Top 10 habilidades más demandadas en el mercado laboral SV 2026',
 'Las habilidades más solicitadas: (1) Inglés B2+, (2) Excel avanzado, (3) Atención al cliente, (4) Análisis de datos, (5) Liderazgo, (6) Desarrollo web, (7) Marketing digital, (8) Contabilidad, (9) Gestión de proyectos, (10) Ciberseguridad.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000004'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Cómo aprender inglés rápido para empleos en BPO',
 'Metodología para alcanzar nivel B2 en 6 meses con 1 hora diaria: Duolingo para vocabulario, BBC Learning English para pronunciación, conversación con nativos en Tandem.',
 'Video','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000005'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Emprendimiento en El Salvador: Ley de Sociedades Simplificadas',
 'Desde 2024, El Salvador permite crear una empresa S de RL de CV con capital mínimo de $1. Esta guía explica el proceso en el CNR: documentos, costos y ventajas fiscales.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000006'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'LinkedIn para profesionales salvadoreños: guía práctica',
 'El 78% de los reclutadores en El Salvador usan LinkedIn como primera fuente de candidatos. Esta guía explica cómo optimizar el perfil y conectar con decisores en empresas target.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000007'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Salarios 2026: guía de referencia por industria en El Salvador',
 'Tecnología: $1,800/mes promedio para seniors. Finanzas: $900-$1,600. BPO: $550-$1,100. Salud: $700-$1,400. Manufactura: $365-$800. Datos actualizados a enero 2026.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000008'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Código de Trabajo de El Salvador: Derechos del Empleado',
 'Resumen de los derechos laborales más importantes: jornada máxima de 8 horas, vacación anual de 15 días, aguinaldo obligatorio, seguro social, AFP y protección contra despido injustificado.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000009'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Trabajo remoto desde El Salvador: aspectos legales y fiscales',
 'Con el auge del trabajo remoto para empresas extranjeras es crucial entender: cómo declarar ingresos en dólares, si aplica IVA, cómo recibir pagos internacionales con Wise o PayPal.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000A'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Cómo conseguir tu primera práctica profesional',
 'Guía para universitarios sobre cómo encontrar prácticas en empresas reconocidas, contactar reclutadores directamente y convertir la práctica en empleo permanente.',
 'Video','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000B'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Desarrollo profesional en el sector financiero salvadoreño',
 'El sector bancario emplea a más de 25,000 personas. Esta guía traza las rutas de carrera desde ejecutivo junior hasta gerente. Incluye certificaciones recomendadas: CFA, CPAP.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000C'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Bootcamps de programación en El Salvador: ¿valen la pena?',
 'Análisis de bootcamps vs carreras universitarias: costo, duración y empleabilidad post-egreso. Los bootcamps son ideales para cambiar de carrera; las universidades para bases sólidas.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000D'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Inteligencia Artificial aplicada al trabajo en 2026',
 'Cómo profesionales salvadoreños usan herramientas de IA como ChatGPT, Copilot y Gemini en su trabajo diario: marketing, contabilidad, RRHH y programación.',
 'Video','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000E'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Cómo manejar el estrés laboral y el burnout',
 'El burnout afecta al 43% de los trabajadores centroamericanos. Estrategias: Pomodoro, time blocking, cómo establecer límites saludables y cuándo buscar ayuda profesional.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-00000000000F'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Marketing digital: oportunidades laborales en El Salvador',
 'Las posiciones más demandadas: Community Manager, SEO Specialist, Paid Media Manager. Salarios promedio y certificaciones que más valoran empresas como Grupo Roble y Applaudo.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000010'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Guía para negociar beneficios más allá del salario',
 'Muchas empresas tienen margen para negociar: días extra de vacación, trabajo remoto parcial, subsidio de internet, seguro médico familiar extendido y bono de rendimiento.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000011'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Excel avanzado para profesionales de Finanzas y RRHH',
 'Tutorial de 90 minutos con las funciones más usadas: tablas dinámicas, VLOOKUP/XLOOKUP, Power Query, macros básicas y dashboards. Ejercicios basados en nóminas y presupuestos.',
 'Video','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000012'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Oportunidades de empleo en la industria de salud en SV',
 'El sistema de salud privado está en expansión. Esta guía detalla perfiles demandados, rangos salariales y cómo preparar la documentación para aplicar.',
 'Articulo','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000013'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Cómo pasar de empleado a consultor independiente',
 'Para profesionales con más de 5 años de experiencia: cómo fijar tarifas, encontrar primeros clientes, herramientas de gestión y manejar los períodos sin ingresos.',
 'Guia','publicado'),

(UUID_TO_BIN('00200000-0000-4000-A000-000000000014'), UUID_TO_BIN('A0000000-0000-4000-A000-000000000001'),
 'Preparación para certificaciones PMP y Scrum en El Salvador',
 'PMP y las certificaciones Scrum (PSM I, CSM) han aumentado 40% en demanda desde 2024. Costos de examen, tiempo de preparación y dónde rendir el examen en San Salvador.',
 'Video','publicado');

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'Usuarios'  AS tabla, COUNT(*) AS total FROM Usuario;
SELECT 'Empresas'  AS tabla, COUNT(*) AS total FROM Perfil_Empresa;
SELECT 'Empleos'   AS tabla, COUNT(*) AS total FROM Empleo;
SELECT 'Foro'      AS tabla, COUNT(*) AS total FROM Publicacion_Foro;
SELECT 'Recursos'  AS tabla, COUNT(*) AS total FROM Recurso;
