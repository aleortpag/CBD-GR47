import pandas as pd
import zarr
import numpy as np
import shutil
import os

zarrpath = './registros_meteorologicos'

def poblar_zarr(filepath_csv, ruta_zarr=zarrpath):
    # Leer CSV
    datos = pd.read_csv(filepath_csv)

    # Crear grupo Zarr
    root = zarr.open_group(ruta_zarr, mode="w")

    # Guardar columnas como arrays individuales
    for col in datos.columns:
        data = datos[col].values

        # Si es numérico, lo pasamos a float32
        if np.issubdtype(data.dtype, np.number):
            data = data.astype(np.float32)
        else:
            # Convertimos a cadenas Unicode de longitud fija
            maxlen = max(len(str(x)) for x in data)
            data = data.astype(f"<U{maxlen}")

        # Guardar como array en el grupo Zarr
        root.array(name=col, data=data, chunks=1000, dtype=data.dtype, overwrite=True)

    print(f"Datos guardados exitosamente en '{ruta_zarr}'")

def vaciar_zarr():
    try:
        if os.path.exists(zarrpath):
            shutil.rmtree(zarrpath)
    except Exception as e:
        print(e)