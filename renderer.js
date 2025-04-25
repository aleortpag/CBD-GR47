const { ipcRenderer } = require('electron');
const { abrirConexion, cerrarConexion, limpiarDB } = require('./database.js');
const { scrapping } = require('./scrapping.js');

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-poblar-db");
    const div = document.getElementById("div-resultados");

    boton.addEventListener('click', poblarDB);
});

async function poblarDB() {
  ipcRenderer.send('mostrar-mensaje', "Boton pulsado");
  await abrirConexion();
  await limpiarDB();
  await scrapping();
  await cerrarConexion();
  ipcRenderer.send('mostrar-resultado', "Se ha completado la carga de la db");
}

async function mostrarJuegos(){
  
}