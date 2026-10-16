const formularioLogin = document.querySelector("#formulario-login");

formularioLogin?.addEventListener("submit", (evento) => {
    evento.preventDefault();
    window.location.assign("portfolio.html");
});