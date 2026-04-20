// empleosPublico.js — /empleos
const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleos();

    // Filtros
    document.getElementById('btn-filtrar')?.addEventListener('click', cargarEmpleos);
    document.getElementById('input-busqueda')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') cargarEmpleos();
    });
    document.getElementById('btn-limpiar')?.addEventListener('click', () => {
        ['input-busqueda','filtro-categoria','filtro-modalidad','filtro-ubicacion']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        cargarEmpleos();
    });
});

async function cargarEmpleos() {
    const contenedor = document.getElementById('contenedor-empleos');
    const contador   = document.getElementById('stats-contador');
    if (!contenedor) return;

    contenedor.innerHTML = skeletonCards(6);

    const busqueda  = document.getElementById('input-busqueda')?.value || '';
    const categoria = document.getElementById('filtro-categoria')?.value || '';
    const modalidad = document.getElementById('filtro-modalidad')?.value || '';
    const ubicacion = document.getElementById('filtro-ubicacion')?.value || '';

    const params = new URLSearchParams();
    if (busqueda)  params.set('busqueda',  busqueda);
    if (categoria) params.set('categoria', categoria);
    if (modalidad) params.set('modalidad', modalidad);
    if (ubicacion) params.set('ubicacion', ubicacion);

    try {
        const res  = await fetch(`${API}/empleos?${params}`);
        const data = await res.json();
        const empleos = data.data || [];

        if (contador) contador.textContent = `${empleos.length} empleo${empleos.length !== 1 ? 's' : ''} encontrado${empleos.length !== 1 ? 's' : ''}`;

        if (empleos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search fs-1 text-muted d-block mb-2"></i>
                    <p class="text-muted">No encontramos empleos con esos criterios.</p>
                    <button class="btn btn-outline-primary btn-sm" onclick="limpiarFiltros()">Limpiar filtros</button>
                </div>`;
            return;
        }

        contenedor.innerHTML = empleos.map(e => cardEmpleoLista(e)).join('');
    } catch (err) {
        contenedor.innerHTML = `<div class="col-12 text-center py-5 text-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar empleos. Verifica la conexión.
        </div>`;
    }
}

function limpiarFiltros() {
    ['input-busqueda','filtro-categoria','filtro-modalidad','filtro-ubicacion']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    cargarEmpleos();
}
window.limpiarFiltros = limpiarFiltros;

function cardEmpleoLista(e) {
    const salario = e.salarioMin && e.salarioMax
        ? `$${Number(e.salarioMin).toLocaleString('es-SV')} – $${Number(e.salarioMax).toLocaleString('es-SV')}/mes`
        : 'Salario a convenir';
    const hace    = tiempoRelativo(e.creadoEl);
    const inicial = (e.nombreEmpresa || 'E').charAt(0).toUpperCase();
    const vence   = e.fechaVencimiento
        ? `<span class="text-warning small"><i class="bi bi-calendar-x me-1"></i>Cierra ${new Date(e.fechaVencimiento).toLocaleDateString('es-SV')}</span>`
        : '';

    return `
    <div class="col-12 col-md-6 col-lg-4">
        <div class="job-card h-100">
            <div class="d-flex align-items-start gap-3 mb-3">
                <div class="company-logo fw-bold">${inicial}</div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${escHtml(e.titulo)}</h6>
                    <span class="text-muted small">${escHtml(e.nombreEmpresa)}</span>
                </div>
            </div>
            <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge badge-full">${escHtml(e.categoria)}</span>
                <span class="badge badge-remote">${escHtml(e.modalidad)}</span>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-3 text-muted small mb-3">
                <span><i class="bi bi-geo-alt me-1"></i>${escHtml(e.ubicacion)}</span>
                <span><i class="bi bi-clock me-1"></i>${hace}</span>
                <span><i class="bi bi-people me-1"></i>${e.vacantes} vacante${e.vacantes !== 1 ? 's' : ''}</span>
            </div>
            ${vence}
            <div class="d-flex align-items-center justify-content-between mt-2">
                <span class="salary">${salario}</span>
                <a href="/empleo/detalle?id=${e.id}" class="btn btn-primary btn-sm">Ver oferta</a>
            </div>
        </div>
    </div>`;
}

function tiempoRelativo(fecha) {
    if (!fecha) return 'Reciente';
    const diff = Date.now() - new Date(fecha).getTime();
    const dias = Math.floor(diff / 86400000);
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 7)  return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias/7)} sem.`;
    return `Hace ${Math.floor(dias/30)} mes(es)`;
}

function skeletonCards(n) {
    return Array(n).fill(0).map(() => `
        <div class="col-md-6 col-lg-4">
            <div class="job-card placeholder-glow" style="min-height:200px;">
                <div class="placeholder col-8 mb-2" style="height:18px;border-radius:4px;"></div>
                <div class="placeholder col-5 mb-3" style="height:13px;border-radius:4px;"></div>
                <div class="placeholder col-12 mb-2" style="height:28px;border-radius:4px;"></div>
                <div class="placeholder col-6" style="height:13px;border-radius:4px;"></div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
