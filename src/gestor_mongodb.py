from pymongo import MongoClient
from src.utils import pintar_verde
import time

client = MongoClient("mongodb://localhost:27017/")
db = client["cbd"]
collection = db["datos_meteorologicos"]

def leer_todo_mongo():
    try:
        start = time.time()

        res = list(collection.find())
        pintar_verde("Resultados busqueda completa en MongoDB: "+str(len(res)))

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_verde("Tiempo de ejecución en Lectura completa de MongoDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def leer_temperatura_mayor_30_mongo():
    try:
        start = time.time()

        query = {"Temperature_C": {"$gt": 30}}
        res = list(collection.find(query))
        pintar_verde("Resultados busqueda temperatura mayor que 30 en MongoDB: "+str(len(res)))

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_verde("Tiempo de ejecución en Lectura temperatura mayor que 30 en MongoDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def leer_tiempo_despejado_mongo():
    try:
        start = time.time()

        query = {"Summary": "Clear"}
        res = list(collection.find(query))
        pintar_verde("Resultados busqueda tiempo despejado en MongoDB: "+str(len(res)))

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_verde("Tiempo de ejecución en Lectura tiempo despejado en MongoDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def leer_varias_condiciones_mongo():
    try:
        start = time.time()

        query = {
            "Humidity": {"$lt": 0.4},
            "Wind_Speed_kmh": {"$gt": 15},
            "Pressure_millibars": {"$lt": 1000}
}
        res = list(collection.find(query))
        pintar_verde("Resultados busqueda varias condiciones en MongoDB: "+str(len(res)))

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_verde("Tiempo de ejecución en Lectura varias condiciones en MongoDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def poblar_mongo(datos):
    try:
        start = time.time()
        vaciar_mongo()
        d = datos.to_dict("records")
        collection.insert_many(d)
        end = time.time()
        tiempo_ejecucion = end - start
        pintar_verde("Carga correcta en MongoDB")
        pintar_verde("Tiempo de ejecución en Carga de MongoDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)        

def vaciar_mongo():
    try:
        collection.delete_many({})
    except Exception as e:
        print(e)