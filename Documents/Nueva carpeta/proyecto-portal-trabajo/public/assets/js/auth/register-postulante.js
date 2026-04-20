// JS Frontend: Registro de Postulante
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const form     = document.getElementById('registerPostulanteForm');
    const pwdInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');

    // 1. Ver/Ocultar Contraseña
    toggleBtn?.addEventListener('click', () => {
        const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwdInput.setAttribute('type', type);
        const icon = toggleBtn.querySelector('i');
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });

    // 2. Indicador de fortaleza
    pwdInput?.addEventListener('input', () => {
        const val = pwdInput.value;
        const txt = document.getElementById('strengthText');
        if (!txt) return;
        if (val.length === 0) { txt.textContent = 'Escribe tu contraseña'; txt.className = 'text-muted'; return; }
        if (val.length < 8)   { txt.textContent = '⚠️ Muy corta (mín. 8)'; txt.className = 'text-warning'; return; }
        const hasNum = /\d/.test(val);
        const hasSym = /[!@#$%^&*]/.test(val);
        if (hasNum && hasSym) { txt.textContent = '✅ Contraseña fuerte'; txt.className = 'text-success'; }
        else { txt.textContent = '🔷 Contraseña aceptable'; txt.className = 'text-primary'; }
    });

    // 3. Envío del Formulario
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const terms = document.getElementById('terms');
        if (terms && !terms.checked) {
            mostrarAlerta('warning', '⚠️ Debes aceptar los Términos de Servicio.');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        setLoading(btn, true);

        // BUG FIX #3: El input de email tiene id="correo" en el HTML (VISTA_03),
        // por eso usamos getValue('correo'). El campo del payload se llama 'email'
        // para que coincida con lo que espera el backend (authService.js).
        const payload = {
            nombres:         getValue('nombres'),
            apellidos:       getValue('apellidos'),
            email:           getValue('correo'),       // FIX: el id del input es 'correo'
            password:        getValue('password'),
            dui:             getValue('dui'),
            fechaNacimiento: getValue('fechaNacimiento'),
            telefono:        getValue('telefono'),
            direccion:       getValue('direccion'),
            titulo:          getValue('titulo'),
            anosExperiencia: getValue('anosExperiencia') || 0,
        };

        try {
            const res = await fetch(`${API_BASE}/auth/register-postulante`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                mostrarAlerta('success', `✅ ¡Cuenta creada exitosamente! Redirigiendo...`);
                form.reset();
                // BUG FIX #4: Ruta correcta relativa desde /Publicas/
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const msg = data.errors
                    ? data.errors.map(e => e.msg).join('<br>')
                    : (data.message || 'Error en el registro');
                mostrarAlerta('danger', `❌ ${msg}`);
            }
        } catch (err) {
            console.error(err);
            mostrarAlerta('danger', '❌ No se pudo conectar con el servidor.');
        } finally {
            setLoading(btn, false, '<i class="bi bi-person-plus-fill me-2"></i>Crear cuenta gratis');
        }
    });
});

function getValue(id) {
    return document.getElementById(id)?.value.trim() || '';
}

function setLoading(btn, loading, originalHTML = '') {
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
        ? '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...'
        : originalHTML;
}

function mostrarAlerta(tipo, mensaje) {
    let alertBox = document.getElementById('alertBox');
    if (!alertBox) {
        const form = document.getElementById('registerPostulanteForm');
        alertBox = document.createElement('div');
        alertBox.id = 'alertBox';
        form.parentNode.insertBefore(alertBox, form);
    }
    alertBox.className = `alert alert-${tipo} alert-dismissible fade show mt-3`;
    alertBox.innerHTML = `${mensaje} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
