// detalleForoPublico.js — VISTA_12_DetallesForo.html y VISTA_21
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');
    if (!id) { mostrarError('No se especificó la publicación.'); return; }

    await Promise.all([cargarPublicacion(id), cargarComentarios(id)]);

    // Formulario de comentario (si hay sesión)
    document.getElementById('form-comentario')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) { window.location.href = '/login'; return; }
        const contenido = document.getElementById('input-comentario')?.value?.trim();
        if (!contenido) return;

        try {
            await fetch(`${API}/foro/${id}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idUsuario: user.id, contenido })
            });
            document.getElementById('input-comentario').value = '';
            await cargarComentarios(id);
        } catch (err) { console.error(err); }
    });

    // Botón like
    document.getElementById('btn-like')?.addEventListener('click', async () => {
        await fetch(`${API}/foro/${id}/like`, { method: 'POST', credentials: 'include' });
        await cargarPublicacion(id);
    });
});

async function cargarPublicacion(id) {
    try {
        const res  = await fetch(`${API}/foro/${id}`);
        const data = await res.json();
        if (!res.ok || !data.data) { mostrarError('Publicación no encontrada.'); return; }
        const p = data.data;
        const inicial = (p.autor || 'U').charAt(0).toUpperCase();

        setTxt('foro-titulo',   p.titulo);
        setTxt('foro-autor',    p.autor);
        setTxt('foro-fecha',    new Date(p.creadoEl).toLocaleDateString('es-SV'));
        setTxt('foro-likes',    p.cantidadLikes || 0);
        setTxt('foro-contenido', p.contenido);
        const avEl = document.getElementById('foro-avatar');
        if (avEl) avEl.textContent = inicial;
        document.title = `${p.titulo} | Foro — Portal Empleos`;
    } catch (err) { console.error(err); }
}

async function cargarComentarios(id) {
    const cont = document.getElementById('contenedor-comentarios');
    if (!cont) return;
    try {
        const res  = await fetch(`${API}/foro/${id}/comentarios`);
        const data = await res.json();
        const coms = data.data || [];
        setTxt('stats-comentarios', `${coms.length} comentario${coms.length !== 1 ? 's' : ''}`);
        if (coms.length === 0) {
            cont.innerHTML = '<p class="text-muted small">Sé el primero en comentar.</p>';
            return;
        }
        cont.innerHTML = coms.map(c => `
            <div class="d-flex gap-3 mb-3">
                <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                     style="width:36px;height:36px;font-size:.85rem;">${(c.autor||'U').charAt(0).toUpperCase()}</div>
                <div class="flex-grow-1">
                    <div class="d-flex gap-2 align-items-center mb-1">
                        <strong class="small">${escHtml(c.autor)}</strong>
                        <small class="text-muted">${new Date(c.creadoEl).toLocaleDateString('es-SV')}</small>
                    </div>
                    <p class="mb-0 small">${escHtml(c.contenido)}</p>
                </div>
            </div>`).join('');
    } catch (err) { console.error(err); }
}

function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
}
function mostrarError(msg) {
    document.body.innerHTML = `<div class="container py-5 text-center text-muted"><p>${msg}</p><a href="/foro">Volver al foro</a></div>`;
}
function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
