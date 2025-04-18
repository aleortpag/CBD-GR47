const { ipcRenderer } = require('electron');
const {poblarDatabase} = require('./scrapping.js')

ipcRenderer.send('mostrar-mensaje', "ENTRA EN JS");
poblarDatabase();
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-poblar-db");
    const div = document.getElementById("mensaje-pruebas");

    
    
});