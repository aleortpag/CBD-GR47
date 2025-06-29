const { ipcRenderer } = require('electron');
const { abrirConexion, cerrarConexion, limpiarDB, buscarTodosJuegos, buscarJuegoPorNombre, buscarJuegoPorVarios,
  distinctPlataformas, distinctDesarrolladores, distinctPublicadores, distinctGeneros } = require('./database.js');
const { scrapping } = require('./scrapping.js');

const botonPoblarDB = document.getElementById("btn-poblar-db");
const botonMostrarTodosJuegos = document.getElementById("btn-mostrar-todos-juegos");
const botonBuscarJuegos = document.getElementById("btn-buscar-juegos");

const divFormularioBusqueda = document.getElementById("div-formulario-busqueda");
const divResultados = document.getElementById("div-resultados");
const divDetalles = document.getElementById("div-resultados");

botonPoblarDB.addEventListener('click', poblarDB);
botonMostrarTodosJuegos.addEventListener('click', mostrarTodosJuegos);
botonBuscarJuegos.addEventListener('click', mostrarFormularioBusqueda);


async function poblarDB() {
  try {
    ipcRenderer.send('mostrar-mensaje', "Boton pulsado");
    await abrirConexion();
    await limpiarDB();
    await scrapping();
    await cerrarConexion();
    ipcRenderer.send('mostrar-resultado', "Se ha completado la carga de la db");
  } catch (error) {
    ipcRenderer.send('mostrar-error', error);
  }
}

async function limpiarDivs() {
  divFormularioBusqueda.innerHTML = "";
  divResultados.innerHTML = "";
  divDetalles.innerHTML = "";
}

async function mostrarListaJuegos(lista) {
  try {
    if (lista.length !== 0) {
      limpiarDivs();
      lista.forEach(j => {
        const juegoBoton = document.createElement('button');
        juegoBoton.textContent = j.nombre;
        juegoBoton.addEventListener('click', () => mostrarDetallesJuego(j.nombre));
        divResultados.append(juegoBoton);
      });
    } else {
      ipcRenderer.send('mostrar-mensaje', "La lista de juegos esta vacia");
    }
  } catch (error) {
    ipcRenderer.send('mostrar-error', error);
  }
}

async function mostrarTodosJuegos() {
  try {
    await abrirConexion();
    const juegos = await buscarTodosJuegos();
    await cerrarConexion();
    mostrarListaJuegos(juegos);
  } catch (error) {
    ipcRenderer.send('mostrar-error', error);
  }
}

async function mostrarDetallesJuego(nombre) {
  try {
    limpiarDivs();
    await abrirConexion();
    const resConsulta = await buscarJuegoPorNombre(nombre);
    const juego = resConsulta[0];
    await cerrarConexion();
    const detallesCard = document.createElement('div');
    detallesCard.classList.add('detalle-card');
    detallesCard.innerHTML = `
      <h2>${juego.nombre}</h2>
      <p><strong>Plataformas:</strong> ${juego.plataformas.join(', ')}</p>
      <p><strong>Fecha de Lanzamiento:</strong> ${juego.fechaLanzamiento}</p>
      <p><strong>Metascore:</strong> ${juego.metascore}</p>
      <p><strong>User Score:</strong> ${juego.userScore}</p>
      <p><strong>Desarrolladores:</strong> ${juego.desarrolladores.join(', ')}</p>
      <p><strong>Publicador:</strong> ${juego.publicador}</p>
      <p><strong>Géneros:</strong> ${juego.generos.join(', ')}</p>
      <p><strong>Enlace:</strong> <a href="${juego.enlace}" target="_blank" class="enlace-juego">Ver en Metacritic</a></p>
    `;
    divDetalles.append(detallesCard);
  } catch (error) {
    ipcRenderer.send('mostrar-error', error);
  }
}

