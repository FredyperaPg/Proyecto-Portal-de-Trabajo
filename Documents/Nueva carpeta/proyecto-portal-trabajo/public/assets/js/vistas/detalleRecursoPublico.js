// detalleRecursoPublico.js — VISTA_10 / VISTA_19
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');
    if (!id) { mostrarError('No se especificó el recurso.'); return; }

    try {
        const res  = await fetch(`${API}/recursos/${id}`);
        const data = await res.json();
        if (!res.ok || !data.data) { mostrarError('Recurso no encontrado.'); return; }
        const r = data.data;

        setTxt('recurso-titulo',    r.titulo);
        setTxt('recurso-tipo',      r.tipo);
        setTxt('recurso-autor',     r.autor);
        setTxt('recurso-fecha',     r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString('es-SV') : '');
        setTxt('recurso-contenido', r.contenido);

        const icono = { 'Articulo': '📰', 'Video': '🎥', 'Guia': '📖' };
        setTxt('recurso-icono', icono[r.tipo] || '📄');

        if (r.urlVideo) {
            const vid = document.getElementById('recurso-video');
            if (vid) { vid.src = r.urlVideo; vid.parentElement?.classList.remove('d-none'); }
        }
        if (r.urlBanner) {
            const img = document.getElementById('recurso-banner');
            if (img) { img.src = r.urlBanner; img.parentElement?.classList.remove('d-none'); }
        }

        document.title = `${r.titulo} | Recursos — Portal Empleos`;
    } catch (err) { mostrarError('Error al cargar el recurso.'); console.error(err); }
});

function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
}
function mostrarError(msg) {
    document.body.innerHTML = `<div class="container py-5 text-center text-muted"><p>${msg}</p><a href="/recursos">Volver a recursos</a></div>`;
}
