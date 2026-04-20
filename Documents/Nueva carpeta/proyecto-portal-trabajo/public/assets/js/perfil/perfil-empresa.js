// JS Frontend: Perfil de Empresa
// Conecta /empresa/mi-perfil con GET/PUT /api/perfiles/empresa/me

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    verificarSesion('empleador');
    await cargarPerfil();

    document.getElementById('formEditarEmpresa')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarPerfil();
    });
});

async function cargarPerfil() {
    try {
        const res  = await fetch(`${API_BASE}/perfiles/empresa/me`, { credentials: 'include' });
        if (res.status === 401) { redirigirLogin(); return; }
        const data = await res.json();
        if (!data || data.status !== 'success') return;

        const p = data.data;

        setText('nombreEmpresa',      p.nombreComercial);
        setText('razonSocialEmpresa', p.razonSocial);
        setText('sectorEmpresa',      p.sector);
        setText('tipoEmpresa',        p.tipoEmpresa);
        setText('ubicacionEmpresa',   p.ubicacion);
        setText('telefonoEmpresa',    p.telefono);
        setText('correoEmpresa',      p.correoContacto);
        setText('descripcionEmpresa', p.descripcion);
        setText('nitEmpresa',         p.nit);
        setText('miembroDesde',       p.creadoEl ? formatDate(p.creadoEl) : '');

        if (p.urlLogo) {
            document.querySelectorAll('.logo-empresa').forEach(img => img.src = p.urlLogo);
        }
        if (p.urlBanner) {
            const banner = document.querySelector('.banner-empresa');
            if (banner) banner.style.backgroundImage = `url(${p.urlBanner})`;
        }

        // Pre-llenar formulario de edición
        setVal('editNombreComercial', p.nombreComercial);
        setVal('editRazonSocial',     p.razonSocial);
        setVal('editUbicacion',       p.ubicacion);
        setVal('editTelefono',        p.telefono);
        setVal('editCorreoContacto',  p.correoContacto);
        setVal('editSector',          p.sector);
        setVal('editTipoEmpresa',     p.tipoEmpresa);
        setVal('editDescripcion',     p.descripcion);

    } catch (err) {
        console.error('Error cargando perfil empresa:', err);
    }
}

async function guardarPerfil() {
    const btn = document.querySelector('#formEditarEmpresa [type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

    const payload = {
        nombreComercial: getValue('editNombreComercial'),
        razonSocial:     getValue('editRazonSocial'),
        ubicacion:       getValue('editUbicacion'),
        telefono:        getValue('editTelefono'),
        correoContacto:  getValue('editCorreoContacto'),
        sector:          getValue('editSector'),
        tipoEmpresa:     getValue('editTipoEmpresa'),
        descripcion:     getValue('editDescripcion'),
        urlLogo:         null,
        urlBanner:       null,
    };

    try {
        const res  = await fetch(`${API_BASE}/perfiles/empresa/me`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.status === 'success') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarEmpresa'));
            modal?.hide();
            await cargarPerfil();
            mostrarToast('✅ Perfil actualizado correctamente.');
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

function mostrarToast(msg) {
    let toast = document.getElementById('toastNotif');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotif';
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10B981;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;font-weight:600;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val || ''; }
function setVal(id, val)  { const el = document.getElementById(id); if (el) el.value = val || ''; }
function getValue(id)     { return document.getElementById(id)?.value.trim() || ''; }
function getUsuario()     { try { return JSON.parse(localStorage.getItem('usuario')) || {}; } catch { return {}; } }
function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
}
function verificarSesion(rolRequerido) {
    const usuario = getUsuario();
    if (!usuario?.id) { redirigirLogin(); return; }
    if (rolRequerido && usuario.rol?.toLowerCase() !== rolRequerido) {
        alert('Acceso no autorizado.'); window.location.href = '/';
    }
}
function redirigirLogin() { window.location.href = '../../Publicas//login'; }
