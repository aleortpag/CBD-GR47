import pandas as pd
from src.gestor_mongodb import poblar_mongo
from src.gestor_tiledb import poblar_tile

filepath = './weatherHistory.csv'

def poblar_databases():
    try:    
        datos = pd.read_csv(filepath)
        datos["Formatted Date"] = pd.to_datetime(datos["Formatted Date"], utc=True, errors="coerce")
        datos = datos.dropna(subset=["Formatted Date"]) 
        datos["Formatted Date"] = datos["Formatted Date"].dt.tz_convert(None)
        datos["Formatted Date"] = datos["Formatted Date"].dt.strftime("%Y-%m-%d %H:%M:%S")
        datos = datos.drop_duplicates(subset=["Formatted Date"])
        datos = datos.rename(columns=lambda x: x.strip().replace(" ", "_").replace("(", "").replace(")", ""))
    except (FileNotFoundError, pd.errors.ParserError) as e:
        print(e)
    else:
        poblar_mongo(datos)
        poblar_tile(datos)
    