// foroPublico.js — VISTA_11, VISTA_20 (Foro postulante)
const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    cargarForo();

    // Búsqueda
    document.getElementById('btn-buscar-foro')?.addEventListener('click', cargarForo);
    document.getElementById('input-busqueda-foro')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') cargarForo();
    });

    // Nuevo Hilo — botón activado
    document.getElementById('btn-nuevo-hilo')?.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) { window.location.href = '/login'; return; }
        const modal = document.getElementById('modal-nuevo-hilo');
        if (modal) {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            // Si no hay modal, mostrar formulario inline
            mostrarFormularioNuevoHilo();
        }
    });

    // Envío de nuevo hilo (si hay formulario)
    document.getElementById('form-nuevo-hilo')?.addEventListener('submit', async e => {
        e.preventDefault();
        await publicarNuevoHilo();
    });
});

async function cargarForo() {
    const contenedor = document.getElementById('contenedor-foro');
    const contador   = document.getElementById('stats-foro');
    if (!contenedor) return;

    contenedor.innerHTML = skeletonItems(4);
    const busqueda = document.getElementById('input-busqueda-foro')?.value?.trim() || '';
    const params   = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : '';

    try {
        const res  = await fetch(`${API}/foro${params}`);
        const data = await res.json();
        const pubs = data.data || [];

        if (contador) contador.textContent = `${pubs.length} publicación${pubs.length !== 1 ? 'es' : ''}`;

        if (pubs.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-chat-square-dots fs-1 d-block mb-3"></i>
                    <p>No hay publicaciones${busqueda ? ' con ese criterio' : ' aún'}.</p>
                    ${busqueda ? '<button class="btn btn-sm btn-outline-secondary" onclick="limpiarBusqueda()">Limpiar búsqueda</button>' : ''}
                </div>`;
            return;
        }

        contenedor.innerHTML = pubs.map(p => cardForo(p)).join('');
    } catch (err) {
        contenedor.innerHTML = `
            <div class="text-center py-4 text-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar el foro. Recarga la página.
            </div>`;
    }
}
window.limpiarBusqueda = () => {
    const inp = document.getElementById('input-busqueda-foro');
    if (inp) inp.value = '';
    cargarForo();
};

function cardForo(p) {
    const hace    = tiempoRelativo(p.creadoEl);
    const inicial = (p.autor || 'U').charAt(0).toUpperCase();
    const preview = (p.contenido || '').substring(0, 180) + (p.contenido?.length > 180 ? '...' : '');
    const esPrivado = window.location.pathname.includes('/postulante') || window.location.pathname.includes('/admin');
    const base    = esPrivado
        ? (window.location.pathname.includes('/admin') ? '/admin/foro/detalle' : '/postulante/foro/detalle')
        : '/foro/detalle';

    return `
    <div class="card border-0 shadow-sm mb-3 hover-shadow">
        <div class="card-body">
            <div class="d-flex gap-3 align-items-start">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                     style="width:44px;height:44px;font-size:1.1rem;">${escHtml(inicial)}</div>
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-start flex-wrap gap-1 mb-1">
                        <h6 class="mb-0 fw-bold text-truncate" style="max-width:400px;">${escHtml(p.titulo)}</h6>
                        <small class="text-muted flex-shrink-0">${hace}</small>
                    </div>
                    <p class="text-muted small mb-2">${escHtml(preview)}</p>
                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <small class="text-muted"><i class="bi bi-person me-1"></i>${escHtml(p.autor)}</small>
                        <small class="text-muted"><i class="bi bi-chat me-1"></i>${p.totalComentarios || 0} comentarios</small>
                        <small class="text-muted"><i class="bi bi-heart me-1"></i>${p.cantidadLikes || 0}</small>
                        <a href="${base}?id=${p.id}" class="btn btn-link btn-sm p-0 ms-auto text-decoration-none">
                            Leer más <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function mostrarFormularioNuevoHilo() {
    const contenedor = document.getElementById('contenedor-foro');
    const formHtml = `
        <div class="card border-primary mb-4" id="card-nuevo-hilo">
            <div class="card-header bg-primary text-white d-flex justify-content-between">
                <span><i class="bi bi-plus-circle me-2"></i>Nueva publicación</span>
                <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('card-nuevo-hilo').remove()"></button>
            </div>
            <div class="card-body">
                <form id="form-nuevo-hilo">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Título</label>
                        <input type="text" id="hilo-titulo" class="form-control" placeholder="¿Sobre qué quieres hablar?" required maxlength="255"/>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Contenido</label>
                        <textarea id="hilo-contenido" class="form-control" rows="4" placeholder="Describe tu tema o pregunta..." required></textarea>
                    </div>
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-send me-1"></i>Publicar
                        </button>
                        <button type="button" class="btn btn-outline-secondary" onclick="document.getElementById('card-nuevo-hilo').remove()">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        ${contenedor.innerHTML}`;
    contenedor.innerHTML = formHtml;
    document.getElementById('form-nuevo-hilo')?.addEventListener('submit', async e => {
        e.preventDefault();
        await publicarNuevoHilo();
    });
}

async function publicarNuevoHilo() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    const titulo    = document.getElementById('hilo-titulo')?.value?.trim();
    const contenido = document.getElementById('hilo-contenido')?.value?.trim();
    if (!titulo || !contenido) return;

    const btn = document.querySelector('#form-nuevo-hilo [type="submit"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Publicando...'; }

    try {
        const res = await fetch(`${API}/foro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idUsuario: user.id, titulo, contenido })
        });
        if (res.ok) {
            document.getElementById('card-nuevo-hilo')?.remove();
            await cargarForo();
        } else {
            const d = await res.json();
            alert(d.message || 'Error al publicar');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar'; }
        }
    } catch (err) {
        alert('Error de conexión');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar'; }
    }
}

function tiempoRelativo(fecha) {
    if (!fecha) return '';
    const diff = Date.now() - new Date(fecha).getTime();
    const dias = Math.floor(diff / 86400000);
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 30)  return `Hace ${dias} días`;
    return new Date(fecha).toLocaleDateString('es-SV');
}

function skeletonItems(n) {
    return Array(n).fill(0).map(() => `
        <div class="card border-0 shadow-sm mb-3 placeholder-glow">
            <div class="card-body">
                <div class="d-flex gap-3">
                    <div class="rounded-circle bg-secondary flex-shrink-0" style="width:44px;height:44px;"></div>
                    <div class="flex-grow-1">
                        <div class="placeholder col-7 mb-2" style="height:16px;border-radius:4px;"></div>
                        <div class="placeholder col-12 mb-1" style="height:12px;border-radius:4px;"></div>
                        <div class="placeholder col-9" style="height:12px;border-radius:4px;"></div>
                    </div>
                </div>
            </div>
        </div>`).join('');
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
