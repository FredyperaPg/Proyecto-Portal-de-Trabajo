// aplicacionesOferta.js — VISTA_25_AplicacionesOfertaEmpresa
// Muestra los candidatos que aplicaron a una oferta específica
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

    // Leer idEmpleo de la URL: ?idEmpleo=xxx
    const params   = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('idEmpleo') || params.get('id');

    const container      = document.getElementById('aplicantes-container');
    const ofertaTitulo   = document.getElementById('oferta-titulo');
    const ofertaMeta     = document.getElementById('oferta-meta');
    const pipelineNuevas = document.getElementById('pipeline-nuevas');
    const pipelineTotal  = document.getElementById('pipeline-total');

    if (!container) return;
    container.innerHTML = '<div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Cargando candidatos...</div>';

    // Cargar datos de la oferta si existe idEmpleo
    if (idEmpleo) {
        try {
            const resEmpleo = await fetch(`${API}/empleos/${idEmpleo}`, { credentials: 'include' });
            const dataEmpleo = await resEmpleo.json();
            if (dataEmpleo.data) {
                const e = dataEmpleo.data;
                if (ofertaTitulo) ofertaTitulo.textContent = e.titulo;
                if (ofertaMeta)   ofertaMeta.textContent   = `${e.nombreEmpresa} · ${e.ubicacion} · ${e.modalidad}`;
            }
        } catch (err) { console.error('Error cargando oferta:', err); }
    }

    // Cargar postulaciones
    try {
        const url = idEmpleo
            ? `${API}/postulaciones/empresa/${user.idEmpresa}?idEmpleo=${idEmpleo}`
            : `${API}/postulaciones/empresa/${user.idEmpresa}`;

        const res  = await fetch(url, { credentials: 'include' });
        const data = await res.json();
        const apps = data.data || [];

        if (pipelineNuevas) pipelineNuevas.textContent = apps.filter(a => a.estado === 'pendiente').length;
        if (pipelineTotal)  pipelineTotal.textContent  = apps.length;

        if (apps.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-people fs-1 d-block mb-3"></i>
                    <p>Aún no hay candidatos que hayan aplicado a esta oferta.</p>
                </div>`;
            return;
        }

        const estadoBadge = {
            pendiente:  { cls: 'bg-warning text-dark', label: 'Nueva' },
            revisando:  { cls: 'bg-info text-dark',    label: 'En revisión' },
            aceptada:   { cls: 'bg-success',            label: 'Aceptada' },
            rechazada:  { cls: 'bg-danger',             label: 'Rechazada' },
        };

        container.innerHTML = `
        <div class="d-flex flex-column gap-3">
            ${apps.map(a => {
                const badge = estadoBadge[a.estado] || { cls: 'bg-secondary', label: a.estado };
                return `
                <div class="app-card p-3 bg-white border rounded-3 shadow-sm">
                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div class="avatar-sm d-flex align-items-center justify-content-center fw-bold text-white rounded-circle"
                             style="width:44px;height:44px;background:var(--primary);font-size:.9rem;flex-shrink:0;">
                            ${iniciales(a.nombres, a.apellidos)}
                        </div>
                        <div class="flex-grow-1">
                            <div class="fw-semibold">${esc(a.nombres)} ${esc(a.apellidos)}</div>
                            <div class="text-muted small">${esc(a.email)}
                                ${a.tituloCandidato ? ` · ${esc(a.tituloCandidato)}` : ''}
                                ${a.anosExperiencia ? ` · ${a.anosExperiencia} años exp.` : ''}
                            </div>
                            <div class="text-muted small mt-1">
                                <i class="bi bi-calendar3 me-1"></i>
                                Aplicó: ${new Date(a.fechaPostulacion).toLocaleDateString('es-SV')}
                                ${idEmpleo ? '' : ` · <span class="fw-semibold">${esc(a.tituloEmpleo)}</span>`}
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                            <span class="badge ${badge.cls}">${badge.label}</span>
                            <select class="form-select form-select-sm" style="width:auto;"
                                    onchange="cambiarEstado('${a.id}', this.value, this)">
                                <option value="pendiente"  ${a.estado==='pendiente'  ?'selected':''}>Nueva</option>
                                <option value="revisando"  ${a.estado==='revisando'  ?'selected':''}>En revisión</option>
                                <option value="aceptada"   ${a.estado==='aceptada'   ?'selected':''}>Aceptada</option>
                                <option value="rechazada"  ${a.estado==='rechazada'  ?'selected':''}>Rechazada</option>
                            </select>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>`;

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="alert alert-danger m-3">Error al cargar los aplicantes.</div>';
    }
});

async function cambiarEstado(idPostulacion, nuevoEstado, sel) {
    sel.disabled = true;
    try {
        const res = await fetch(`/api/postulaciones/${idPostulacion}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!res.ok) throw new Error();
        // Update badge visually
        const badge = sel.closest('.app-card')?.querySelector('.badge');
        const labels = { pendiente:'Nueva', revisando:'En revisión', aceptada:'Aceptada', rechazada:'Rechazada' };
        const classes = { pendiente:'bg-warning text-dark', revisando:'bg-info text-dark', aceptada:'bg-success', rechazada:'bg-danger' };
        if (badge) {
            badge.textContent  = labels[nuevoEstado] || nuevoEstado;
            badge.className    = `badge ${classes[nuevoEstado] || 'bg-secondary'}`;
        }
    } catch { alert('Error al actualizar el estado.'); }
    finally  { sel.disabled = false; }
}

function iniciales(n, a) { return ((n||'').charAt(0) + (a||'').charAt(0)).toUpperCase() || '?'; }
function esc(s)           { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
