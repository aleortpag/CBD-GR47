from src.lector_csv import poblar_databases
from src.gestor_mongodb import leer_todo_mongo
from src.gestor_tiledb import leer_todo_tile, leer_temperatura_mayor_30_tile

def main():
    #poblar_databases()
    print("-------------------------------------------------------")
    leer_todo_mongo()
    leer_todo_tile()
    print("-------------------------------------------------------")
    #leer_temperatura_mayor_30_tile()
    

if __name__ == "__main__":
    main()
