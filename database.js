const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function conexion_database() {
  try {
    await client.connect();
    console.log('\x1b[32mConectado correctamente a MongoDB\x1b[0m');

    const db = client.db('genoma');
    const coleccion = db.collection('genes');
    await coleccion.insertOne({ nombre: 'Juan', edad: '28' })

    const datos = await coleccion.findOne({ nombre: 'Juan' });
    console.log(datos);
  } finally {
    await client.close();
    console.log('\x1b[32mConexion cerrada correctamente\x1b[0m')
  }
}

module.exports = { conexion_database };
