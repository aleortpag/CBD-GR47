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
            ipcRenderer.send('mostrar-resultado', "El juego " + juego.nombre + " se ha guardado en db");
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

async function buscarJuegosPorNombre(nombre) {
    try {
        if (!conectado) {
            ipcRenderer.send('mostrar-error', "No hay conexion con la db");
        } else {
            const juegos = await collection.find({}).toArray();
            return juegos;
        }
    } catch (error) {
        ipcRenderer.send('mostrar-error', error);
    }
}

module.exports = { abrirConexion, cerrarConexion, guardarJuego, limpiarDB, buscarJuegosPorNombre };
