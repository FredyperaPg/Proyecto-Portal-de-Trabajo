// perfilEmpresa.js — VISTA_29_PerfilEmpresa
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    // ── 1. Cargar datos del perfil desde la API ───────────────────────────────
    try {
        const res  = await fetch(`${API}/perfil/empresa/${user.id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const p = data.data;

        // Rellenar campos del formulario
        setVal('nombreComercial', p.nombreComercial);
        setVal('razonSocial',     p.razonSocial);
        setVal('nit',             p.nit);
        setVal('ubicacion',       p.ubicacion);
        setVal('sector',          p.sector);
        setVal('tipoEmpresa',     p.tipoEmpresa);
        setVal('descripcion',     p.descripcion);
        setVal('telefono',        p.telefono);
        setVal('correoContacto',  p.correoContacto);

        // Datos de display (nombre en header de perfil, sidebar)
        setDisplay('perfil-nombre-empresa', p.nombreComercial);
        setDisplay('perfil-sector',         p.sector);
        setDisplay('empresa-nombre-sidebar', p.nombreComercial);

    } catch (err) {
        console.error('Error cargando perfil empresa:', err);
        mostrarToast('danger', 'No se pudo cargar el perfil de la empresa.');
    }

    // ── 2. Guardar cambios ────────────────────────────────────────────────────
    const form = document.getElementById('formPerfilEmpresa');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]') || document.getElementById('btn-guardar');
            if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...'; }

            const payload = {
                nombreComercial: getVal('nombreComercial'),
                razonSocial:     getVal('razonSocial'),
                nit:             getVal('nit'),
                ubicacion:       getVal('ubicacion'),
                sector:          getVal('sector'),
                tipoEmpresa:     getVal('tipoEmpresa'),
                descripcion:     getVal('descripcion'),
                telefono:        getVal('telefono'),
                correoContacto:  getVal('correoContacto'),
            };

            try {
                const res  = await fetch(`${API}/perfil/empresa/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    mostrarToast('success', '✅ Perfil actualizado correctamente.');
                    setDisplay('perfil-nombre-empresa',  payload.nombreComercial);
                    setDisplay('empresa-nombre-sidebar', payload.nombreComercial);
                } else {
                    mostrarToast('danger', data.message || 'Error al guardar.');
                }
            } catch { mostrarToast('danger', 'Error de conexión.'); }
            finally {
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Guardar cambios'; }
            }
        });
    }
});

function setVal(id, value)     { const el = document.getElementById(id); if (el) el.value = value || ''; }
function getVal(id)            { return document.getElementById(id)?.value.trim() || ''; }
function setDisplay(id, text)  { const el = document.getElementById(id); if (el) el.textContent = text || ''; }

function mostrarToast(tipo, msg) {
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:280px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible shadow fade show">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    setTimeout(() => { box.innerHTML = ''; }, 4500);
}
