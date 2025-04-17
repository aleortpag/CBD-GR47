const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = '';
const COLLECTION_NAME = '';


async function poblar_database() {
    const client = new MongoClient(MONGO_URI);

    try{
        await client.connect();
        ipcRenderer.send('mostrar-mensaje', "Conectado a la db");

        
    }catch{
        ipcRenderer.send('mostrar-error', "Error al conectar a la db");
    }finally{

    }

}

module.exports = { poblar_database };
