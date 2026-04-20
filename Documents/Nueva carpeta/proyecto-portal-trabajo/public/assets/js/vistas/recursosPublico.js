// recursosPublico.js — VISTA_09_Recursos.html y /postulante/recursos
const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarRecursos();
    document.getElementById('btn-buscar-recursos')?.addEventListener('click', cargarRecursos);
    document.querySelectorAll('[data-tipo-recurso]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-tipo-recurso]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            cargarRecursos();
        });
    });
});

async function cargarRecursos() {
    const contenedor = document.getElementById('contenedor-recursos');
    const contador   = document.getElementById('stats-recursos');
    if (!contenedor) return;

    contenedor.innerHTML = skeletonCards(6);
    const busqueda = document.getElementById('input-busqueda-recursos')?.value || '';
    const tipoBtn  = document.querySelector('[data-tipo-recurso].active');
    const tipo     = tipoBtn?.dataset.tipoRecurso || '';

    const params = new URLSearchParams();
    if (busqueda) params.set('busqueda', busqueda);
    if (tipo && tipo !== 'Todos') params.set('tipo', tipo);

    try {
        const res  = await fetch(`${API}/recursos?${params}`);
        const data = await res.json();
        const recursos = data.data || [];

        if (contador) contador.textContent = `${recursos.length} recurso${recursos.length !== 1 ? 's' : ''}`;

        if (recursos.length === 0) {
            contenedor.innerHTML = `<div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-journal-x fs-1 d-block mb-2"></i>
                No hay recursos disponibles con esos criterios.
            </div>`;
            return;
        }

        contenedor.innerHTML = recursos.map(r => cardRecurso(r)).join('');
    } catch (err) {
        contenedor.innerHTML = `<div class="col-12 text-center py-4 text-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar recursos.
        </div>`;
    }
}

function cardRecurso(r) {
    const icono  = iconoTipo(r.tipo);
    const base   = window.location.pathname.includes('/postulante') ? '/postulante/recurso/detalle' : '/recurso/detalle';
    const fecha  = r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString('es-SV') : '';
    const preview = (r.contenido || '').substring(0, 120) + (r.contenido?.length > 120 ? '...' : '');

    return `
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body d-flex flex-column">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="fs-4">${icono}</span>
                    <span class="badge bg-secondary">${escHtml(r.tipo)}</span>
                </div>
                <h6 class="fw-bold mb-2">${escHtml(r.titulo)}</h6>
                <p class="text-muted small flex-grow-1 mb-3">${escHtml(preview)}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">${fecha}</small>
                    <a href="${base}?id=${r.id}" class="btn btn-primary btn-sm">Leer más</a>
                </div>
            </div>
        </div>
    </div>`;
}

function iconoTipo(tipo) {
    const map = { 'Articulo': '📰', 'Video': '🎥', 'Guia': '📖' };
    return map[tipo] || '📄';
}

function skeletonCards(n) {
    return Array(n).fill(0).map(() => `
        <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm placeholder-glow" style="min-height:180px;">
                <div class="card-body">
                    <div class="placeholder col-4 mb-2" style="height:16px;border-radius:4px;"></div>
                    <div class="placeholder col-10 mb-2" style="height:18px;border-radius:4px;"></div>
                    <div class="placeholder col-12" style="height:13px;border-radius:4px;"></div>
                </div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
