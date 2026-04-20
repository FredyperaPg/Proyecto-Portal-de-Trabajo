// adminUsuarios.js — VISTA_31_UsuariosAdmin
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.rol !== 'admin') { window.location.href = '/login'; return; }

    // Nombre
    const nombre = user.nombre || user.nombres || 'Admin';
    ['userNameDisplay','admin-nombre','sidebar-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = nombre;
    });

    // Logout
    document.querySelectorAll('#logoutBtn, [data-logout]').forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            try { await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }); } catch (_) {}
            localStorage.clear();
            window.location.href = '/login';
        });
    });

    await cargarUsuarios();

    // Filtros
    document.getElementById('filtro-rol')?.addEventListener('change', cargarUsuarios);
    document.getElementById('filtro-estado')?.addEventListener('change', cargarUsuarios);
    document.getElementById('input-busqueda')?.addEventListener('input', cargarUsuarios);
});

async function cargarUsuarios() {
    const tabla = document.getElementById('tabla-usuarios') || document.getElementById('contenedor-usuarios');
    if (!tabla) return;

    tabla.innerHTML = skeletonRows(5);

    try {
        const res   = await fetch(`${API}/perfil/admin/usuarios`, { credentials: 'include' });
        const data  = await res.json();
        let usuarios = data.data || [];

        // Filtros locales
        const filtroRol    = document.getElementById('filtro-rol')?.value || '';
        const filtroEstado = document.getElementById('filtro-estado')?.value || '';
        const busqueda     = document.getElementById('input-busqueda')?.value?.toLowerCase() || '';

        if (filtroRol)    usuarios = usuarios.filter(u => u.rol === filtroRol);
        if (filtroEstado) usuarios = usuarios.filter(u => u.estado === filtroEstado);
        if (busqueda)     usuarios = usuarios.filter(u =>
            `${u.nombres} ${u.apellidos} ${u.email}`.toLowerCase().includes(busqueda));

        const contador = document.getElementById('stats-contador');
        if (contador) contador.textContent = `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''}`;

        if (usuarios.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">
                <i class="bi bi-people me-2"></i>No se encontraron usuarios.
            </td></tr>`;
            return;
        }

        tabla.innerHTML = usuarios.map(u => `
            <tr>
                <td>
                    <div class="fw-bold">${escHtml(u.nombres)} ${escHtml(u.apellidos)}</div>
                    <small class="text-muted">${escHtml(u.email)}</small>
                </td>
                <td><span class="badge ${rolBadge(u.rol)}">${escHtml(u.rol)}</span></td>
                <td><span class="badge ${u.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">${escHtml(u.estado)}</span></td>
                <td><small class="text-muted">${u.creadoEl ? new Date(u.creadoEl).toLocaleDateString('es-SV') : '—'}</small></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="/admin/usuario/perfil?id=${u.id}" class="btn btn-sm btn-outline-primary">Ver</a>
                        <button class="btn btn-sm ${u.estado === 'activo' ? 'btn-outline-warning' : 'btn-outline-success'}"
                            onclick="toggleEstado('${u.id}','${u.estado === 'activo' ? 'inactivo' : 'activo'}',this)">
                            ${u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>`).join('');

    } catch (err) {
        tabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">
            <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar usuarios.
        </td></tr>`;
    }
}

window.toggleEstado = async (id, nuevoEstado, btn) => {
    if (!confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) return;
    btn.disabled = true;
    try {
        const res = await fetch(`${API}/perfil/admin/usuario/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (res.ok) await cargarUsuarios();
        else alert('Error al actualizar el estado');
    } catch (_) {
        alert('Error de conexión');
    } finally {
        btn.disabled = false;
    }
};

function rolBadge(rol) {
    return rol === 'admin' ? 'bg-danger' : rol === 'empleador' ? 'bg-primary' : 'bg-success';
}
function skeletonRows(n) {
    return Array(n).fill(0).map(() => `
        <tr>${Array(5).fill(0).map(() => `
            <td><div class="placeholder-glow"><span class="placeholder col-8"
                style="height:12px;border-radius:4px;display:block;"></span></div></td>`).join('')}
        </tr>`).join('');
}
function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
