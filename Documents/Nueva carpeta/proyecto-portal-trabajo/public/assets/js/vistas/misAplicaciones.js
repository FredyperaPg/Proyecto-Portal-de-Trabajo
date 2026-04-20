// misAplicaciones.js — VISTA_17_MisAplicaciones
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    // Mostrar nombre
    ['userNameDisplay', 'sidebar-nombre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = user.nombre || user.nombres || '';
    });

    const contenedor = document.getElementById('contenedor-aplicaciones');
    const contador   = document.getElementById('stats-aplicaciones');
    if (!contenedor) return;

    contenedor.innerHTML = skeletonRows(4);

    try {
        const res  = await fetch(`${API}/postulaciones/mis-aplicaciones?idUsuario=${user.id}`, { credentials: 'include' });
        const data = await res.json();
        const apps = data.data || [];

        if (contador) contador.textContent = `${apps.length} aplicación${apps.length !== 1 ? 'es' : ''}`;

        if (apps.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-briefcase fs-1 d-block mb-3"></i>
                    <p>Aún no has aplicado a ningún empleo.</p>
                    <a href="/postulante/empleos" class="btn btn-primary btn-sm">Explorar empleos</a>
                </div>`;
            return;
        }

        contenedor.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Empleo</th>
                            <th>Empresa</th>
                            <th>Modalidad</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${apps.map(a => filaAplicacion(a)).join('')}
                    </tbody>
                </table>
            </div>`;
    } catch (err) {
        contenedor.innerHTML = `<div class="text-center text-danger py-4">
            <i class="bi bi-exclamation-triangle me-2"></i>Error al cargar tus aplicaciones.
        </div>`;
    }
});

function filaAplicacion(a) {
    const estadoBadge = {
        'pendiente':  '<span class="badge bg-warning text-dark">Pendiente</span>',
        'revisado':   '<span class="badge bg-info">Revisado</span>',
        'aceptado':   '<span class="badge bg-success">Aceptado</span>',
        'rechazado':  '<span class="badge bg-danger">Rechazado</span>',
    };
    const badge = estadoBadge[a.estado] || `<span class="badge bg-secondary">${a.estado}</span>`;
    const fecha = a.fechaPostulacion ? new Date(a.fechaPostulacion).toLocaleDateString('es-SV') : '';
    return `
        <tr>
            <td class="fw-bold">${escHtml(a.tituloEmpleo)}</td>
            <td>${escHtml(a.nombreEmpresa)}</td>
            <td><small>${escHtml(a.modalidad)}</small></td>
            <td>${badge}</td>
            <td><small class="text-muted">${fecha}</small></td>
            <td>
                <a href="/postulante/empleo/detalle?id=${a.idEmpleo}" class="btn btn-outline-primary btn-sm">Ver oferta</a>
            </td>
        </tr>`;
}

function skeletonRows(n) {
    return `<div class="placeholder-glow">` +
        Array(n).fill(0).map(() =>
            `<div class="placeholder col-12 mb-2" style="height:40px;border-radius:6px;"></div>`
        ).join('') + '</div>';
}

function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
