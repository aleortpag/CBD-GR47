import pandas as pd
import numpy as np
import time
import tiledb
from src.utils import pintar_verde, pintar_amarillo

tilepath = './datos_meteorologicos'

def leer_todo_tile():
    try:
        start = time.time()

        with tiledb.SparseArray(tilepath, mode="r") as A:
            res = A.query().df[:]
            pintar_amarillo("Resultados busqueda completa en TileDB: "+str(len(res)))

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_amarillo("Tiempo de ejecución en Lectura completa de TileDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def leer_temperatura_mayor_30_tile():
    try:
        start = time.time()

        with tiledb.SparseArray(tilepath, mode="r") as A:
            cond = "Temperature_C > 30"
            res = A.query(cond=cond).df[:]
            #print(res)

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_amarillo("Tiempo de ejecución en Lectura temperatura mayor que 30 en TileDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)
    else:
        pintar_verde("Lectura temperaturas mayor que 30 en TileDB")

def poblar_tile(datos):
    try:
        start = time.time()
        vaciar_tile()

        colp = "Formatted_Date"
        dom = tiledb.Domain(
            tiledb.Dim(name=colp, dtype="ascii", domain=None, tile=None)
        )
        attrs = []
        for col in datos.columns:
            if col == colp:
                continue
            dtype = np.float32 if np.issubdtype(datos[col].dtype, np.number) \
                    else f"U{datos[col].astype(str).str.len().max()}"
            attrs.append(tiledb.Attr(name=col, dtype=dtype))
        schema = tiledb.ArraySchema(domain=dom, attrs=attrs, sparse=True)
        tiledb.SparseArray.create(tilepath, schema)

        with tiledb.SparseArray(tilepath, mode="w") as A:
            A[datos[colp].values] = {
                col: datos[col].astype(
                    np.float32 if np.issubdtype(datos[col].dtype, np.number)
                    else f"U{datos[col].astype(str).str.len().max()}"
                ).values
                for col in datos.columns if col != colp
            }

        end = time.time()
        tiempo_ejecucion = end - start
        pintar_amarillo("Carga correcta en TileDB")
        pintar_amarillo("Tiempo de ejecución en Carga de TileDB: "+str(tiempo_ejecucion)+" segundos")
    except Exception as e:
        print(e)

def vaciar_tile():
    try:
        if tiledb.array_exists(tilepath) or tiledb.array_exists(tilepath):
            tiledb.remove(tilepath)
    except Exception as e:
        print(e)
