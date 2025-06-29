import pandas as pd
from src.gestor_mongodb import poblar_mongo
from src.gestor_zarr import poblar_zarr, vaciar_zarr
from src.gestor_tiledb import poblar_tile, vaciar_tile

filepath = './weatherHistory.csv'

def poblar_databases():
    try:    
        datos = pd.read_csv(filepath)
    except (FileNotFoundError, pd.errors.ParserError) as e:
        print(e)
    else:
        #poblar_mongo(datos)
        #vaciar_tile()
        poblar_zarr(datos)
    