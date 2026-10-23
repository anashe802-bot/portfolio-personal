const CLAVE_SESION = "sesionPortfolio";

if (!sessionStorage.getItem(CLAVE_SESION)) {
    window.location.replace("index.html");
}

document.querySelector("#salir-portfolio")?.addEventListener("click", () => {
    sessionStorage.removeItem(CLAVE_SESION);
});
