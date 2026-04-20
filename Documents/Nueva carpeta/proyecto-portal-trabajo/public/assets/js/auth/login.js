document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');

    // --- 1. Lógica para Ver/Ocultar Contraseña ---
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            eyeIcon.classList.toggle('bi-eye');
            eyeIcon.classList.toggle('bi-eye-slash');
        });
    }

    // --- 2. Lógica de Autenticación (Login) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const correo = document.getElementById('email').value;
            const password = passwordInput.value;

            // URL de tu API en Node.js
            const API_URL = '/api/auth/login';

            try {
                console.log("Enviando credenciales a:", API_URL);
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: correo, password })
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    // --- DINAMISMO ESTILO LINKEDIN ---
                    // Guardamos el objeto 'user' que configuramos en el controlador.
                    // Usamos la llave 'user' para que coincida con lo que el navbar buscará.
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Opcional: Guardar token si implementas JWT después
                    if(data.token) localStorage.setItem('token', data.token);

                    alert('¡Bienvenido de nuevo, ' + data.user.nombre + '!');

                    // Redirección profesional basada en ROL
                    const rol = data.user.rol.toLowerCase();
                    
                    if (rol === 'admin') {
                        window.location.href = '/admin/inicio';
                    } else if (rol === 'empleador' || rol === 'empresa') {
                        window.location.href = '/empresa/inicio';
                    } else {
                        // Postulante
                        // Prueba subiendo un nivel y entrando a Privadas
                        window.location.href = '/postulante/inicio';
                    }
                } else {
                    alert('Error: ' + (data.message || 'Credenciales incorrectas'));
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});