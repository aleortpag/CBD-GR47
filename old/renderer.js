const { ipcRenderer } = require('electron');
const { poblar_database } = require('./database.js');
poblar_database();
ipcRenderer.send('mostrar-mensaje', "ENTRA EN JS");

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-poblar-db");
    const div = document.getElementById("mensaje-pruebas");

    boton.addEventListener('click', mensajesPruebas);

    function mensajesPruebas() {
        div.innerText = "Esto es un mensaje de pruebas";
    };
});