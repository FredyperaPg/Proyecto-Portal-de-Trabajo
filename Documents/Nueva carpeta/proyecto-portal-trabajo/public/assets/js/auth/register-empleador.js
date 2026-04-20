// JS Frontend: Registro de Empleador
// Conecta VISTA_02_Register_Empleador.html con POST /api/auth/register-empleador

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const form     = document.getElementById('registerEmpleadorForm');
    // BUG FIX #8: El HTML usa id="passwordInput", no id="password"
    const pwdInput = document.getElementById('passwordInput');

    // Indicador de fortaleza de contraseña
    pwdInput?.addEventListener('input', () => {
        const val = pwdInput.value;
        const txt = document.getElementById('strengthText');
        if (!txt) return;
        if (val.length === 0) { txt.textContent = 'Escribe tu contraseña'; txt.className = 'text-muted'; return; }
        if (val.length < 6)   { txt.textContent = '⚠️ Contraseña muy corta'; txt.className = 'text-warning'; return; }
        if (val.length < 8)   { txt.textContent = '🔶 Contraseña débil'; txt.className = 'text-warning'; return; }
        const hasNum = /\d/.test(val);
        const hasSym = /[!@#$%^&*]/.test(val);
        if (hasNum && hasSym)  { txt.textContent = '✅ Contraseña fuerte'; txt.className = 'text-success'; }
        else                   { txt.textContent = '🔷 Contraseña aceptable'; txt.className = 'text-primary'; }
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const terms = document.getElementById('terms');
        if (terms && !terms.checked) {
            mostrarAlerta('warning', '⚠️ Debes aceptar los Términos de Servicio.');
            return;
        }

        const btn = document.getElementById('btnRegistro');
        setLoading(btn, true);

        // BUG FIX #2: El campo del usuario debe llamarse 'email' (no 'correo')
        // para que coincida con lo que espera el backend (validators.js y authService.js).
        // BUG FIX #8: La contraseña está en id="passwordInput", no id="password"
        const payload = {
            nombres:       getValue('nombres'),
            apellidos:     getValue('apellidos'),
            email:         getValue('email'),          // FIX: era 'correo'
            password:      pwdInput ? pwdInput.value.trim() : '', // FIX: usa la variable directa
            nombreEmpresa: getValue('nombreEmpresa'),
            razonSocial:   getValue('razonSocial'),
            nit:           getValue('nit'),
            ubicacion:     getValue('ubicacion'),
            sector:        getValue('sector'),
            tipoEmpresa:   getValue('tipoEmpresa'),
            descripcion:   getValue('descripcion'),
            telefono:      getValue('telefono'),
            correoEmpresa: getValue('correoEmpresa'),
        };

        // Validación básica cliente
        if (!payload.nombres || !payload.email || !payload.password || !payload.nit) {
            mostrarAlerta('warning', '⚠️ Completa todos los campos obligatorios.');
            setLoading(btn, false, '<i class="bi bi-person-plus-fill me-2"></i>Crear cuenta gratis');
            return;
        }

        try {
            const res  = await fetch(`${API_BASE}/auth/register-empleador`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                mostrarAlerta('success', `✅ ¡Empresa registrada exitosamente! Redirigiendo al login...`);
                form.reset();
                // BUG FIX #4: Ruta correcta relativa desde /Publicas/
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const msg = data.errors
                    ? data.errors.map(e => e.msg).join('<br>')
                    : (data.message || 'Error al registrarse.');
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
        ? '<span class="spinner-border spinner-border-sm me-2"></span>Registrando empresa...'
        : originalHTML;
}

function mostrarAlerta(tipo, mensaje) {
    let box = document.getElementById('alertBox');
    if (!box) {
        const form = document.getElementById('registerEmpleadorForm');
        box = document.createElement('div');
        box.id = 'alertBox';
        form.parentNode.insertBefore(box, form);
    }
    box.className = `alert alert-${tipo} alert-dismissible fade show`;
    box.innerHTML = `${mensaje} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
