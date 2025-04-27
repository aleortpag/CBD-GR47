const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'cbd';
const COLLECTION_NAME = 'juegos';

let client = new MongoClient(MONGO_URI);
let collection;
let conectado = false;

async function abrirConexion() {
    try {
        if (conectado) {
            ipcRenderer.send('mostrar-mensaje', "Ya estas conectado a MongoDB");
        } else {
            await client.connect();
            const db = client.db(DB_NAME);
            collection = db.collection(COLLECTION_NAME);
            ipcRenderer.send('mostrar-resultado', "Conectado a Mongodb");
            conectado = true;
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function cerrarConexion() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-mensaje', "La conexion ya estaba cerrada");
        } else {
            await client.close();
            ipcRenderer.send('mostrar-resultado', "Conexion a Mongodb cerrada");
            conectado = false;
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function guardarJuego(juego) {
    const existente = await collection.findOne({ nombre: juego.nombre });
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
        } else if (existente) {
            ipcRenderer.send('mostrar-error', "El juego " + juego.nombre + " ya existe en db");
        } else {
            await collection.insertOne(juego);
            ipcRenderer.send('mostrar-mensaje', "El juego " + juego.nombre + " se ha guardado en db");
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function limpiarDB() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
        } else {
            await collection.deleteMany({});
            ipcRenderer.send('mostrar-resultado', "Se ha vaciado la db");
        }
    } catch {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function buscarTodosJuegos() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            const juegos = await collection.find({}).toArray();
            ipcRenderer.send('mostrar-mensaje', "Todos los juegos extraidos de la DB");
            return juegos;
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function buscarJuegoPorNombre(nombre) {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            const juego = await collection.find({ nombre: nombre }).toArray();
            ipcRenderer.send('mostrar-mensaje', "Juego extraido de la DB");
            return juego;
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function buscarJuegoPorVarios() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            const nombre = document.getElementById("input-nombre").value;
            const plataforma = document.getElementById("select-plataforma").value;
            const desarrollador = document.getElementById("select-desarrollador").value;
            const publicador = document.getElementById("select-publicador").value;
            const genero = document.getElementById("select-genero").value; 
            const filtro = {};
            if (nombre !== "") {
                filtro.nombre = { $regex: nombre, $options: 'i' };
            }
            if(plataforma !== "--"){
                filtro.plataformas = { $in: [plataforma] };
            }
            if(desarrollador !== "--"){
                filtro.desarrolladores = { $in: [desarrollador] };
            }
            if(publicador !== "--"){
                filtro.publicador = { $in: [publicador] };
            }
            if(genero !== "--"){
                filtro.generos = { $in: [genero] };
            }
            const juegos = await collection.find(filtro).toArray();
            if (juegos.length === 0) {
                return [];
            } else {
                ipcRenderer.send('mostrar-mensaje', "Juegos buscados extraidos de la DB");
                return juegos;
            }
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function distinctPlataformas() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            return await collection.distinct('plataformas');
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function distinctDesarrolladores() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            return await collection.distinct('desarrolladores');
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function distinctPublicadores() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            return await collection.distinct('publicador');
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

async function distinctGeneros() {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
            return [];
        } else {
            return await collection.distinct('generos');
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

module.exports = {
    abrirConexion, cerrarConexion, guardarJuego, limpiarDB, buscarJuegoPorNombre, buscarTodosJuegos,
    buscarJuegoPorVarios, distinctPlataformas, distinctDesarrolladores, distinctPublicadores, distinctGeneros
};
