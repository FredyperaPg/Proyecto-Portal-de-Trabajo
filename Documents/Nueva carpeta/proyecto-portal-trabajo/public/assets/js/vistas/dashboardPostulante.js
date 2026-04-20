// dashboardPostulante.js — VISTA_13_InicioPostulante
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    // ── 1. SESIÓN ────────────────────────────────────────────────────────────
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    // ── 2. NOMBRE — elimina el "Cargando..." del sidebar ─────────────────────
    const nombre = user.nombre || user.nombres || user.email?.split('@')[0] || 'Postulante';
    ['user-display-name','sidebar-nombre','saludo-nombre','header-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = nombre;
    });
    document.querySelectorAll('[data-user-nombre]').forEach(el => el.textContent = nombre);

    // ── 3. LOGOUT ─────────────────────────────────────────────────────────────
    document.querySelectorAll('#logoutBtn, .btn-logout, [data-logout]').forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            try { await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (_) {}
            localStorage.clear();
            window.location.href = '/login';
        });
    });

    // ── 4. BUSCADOR ───────────────────────────────────────────────────────────
    const searchInput = document.getElementById('main-search');
    if (searchInput) {
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const q = encodeURIComponent(searchInput.value.trim());
                if (q) window.location.href = `/postulante/empleos?busqueda=${q}`;
            }
        });
    }
    const btnBuscar = document.getElementById('btn-buscar-hero');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            const q = encodeURIComponent(searchInput?.value?.trim() || '');
            window.location.href = q ? `/postulante/empleos?busqueda=${q}` : '/postulante/empleos';
        });
    }

    // ── 5. ESTADÍSTICAS GLOBALES ──────────────────────────────────────────────
    try {
        const statsRes = await fetch(`${API}/perfil/admin/stats`);
        if (statsRes.ok) {
            const { data } = await statsRes.json();
            setEl('count-jobs',       data.totalEmpleos);
            setEl('count-companies',  data.totalEmpresas);
            setEl('count-candidates', data.totalPostulantes);
        }
    } catch (_) {
        // No crítico — mostrar 0
        ['count-jobs','count-companies','count-candidates'].forEach(id => setEl(id, 0));
    }

    // ── 6. MIS APLICACIONES RECIENTES ─────────────────────────────────────────
    const appsContainer = document.getElementById('mis-apps-container');
    if (appsContainer) {
        appsContainer.innerHTML = skeletonCards(3);
        try {
            const res  = await fetch(`${API}/postulaciones/mis-aplicaciones?idUsuario=${user.id}`, { credentials: 'include' });
            const data = await res.json();
            const apps = (data.data || []).slice(0, 3);

            setEl('count-apps', (data.data || []).length);

            if (apps.length === 0) {
                appsContainer.innerHTML = `
                    <div class="col-12 text-center text-muted py-4">
                        <i class="bi bi-clipboard-x fs-2 d-block mb-2"></i>
                        Aún no has aplicado a ningún empleo.
                        <div class="mt-2">
                            <a href="/postulante/empleos" class="btn btn-primary btn-sm">Explorar empleos</a>
                        </div>
                    </div>`;
            } else {
                appsContainer.innerHTML = apps.map(a => cardAplicacion(a)).join('');
            }
        } catch (_) {
            appsContainer.innerHTML = `<div class="col-12 text-center text-muted py-3">
                No se pudieron cargar tus aplicaciones.</div>`;
        }
    }

    // ── 7. EMPLEOS RECIENTES ──────────────────────────────────────────────────
    const jobsContainer = document.getElementById('jobs-container');
    if (jobsContainer) {
        jobsContainer.innerHTML = skeletonCards(6);
        try {
            const res   = await fetch(`${API}/empleos`, { credentials: 'include' });
            const data  = await res.json();
            const empleos = (data.data || []).slice(0, 6);

            if (empleos.length === 0) {
                jobsContainer.innerHTML = `
                    <div class="col-12 text-center text-muted py-4">
                        <i class="bi bi-briefcase fs-1 d-block mb-2"></i>
                        No hay vacantes disponibles en este momento.
                    </div>`;
            } else {
                jobsContainer.innerHTML = empleos.map(e => cardEmpleo(e)).join('');
            }
        } catch (err) {
            jobsContainer.innerHTML = `<div class="col-12 text-center text-danger py-3">
                <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar empleos.</div>`;
        }
    }
});

// ── CARD EMPLEO ───────────────────────────────────────────────────────────────
function cardEmpleo(e) {
    const salario = e.salarioMin && e.salarioMax
        ? `$${Number(e.salarioMin).toLocaleString('es-SV')} – $${Number(e.salarioMax).toLocaleString('es-SV')}`
        : 'Salario a convenir';
    return `
    <div class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <h6 class="fw-bold mb-1">${escHtml(e.titulo)}</h6>
                <p class="text-muted small mb-1"><i class="bi bi-building me-1"></i>${escHtml(e.nombreEmpresa)}</p>
                <p class="text-muted small mb-1"><i class="bi bi-geo-alt me-1"></i>${escHtml(e.ubicacion)} · ${escHtml(e.modalidad)}</p>
                <p class="small mb-2"><i class="bi bi-cash-coin me-1 text-success"></i>${salario}</p>
                <span class="badge bg-primary bg-opacity-10 text-primary">${escHtml(e.categoria)}</span>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0">
                <a href="/postulante/empleo/detalle?id=${e.id}" class="btn btn-outline-primary btn-sm w-100">Ver oferta</a>
            </div>
        </div>
    </div>`;
}

// ── CARD APLICACIÓN ───────────────────────────────────────────────────────────
function cardAplicacion(a) {
    const estados = {
        pendiente: ['bg-warning text-dark','bi-clock'],
        revisado:  ['bg-info text-white','bi-eye'],
        aceptado:  ['bg-success text-white','bi-check-circle'],
        rechazado: ['bg-danger text-white','bi-x-circle']
    };
    const [cls, icon] = estados[a.estado] || ['bg-secondary text-white','bi-question'];
    return `
    <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0 small">${escHtml(a.tituloEmpleo)}</h6>
                    <span class="badge ${cls}"><i class="bi ${icon} me-1"></i>${a.estado}</span>
                </div>
                <p class="text-muted small mb-0">${escHtml(a.nombreEmpresa)}</p>
                <p class="text-muted small">${escHtml(a.ubicacion)}</p>
            </div>
            <div class="card-footer bg-transparent border-0 pt-0">
                <a href="/postulante/empleo/detalle?id=${a.idEmpleo}" class="btn btn-link btn-sm p-0">Ver empleo →</a>
            </div>
        </div>
    </div>`;
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(val || 0).toLocaleString('es-SV');
}

function skeletonCards(n) {
    return Array(n).fill(0).map(() => `
        <div class="col-md-6 col-lg-4">
            <div class="card border-0 shadow-sm placeholder-glow" style="min-height:130px;">
                <div class="card-body">
                    <div class="placeholder col-8 mb-2" style="height:16px;border-radius:4px;"></div>
                    <div class="placeholder col-5 mb-2" style="height:12px;border-radius:4px;"></div>
                    <div class="placeholder col-10" style="height:12px;border-radius:4px;"></div>
                </div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
