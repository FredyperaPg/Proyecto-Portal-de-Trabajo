// detalleEmpleoPublico.js — /empleo/detalle (vista pública)
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const params  = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('id');

    if (!idEmpleo) {
        mostrarError('No se especificó una oferta. <a href="/empleos">Ver todos los empleos</a>');
        return;
    }

    try {
        const res  = await fetch(`${API}/empleos/${idEmpleo}`);
        const data = await res.json();

        if (!res.ok || !data.data) {
            mostrarError('Esta oferta no existe o ya fue cerrada. <a href="/empleos">Ver otros empleos</a>');
            return;
        }

        const e = data.data;

        // Inyectar datos en la vista
        setTxt('detalle-titulo',          e.titulo);
        setTxt('detalle-empresa',         e.nombreEmpresa);
        setTxt('detalle-ubicacion',       e.ubicacion);
        setTxt('detalle-modalidad',       e.modalidad);
        setTxt('detalle-categoria',       e.categoria);
        setTxt('detalle-vacantes',        `${e.vacantes} vacante${e.vacantes !== 1 ? 's' : ''}`);
        setTxt('detalle-descripcion',     e.descripcion);
        setTxt('detalle-requisitos',      e.requisitos);
        setTxt('detalle-funciones',       e.funciones);
        setTxt('detalle-desc-empresa',    e.descripcionEmpresa);
        setTxt('detalle-sector-empresa',  e.sector);

        if (e.salarioMin && e.salarioMax) {
            setTxt('detalle-salario',
                `$${Number(e.salarioMin).toLocaleString('es-SV')} – $${Number(e.salarioMax).toLocaleString('es-SV')}`);
        }
        if (e.fechaVencimiento) {
            setTxt('detalle-vencimiento', new Date(e.fechaVencimiento).toLocaleDateString('es-SV'));
        }

        // Logo empresa
        const logoEl = document.getElementById('detalle-logo-empresa');
        if (logoEl) {
            if (e.logoEmpresa) {
                logoEl.src = e.logoEmpresa;
            } else {
                logoEl.textContent = (e.nombreEmpresa || 'E').charAt(0).toUpperCase();
                logoEl.classList.add('company-logo');
            }
        }

        // Botón de aplicar — redirige a login si no hay sesión
        const btnAplicar = document.getElementById('btn-aplicar');
        if (btnAplicar) {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                btnAplicar.textContent = 'Inicia sesión para aplicar';
                btnAplicar.href = `/login?redirect=/empleo/detalle?id=${idEmpleo}`;
            } else if (user.rol === 'postulante') {
                btnAplicar.href = `/postulante/empleo/detalle?id=${idEmpleo}`;
                btnAplicar.textContent = 'Aplicar ahora';
            } else {
                btnAplicar.style.display = 'none';
            }
        }

        // Actualizar título de página
        document.title = `${e.titulo} — ${e.nombreEmpresa} | Portal Empleos`;

    } catch (err) {
        mostrarError('Error al cargar la oferta. Por favor intenta de nuevo.');
        console.error(err);
    }
});

function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.textContent = val;
}

function mostrarError(msg) {
    const contenedor = document.getElementById('detalle-contenedor') || document.body;
    contenedor.innerHTML = `
        <div class="container py-5 text-center">
            <i class="bi bi-exclamation-circle fs-1 text-muted d-block mb-3"></i>
            <p class="text-muted">${msg}</p>
        </div>`;
}
