const { ipcRenderer } = require('electron');
//const { conexion_database } = require('./database.js');

ipcRenderer.send('mostrar-mensaje', "ENTRA EN JS");

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-mensaje-pruebas");
    const div = document.getElementById("mensaje-pruebas");

    boton.addEventListener('click', mensajesPruebas);

    function mensajesPruebas() {
        div.innerText = "Esto es un mensaje de pruebas";
    };
});