// detalleEmpleo.js — VISTA_16_DetallesEmpleo_Postulante
const API = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    const params   = new URLSearchParams(window.location.search);
    const idEmpleo = params.get('id');

    if (!idEmpleo) {
        mostrarError('No se especificó una oferta. <a href="/postulante/empleos">Volver a empleos</a>');
        return;
    }

    try {
        const res  = await fetch(`${API}/empleos/${idEmpleo}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data.data) {
            mostrarError('Esta oferta no existe o ya fue cerrada. <a href="/postulante/empleos">Ver otras ofertas</a>');
            return;
        }
        const e = data.data;

        setTxt('detalle-titulo',         e.titulo);
        setTxt('detalle-empresa',        e.nombreEmpresa);
        setTxt('detalle-ubicacion',      e.ubicacion);
        setTxt('detalle-modalidad',      e.modalidad);
        setTxt('detalle-categoria',      e.categoria);
        setTxt('detalle-vacantes',       `${e.vacantes} vacante${e.vacantes !== 1 ? 's' : ''}`);
        setTxt('detalle-descripcion',    e.descripcion);
        setTxt('detalle-requisitos',     e.requisitos);
        setTxt('detalle-funciones',      e.funciones);
        setTxt('detalle-desc-empresa',   e.descripcionEmpresa);
        setTxt('detalle-sector-empresa', e.sector);

        if (e.salarioMin && e.salarioMax) {
            setTxt('detalle-salario',
                `$${Number(e.salarioMin).toLocaleString('es-SV')} – $${Number(e.salarioMax).toLocaleString('es-SV')}`);
        }
        if (e.fechaVencimiento) {
            setTxt('detalle-vencimiento', new Date(e.fechaVencimiento).toLocaleDateString('es-SV'));
        }

        document.title = `${e.titulo} — ${e.nombreEmpresa} | Portal Empleos`;

        // ── Postulación ──────────────────────────────────────────────────────
        const btnAplicar = document.getElementById('btn-postular');
        if (btnAplicar) {
            // Check if already applied
            try {
                const misApps = await fetch(`${API}/postulaciones/mis-aplicaciones`, { credentials: 'include' });
                const appsData = await misApps.json();
                const yaAplico = (appsData.data || []).some(a => a.idEmpleo === idEmpleo);
                if (yaAplico) {
                    btnAplicar.textContent = '✓ Ya aplicaste';
                    btnAplicar.disabled = true;
                    btnAplicar.classList.replace('btn-primary', 'btn-success');
                } else {
                    btnAplicar.addEventListener('click', aplicar);
                }
            } catch (_) {
                btnAplicar.addEventListener('click', aplicar);
            }
        }

    } catch (err) {
        mostrarError('Error al cargar la oferta.');
        console.error(err);
    }

    async function aplicar() {
        const btn = document.getElementById('btn-postular');
        if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
        try {
            const res = await fetch(`${API}/postulaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idEmpleo, idCandidato: user.idCandidato || user.id })
            });
            const data = await res.json();
            if (res.ok) {
                if (btn) { btn.textContent = '✓ Aplicación enviada'; btn.classList.replace('btn-primary', 'btn-success'); }
                alert('¡Tu aplicación fue enviada con éxito!');
            } else {
                if (btn) { btn.disabled = false; btn.textContent = 'Postularme'; }
                alert(data.message || 'Error al enviar la aplicación.');
            }
        } catch (err) {
            if (btn) { btn.disabled = false; btn.textContent = 'Postularme'; }
            alert('Error de conexión.');
        }
    }
});

function setTxt(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.textContent = val;
}

function mostrarError(msg) {
    const c = document.getElementById('detalle-contenedor') || document.body;
    c.innerHTML = `<div class="container py-5 text-center"><i class="bi bi-exclamation-circle fs-1 text-muted d-block mb-3"></i><p>${msg}</p></div>`;
}
