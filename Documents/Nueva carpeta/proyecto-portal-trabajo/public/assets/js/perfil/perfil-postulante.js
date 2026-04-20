// JS Frontend: Perfil del Postulante
// Conecta /postulante/perfil con GET/PUT /api/perfiles/candidato/me

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    verificarSesion('candidato');
    await cargarPerfil();

    document.getElementById('formInfoPersonal')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarInfoPersonal();
    });
});

async function cargarPerfil() {
    try {
        const res = await fetch(`${API_BASE}/perfiles/candidato/me`, { credentials: 'include' });
        if (res.status === 401) { redirigirLogin(); return; }
        const data = await res.json();
        if (!data || data.status !== 'success') return;

        const p = data.data;

        setText('nombreCompleto',    `${p.nombres} ${p.apellidos}`);
        setText('tituloPerfil',      p.titulo || 'Sin título profesional');
        setText('profesionPerfil',   p.profesion || '');
        setText('experienciaPerfil', p.añosExperiencia ? `${p.añosExperiencia} años de experiencia` : '');
        setText('emailPerfil',       p.email);
        setText('direccionPerfil',   p.direccion || '');
        setText('fechaNacPerfil',    p.fechaNacimiento ? formatDate(p.fechaNacimiento) : '');
        setText('duiPerfil',         p.dui || '');
        setText('miembroDesde',      p.creadoEl ? formatDate(p.creadoEl) : '');

        const foto = p.fotoPerfil || p.urlFoto;
        if (foto) document.querySelectorAll('.foto-perfil').forEach(img => img.src = foto);

        setVal('editUbicacion', p.direccion || '');
        setVal('editEmail',     p.email || '');
    } catch (err) {
        console.error('Error cargando perfil:', err);
    }
}

async function guardarInfoPersonal() {
    const btn = document.querySelector('#formInfoPersonal [type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

    const usuario = getUsuario();
    const payload = {
        nombres:         usuario?.nombres || '',
        apellidos:       usuario?.apellidos || '',
        urlFoto:         null,
        titulo:          null,
        profesion:       null,
        añosExperiencia: null,
        direccion:       document.getElementById('editUbicacion')?.value.trim() || '',
    };

    try {
        const res  = await fetch(`${API_BASE}/perfiles/candidato/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.status === 'success') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalInfoPersonal'));
            modal?.hide();
            await cargarPerfil();
        } else {
            alert('Error: ' + (data.message || 'No se pudo guardar.'));
        }
    } catch (err) {
        alert('Error de conexión.');
        console.error(err);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Guardar cambios'; }
    }
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
}
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
}
function getUsuario() {
    try { return JSON.parse(localStorage.getItem('usuario')) || {}; } catch { return {}; }
}
function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
}
function verificarSesion(rolRequerido) {
    const usuario = getUsuario();
    if (!usuario?.id) { redirigirLogin(); return; }
    if (rolRequerido && usuario.rol?.toLowerCase() !== rolRequerido) {
        alert('Acceso no autorizado.');
        window.location.href = '/';
    }
}
function redirigirLogin() {
    window.location.href = 'public/assets/js/auth/register-postulante.js';
    
}
