// publicarOferta.js — VISTA_27_PublicarOfertaEmpresa
const API = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { window.location.href = '/login'; return; }

    if (!user.idEmpresa) {
        mostrarAlerta('danger', 'No se encontró tu perfil de empresa. Contacta al administrador.');
        return;
    }

    const form = document.getElementById('formPublicarOferta');
    if (!form) { console.warn('No se encontró #formPublicarOferta'); return; }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]') || document.getElementById('btn-publicar');
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Publicando...'; }

        const payload = {
            idEmpresa:       user.idEmpresa,
            titulo:          getVal('titulo'),
            categoria:       getVal('categoria'),
            modalidad:       getVal('modalidad'),
            ubicacion:       getVal('ubicacion'),
            salarioMin:      getVal('salarioMin')  || 0,
            salarioMax:      getVal('salarioMax')  || 0,
            vacantes:        getVal('vacantes')    || 1,
            fechaVencimiento:getVal('fechaVencimiento'),
            descripcion:     getVal('descripcion'),
            requisitos:      getVal('requisitos'),
            funciones:       getVal('funciones'),
        };

        // Validación mínima
        if (!payload.titulo || !payload.descripcion || !payload.requisitos || !payload.funciones) {
            mostrarAlerta('warning', '⚠️ Completa todos los campos obligatorios (título, descripción, requisitos, funciones).');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar oferta'; }
            return;
        }

        try {
            const res  = await fetch(`${API}/empleos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                mostrarAlerta('success', '✅ ¡Oferta publicada con éxito! Redirigiendo...');
                form.reset();
                setTimeout(() => { window.location.href = '/empresa/ofertas'; }, 2000);
            } else {
                const msg = data.errors
                    ? data.errors.map(e => e.msg).join(' · ')
                    : (data.message || 'Error al publicar la oferta.');
                mostrarAlerta('danger', `❌ ${msg}`);
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar oferta'; }
            }
        } catch (err) {
            console.error(err);
            mostrarAlerta('danger', '❌ Error de conexión con el servidor.');
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-send me-1"></i>Publicar oferta'; }
        }
    });
});

function getVal(id) { return document.getElementById(id)?.value.trim() || ''; }

function mostrarAlerta(tipo, msg) {
    let box = document.getElementById('alertBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'alertBox';
        box.style.cssText = 'position:sticky;top:10px;z-index:999;';
        const form = document.getElementById('formPublicarOferta');
        if (form) form.parentNode.insertBefore(box, form);
        else document.body.prepend(box);
    }
    box.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
        ${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
