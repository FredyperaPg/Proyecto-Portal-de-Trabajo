// inicio.js — /
// Carga stats y empleos recientes desde la API
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([cargarStats(), cargarEmpleosRecientes()]);
});

// ── CONTADORES ─────────────────────────────────────────────────────────────────
async function cargarStats() {
    try {
        const [empRes, empresaRes] = await Promise.all([
            fetch(`${API}/empleos?limit=1`),
            fetch(`${API}/perfil/admin/stats`)
        ]);

        if (empresaRes.ok) {
            const data = await empresaRes.json();
            const s = data.data || {};
            animarContador('stat-empleos-activos', s.totalEmpleos   || 0);
            animarContador('stat-empresas',         s.totalEmpresas  || 0);
            animarContador('stat-candidatos',        s.totalPostulantes || 0);
        }
    } catch (err) {
        console.warn('Stats no disponibles, mostrando contadores en 0');
    }
}

// ── EMPLEOS RECIENTES ──────────────────────────────────────────────────────────
async function cargarEmpleosRecientes() {
    const contenedor = document.getElementById('contenedor-empleos-recientes');
    if (!contenedor) return;

    contenedor.innerHTML = skeletonCards(3);

    try {
        const res  = await fetch(`${API}/empleos`);
        const data = await res.json();
        const empleos = (data.data || []).slice(0, 6);

        if (empleos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="bi bi-briefcase fs-1 d-block mb-2"></i>
                    Aún no hay empleos publicados.
                </div>`;
            return;
        }

        contenedor.innerHTML = empleos.map(e => cardEmpleo(e)).join('');

        // También actualizar el hero stat si existe
        const heroStat = document.getElementById('hero-total-empleos');
        if (heroStat) heroStat.textContent = `${empleos.length}+`;

    } catch (err) {
        contenedor.innerHTML = `<div class="col-12 text-center text-muted py-4">
            <i class="bi bi-wifi-off me-2"></i>No se pudieron cargar los empleos.
        </div>`;
    }
}

// ── CARD de empleo ─────────────────────────────────────────────────────────────
function cardEmpleo(e) {
    const salario = e.salarioMin && e.salarioMax
        ? `$${Number(e.salarioMin).toLocaleString('es-SV')} – $${Number(e.salarioMax).toLocaleString('es-SV')}/mes`
        : 'Salario a convenir';

    const hace = tiempoRelativo(e.creadoEl);
    const badgeModal = badgeModalidad(e.modalidad);
    const inicial = (e.nombreEmpresa || 'E').charAt(0).toUpperCase();

    return `
    <div class="col-md-6 col-lg-4">
        <div class="job-card h-100">
            <div class="d-flex align-items-start gap-3 mb-3">
                <div class="company-logo">${inicial}</div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${escHtml(e.titulo)}</h6>
                    <span class="text-muted small">${escHtml(e.nombreEmpresa)}</span>
                </div>
            </div>
            <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge badge-full">${escHtml(e.categoria)}</span>
                ${badgeModal}
            </div>
            <div class="d-flex align-items-center gap-3 text-muted small mb-3">
                <span><i class="bi bi-geo-alt me-1"></i>${escHtml(e.ubicacion)}</span>
                <span><i class="bi bi-clock me-1"></i>${hace}</span>
            </div>
            <div class="d-flex align-items-center justify-content-between">
                <span class="salary">${salario}</span>
                <a href="/empleo/detalle?id=${e.id}" class="btn btn-primary btn-sm">Ver oferta</a>
            </div>
        </div>
    </div>`;
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function badgeModalidad(m) {
    if (!m) return '';
    const map = { 'Remoto': 'badge-remote', 'Híbrido': 'badge-remote', 'Presencial': 'badge-full' };
    const cls = map[m] || 'badge-full';
    return `<span class="badge ${cls}">${escHtml(m)}</span>`;
}

function tiempoRelativo(fecha) {
    if (!fecha) return 'Reciente';
    const diff = Date.now() - new Date(fecha).getTime();
    const dias  = Math.floor(diff / 86400000);
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 7)  return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias/7)} sem.`;
    return `Hace ${Math.floor(dias/30)} mes(es)`;
}

function animarContador(id, objetivo) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step  = Math.ceil(objetivo / 60);
    const timer = setInterval(() => {
        current = Math.min(current + step, objetivo);
        el.textContent = Number(current).toLocaleString('es-SV') + (objetivo > 100 ? '+' : '');
        if (current >= objetivo) clearInterval(timer);
    }, 25);
}

function skeletonCards(n) {
    return Array(n).fill(0).map(() => `
        <div class="col-md-6 col-lg-4">
            <div class="job-card h-100 placeholder-glow">
                <div class="placeholder col-8 mb-2" style="height:20px;border-radius:4px;"></div>
                <div class="placeholder col-5 mb-3" style="height:14px;border-radius:4px;"></div>
                <div class="placeholder col-12" style="height:36px;border-radius:4px;"></div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
