from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["cbd"]
collection = db["registros_meteorologicos"]

def poblar_mongo(datos):
    try:
        vaciar_mongo()
        d = datos.to_dict("records")
        collection.insert_many(d)
    except Exception as e:
        print(e)
    else:
        print('Carga correcta en MongoDB')

def vaciar_mongo():
    try:
        collection.delete_many({})
    except Exception as e:
        print(e)