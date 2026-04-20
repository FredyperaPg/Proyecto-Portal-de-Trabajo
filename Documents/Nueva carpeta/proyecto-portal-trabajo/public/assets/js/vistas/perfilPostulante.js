// perfilPostulante.js — VISTA_14_PerilPostulante
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    // ── 1. Cargar perfil desde la API ─────────────────────────────────────────
    try {
        const res  = await fetch(`${API}/perfil/postulante/${user.id}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const p = data.data;

        // Datos en el hero del perfil
        setDisplay('perfil-nombre-completo', `${p.nombres} ${p.apellidos}`);
        setDisplay('perfil-titulo',          p.titulo || p.profesion || 'Sin título profesional');
        setDisplay('perfil-experiencia',     p.anosExperiencia ? `${p.anosExperiencia} años de experiencia` : '');
        setDisplay('perfil-email',           p.email);

        // Iniciales en avatar
        const av = document.getElementById('perfil-avatar');
        if (av) av.textContent = iniciales(p.nombres, p.apellidos);

        // Campos del modal de Info Personal (prellenado)
        setVal('editTelefono',  '');     // no está en la tabla base, dejamos vacío
        setVal('editUbicacion', p.direccion);
        setVal('editEmail',     p.email);

    } catch (err) {
        console.error('Error cargando perfil:', err);
        mostrarToast('danger', 'No se pudo cargar tu perfil desde el servidor.');
    }

    // ── 2. Guardar cambios en Info Personal (modal) ───────────────────────────
    const formInfo = document.getElementById('formInfoPersonal');
    if (formInfo) {
        formInfo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = formInfo.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Guardando...';

            const payload = {
                nombres:        user.nombre.split(' ')[0] || user.nombre,
                apellidos:      user.nombre.split(' ').slice(1).join(' ') || '',
                dui:            '',
                fechaNacimiento:'1990-01-01',
                direccion:      getVal('editUbicacion'),
                titulo:         getVal('editLinkedin') ? undefined : undefined,
            };

            try {
                const res = await fetch(`${API}/perfil/postulante/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                    mostrarToast('success', '✅ Perfil actualizado correctamente.');
                    bootstrap.Modal.getInstance(document.getElementById('modalInfoPersonal'))?.hide();
                } else {
                    mostrarToast('danger', data.message || 'Error al guardar.');
                }
            } catch { mostrarToast('danger', 'Error de conexión.'); }
            finally {
                btn.disabled = false;
                btn.innerHTML = 'Guardar cambios';
            }
        });
    }

    // ── 3. Guardar Resumen ─────────────────────────────────────────────────────
    const formResumen = document.getElementById('formResumen');
    if (formResumen) {
        formResumen.addEventListener('submit', (e) => {
            e.preventDefault();
            const texto = getVal('resumenTexto');
            // Mostrar en la sección visible
            const resumenDisplay = document.getElementById('resumen-display');
            if (resumenDisplay) resumenDisplay.textContent = texto;
            bootstrap.Modal.getInstance(document.getElementById('modalResumen'))?.hide();
            mostrarToast('success', '✅ Resumen actualizado.');
        });
    }
});

// ── HELPERS ───────────────────────────────────────────────────────────────────
function setDisplay(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}
function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}
function getVal(id) {
    return document.getElementById(id)?.value.trim() || '';
}
function iniciales(nombres, apellidos) {
    const n = (nombres || '').charAt(0).toUpperCase();
    const a = (apellidos || '').charAt(0).toUpperCase();
    return n + a || '??';
}
function mostrarToast(tipo, msg) {
    // Buscar o crear el contenedor de toast
    let box = document.getElementById('toast-global');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toast-global';
        box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:280px;';
        document.body.appendChild(box);
    }
    box.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible shadow fade show" role="alert">
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    setTimeout(() => { box.innerHTML = ''; }, 4000);
}
