// ofertasEmpresa.js — VISTA_23_OfertasEmpresa
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }
    // Si no tenemos idEmpresa en localStorage, lo buscamos
    if (!user.idEmpresa) {
        try {
            const r = await fetch('/api/perfil/empresa/' + user.id, { credentials: 'include' });
            const d = await r.json();
            if (d.data?.idEmpresaBin) {
                user.idEmpresa = d.data.id || d.data.idEmpresaBin;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch(_) {}
        if (!user.idEmpresa) {
            const c = document.getElementById('ofertas-container') || document.body;
            c.innerHTML = '<div class="alert alert-warning m-3">No se encontró el perfil de empresa. <a href="/empresa/mi-perfil">Configura tu perfil</a>.</div>';
            return;
        }
    }

    const container  = document.getElementById('ofertas-container');
    const topbarInfo = document.getElementById('topbar-info');

    if (!container) return;

    container.innerHTML = '<div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Cargando ofertas...</div>';

    try {
        const res  = await fetch(`${API}/empleos/empresa/${user.idEmpresa}`, { credentials: 'include' });
        const data = await res.json();
        const empleos = data.data || [];

        const activas = empleos.filter(e => e.estado === 'abierta').length;
        if (topbarInfo) topbarInfo.textContent = `${empleos.length} ofertas publicadas · ${activas} activas`;

        if (empleos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-briefcase fs-1 d-block mb-3"></i>
                    <p>Aún no tienes ofertas publicadas.</p>
                    <a href="/empresa/publicar" class="btn btn-primary btn-sm">
                        <i class="bi bi-plus-circle me-1"></i>Publicar primera oferta
                    </a>
                </div>`;
            return;
        }

        container.innerHTML = empleos.map(e => {
            const estadoClass = e.estado === 'abierta' ? 'pill-active' : 'pill-closed';
            const estadoLabel = e.estado === 'abierta' ? 'Activa' : 'Cerrada';
            const fecha = new Date(e.creadoEl).toLocaleDateString('es-SV');
            const salario = e.salarioMin
                ? `$${Number(e.salarioMin).toLocaleString()} – $${Number(e.salarioMax).toLocaleString()}`
                : 'A convenir';
            return `
            <div class="offer-card">
                <div class="row g-3 d-flex justify-content-between align-items-center">
                    <div class="col-lg-5">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="status-pill ${estadoClass}">
                                <i class="bi bi-circle-fill me-1" style="font-size:.5rem;"></i>${estadoLabel}
                            </span>
                            <span class="text-muted small">Publicada: ${fecha}</span>
                        </div>
                        <h6 class="fw-bold mb-1">
                            <a href="/empresa/oferta/detalle?id=${e.id}"
                               class="text-decoration-none" style="color:var(--text);">${esc(e.titulo)}</a>
                        </h6>
                        <div class="text-muted small d-flex gap-3 flex-wrap">
                            <span><i class="bi bi-geo-alt me-1"></i>${esc(e.ubicacion)}</span>
                            <span><i class="bi bi-laptop me-1"></i>${esc(e.modalidad)}</span>
                            <span><i class="bi bi-cash-coin me-1"></i>${salario}</span>
                        </div>
                    </div>
                    <div class="col-lg-3 text-center">
                        <div class="fw-bold fs-5" style="color:var(--primary);">${e.totalPostulaciones || 0}</div>
                        <div class="text-muted small">postulaciones</div>
                    </div>
                    <div class="col-lg-3 text-end">
                        <div class="d-flex gap-2 justify-content-end flex-wrap">
                            <a href="/empresa/oferta/aplicaciones?idEmpleo=${e.id}"
                               class="btn btn-sm btn-primary">
                                Ver aplicantes (${e.totalPostulaciones || 0})
                            </a>
                            <button class="btn btn-sm btn-outline-secondary"
                                    onclick="toggleEstado('${e.id}','${e.estado}',this)">
                                ${e.estado === 'abierta' ? 'Cerrar' : 'Reabrir'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="alert alert-danger m-3">Error al cargar las ofertas.</div>';
    }
});

async function toggleEstado(id, estadoActual, btn) {
    const nuevo = estadoActual === 'abierta' ? 'cerrada' : 'abierta';
    btn.disabled = true;
    try {
        await fetch(`/api/empleos/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevo })
        });
        location.reload();
    } catch { btn.disabled = false; alert('Error al cambiar estado.'); }
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
