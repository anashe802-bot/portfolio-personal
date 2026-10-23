const formularioLogin = document.querySelector("#formulario-login");
const campoCorreo = document.querySelector("#correo");
const campoContrasena = document.querySelector("#contrasena");
const botonEnviar = document.querySelector("#boton-enviar");
const botonAlternarModo = document.querySelector("#alternar-modo");
const botonBorrarDatos = document.querySelector("#borrar-datos");
const textoAlternativa = document.querySelector("#texto-alternativa");
const mensajeLogin = document.querySelector("#mensaje-login");

const CLAVE_CUENTA = "cuentaPortfolio";
const CLAVE_SESION = "sesionPortfolio";
let creandoCuenta = false;

function mostrarMensaje(texto, esError = false) {
    mensajeLogin.textContent = texto;
    mensajeLogin.style.color = esError ? "#b42318" : "#217a45";
}

function actualizarModo() {
    botonEnviar.innerHTML = creandoCuenta
        ? "Crear cuenta <span aria-hidden=\"true\">↗</span>"
        : "Iniciar sesión <span aria-hidden=\"true\">↗</span>";
    campoContrasena.autocomplete = creandoCuenta ? "new-password" : "current-password";
    textoAlternativa.textContent = creandoCuenta
        ? "¿Ya tienes una cuenta?"
        : "¿Todavía no tienes una cuenta?";
    botonAlternarModo.textContent = creandoCuenta ? "Iniciar sesión" : "Crear cuenta";
    mostrarMensaje("");
}

formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formularioLogin.checkValidity()) {
        formularioLogin.reportValidity();
        return;
    }

    const correo = campoCorreo.value.trim().toLowerCase();
    const contrasena = campoContrasena.value;

    if (creandoCuenta) {
        if (localStorage.getItem(CLAVE_CUENTA)) {
            mostrarCuentaExistente();
            return;
        }

        localStorage.setItem(CLAVE_CUENTA, JSON.stringify({ correo, contrasena }));
        botonBorrarDatos.hidden = false;
        creandoCuenta = false;
        actualizarModo();
        campoCorreo.value = correo;
        campoContrasena.value = "";
        mostrarMensaje("Cuenta creada. Ahora inicia sesión con esos datos.");
        return;
    }

    const cuentaGuardada = localStorage.getItem(CLAVE_CUENTA);

    if (!cuentaGuardada) {
        mostrarCrearCuenta();
        return;
    }

    let cuenta;
    try {
        cuenta = JSON.parse(cuentaGuardada);
    } catch {
        mostrarMensaje("Los datos guardados están dañados. Elimínalos y crea una cuenta nueva.", true);
        return;
    }

    if (!cuenta || typeof cuenta.correo !== "string" || typeof cuenta.contrasena !== "string") {
        mostrarMensaje("Los datos guardados están dañados. Elimínalos y crea una cuenta nueva.", true);
        return;
    }

    if (correo !== cuenta.correo || contrasena !== cuenta.contrasena) {
        mostrarMensaje("El correo o la contraseña son incorrectos.", true);
        return;
    }

    sessionStorage.setItem(CLAVE_SESION, correo);
    window.location.assign("portfolio.html");
});

botonAlternarModo.addEventListener("click", () => {
    creandoCuenta = !creandoCuenta;
    actualizarModo();
});

botonBorrarDatos.addEventListener("click", () => {
    localStorage.removeItem(CLAVE_CUENTA);
    sessionStorage.removeItem(CLAVE_SESION);
    formularioLogin.reset();
    botonBorrarDatos.hidden = true;
    creandoCuenta = false;
    actualizarModo();
    mostrarMensaje("Se eliminaron la cuenta y la sesión guardadas.");
});

function mostrarCrearCuenta() {
    creandoCuenta = true;
    actualizarModo();
    mostrarMensaje("Primero crea una cuenta para poder iniciar sesión.", true);
}

function mostrarCuentaExistente() {
    creandoCuenta = false;
    actualizarModo();
    mostrarMensaje("Ya hay una cuenta guardada. Inicia sesión o elimínala para crear otra.", true);
}

botonBorrarDatos.hidden = !localStorage.getItem(CLAVE_CUENTA);