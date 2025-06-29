import pandas as pd
import numpy as np
import shutil
import os
import tiledb

tilepath = './registros_meteorologicos'

def leer_tile():
    with tiledb.DenseArray("clima_array", mode="r") as A:
        data = A[:]
        print(data["Temperature (C)"][:10])

def poblar_tile(datos: pd.DataFrame, ruta=tilepath):
    # Si ya existe, lo borramos
    if tiledb.array_exists(ruta) or tiledb.array_exists(ruta):
        tiledb.remove(ruta)

    # Crear esquema de TileDB (como array densamente indexado por fila)
    dom = tiledb.Domain(
        tiledb.Dim(name="row", domain=(0, len(datos) - 1), tile=1000, dtype=np.int32)
    )

    attrs = []
    for col in datos.columns:
        data = datos[col].values
        if np.issubdtype(data.dtype, np.number):
            dtype = np.float32
        else:
            # Codificamos strings como bytes
            data = data.astype(str)
            maxlen = max(len(str(x)) for x in data)
            dtype = f"U{maxlen}"
        attrs.append(tiledb.Attr(name=col, dtype=dtype))

    schema = tiledb.ArraySchema(domain=dom, attrs=attrs, sparse=False)
    tiledb.DenseArray.create(ruta, schema)

    # Escribir los datos
    with tiledb.DenseArray(ruta, mode='w') as A:
        A[:] = {col: datos[col].astype(np.float32 if np.issubdtype(datos[col].dtype, np.number) else f"U{max(len(str(x)) for x in datos[col].values)}").values for col in datos.columns}
    
def vaciar_tile():
    try:
        if os.path.exists(tilepath):
            shutil.rmtree(tilepath)
    except Exception as e:
        print(e)