async function mostrarFormularioBusqueda() {
  try {
    limpiarDivs();
    await abrirConexion();
    const opcionesPlataforma = await distinctPlataformas();
    const opcionesDesarrollador = await distinctDesarrolladores();
    const opcionesPublicador = await distinctPublicadores();
    const opcionesGenero = await distinctGeneros();
    await cerrarConexion();

    // Inicio formulario
    const form = document.createElement('form');
    const submit = document.createElement('button');
    submit.type = "submit";
    submit.textContent = "Buscar";

    // Input nombre
    const nombreLabel = document.createElement('label');
    nombreLabel.setAttribute('for', 'nombre');
    nombreLabel.textContent = "Nombre del Juego: ";
    const nombreInput = document.createElement('input');
    nombreInput.type = "text";
    nombreInput.id = "input-nombre";
    nombreInput.name = "nombre";
    form.appendChild(nombreLabel);
    form.appendChild(nombreInput);

    // Select plataforma
    const plataformaLabel = document.createElement('label');
    plataformaLabel.setAttribute('for', 'select-plataforma');
    plataformaLabel.textContent = "Plataforma: ";
    const plataformaSelect = document.createElement('select');
    plataformaSelect.id = "select-plataforma";
    const opcionVaciaPlataforma = document.createElement('option');
    opcionVaciaPlataforma.textContent = "--";
    opcionVaciaPlataforma.value = "--";
    plataformaSelect.appendChild(opcionVaciaPlataforma);
    opcionesPlataforma.forEach((el) => {
      const opcion = document.createElement('option');
      opcion.textContent = el;
      opcion.value = el;
      plataformaSelect.appendChild(opcion);
    });
    form.appendChild(plataformaLabel);
    form.appendChild(plataformaSelect);

    // Select desarrollador
    const desarrolladorLabel = document.createElement('label');
    desarrolladorLabel.setAttribute('for', 'select-desarrollador');
    desarrolladorLabel.textContent = "Desarrollador: ";
    const desarrolladorSelect = document.createElement('select');
    desarrolladorSelect.id = "select-desarrollador";
    const opcionVaciaDesarrollador = document.createElement('option');
    opcionVaciaDesarrollador.textContent = "--";
    opcionVaciaDesarrollador.value = "--";
    desarrolladorSelect.appendChild(opcionVaciaDesarrollador);
    opcionesDesarrollador.forEach((el) => {
      const opcion = document.createElement('option');
      opcion.textContent = el;
      opcion.value = el;
      desarrolladorSelect.appendChild(opcion);
    });
    form.appendChild(desarrolladorLabel);
    form.appendChild(desarrolladorSelect);

    // Select publicador
    const publicadorLabel = document.createElement('label');
    publicadorLabel.setAttribute('for', 'select-publicador');
    publicadorLabel.textContent = "Publicador: ";
    const publicadorSelect = document.createElement('select');
    publicadorSelect.id = "select-publicador";
    const opcionVaciaPublicador = document.createElement('option');
    opcionVaciaPublicador.textContent = "--";
    opcionVaciaPublicador.value = "--";
    publicadorSelect.appendChild(opcionVaciaPublicador);
    opcionesPublicador.forEach((el) => {
      const opcion = document.createElement('option');
      opcion.textContent = el;
      opcion.value = el;
      publicadorSelect.appendChild(opcion);
    });
    form.appendChild(publicadorLabel);
    form.appendChild(publicadorSelect);

    // Select genero
    const generoLabel = document.createElement('label');
    generoLabel.setAttribute('for', 'select-genero');
    generoLabel.textContent = "Genero: ";
    const generoSelect = document.createElement('select');
    generoSelect.id = "select-genero";
    const opcionVaciaGenero = document.createElement('option');
    opcionVaciaGenero.textContent = "--";
    opcionVaciaGenero.value = "--";
    generoSelect.appendChild(opcionVaciaGenero);
    opcionesGenero.forEach((el) => {
      const opcion = document.createElement('option');
      opcion.textContent = el;
      opcion.value = el;
      generoSelect.appendChild(opcion);
    });
    form.appendChild(generoLabel);
    form.appendChild(generoSelect);

    // Configuracion formulario
    form.appendChild(submit);
    divFormularioBusqueda.appendChild(form);

    form.addEventListener('submit', async (res) => {
      res.preventDefault();
      await abrirConexion();
      const juegos = await buscarJuegoPorVarios();
      await cerrarConexion();
      mostrarListaJuegos(juegos);
    });
  } catch (error) {
    ipcRenderer.send('mostrar-error', error);
  }
}