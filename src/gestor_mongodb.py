from pymongo import MongoClient
from src.utils import pintar_verde, pintar_amarillo
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