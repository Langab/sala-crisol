#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publica las imágenes de Recursos_graficos en la web.

Tú trabajas en Recursos_graficos/<taller>/ y este script las lleva a
sala_crisol_web/img/ con los nombres que la web espera. No hay que
renombrar nada a mano ni tocar código.

Cómo funciona cada carpeta de taller:

    Recursos_graficos/pilates_esperanza/
    ├── 1_flyers/clases_actuales/  → el afiche pasa a ser la portada
    ├── 1_flyers/eventos_pasados/  → archivo, no se publica
    └── *.jpg (sueltas)            → la galería, numeradas 01, 02, 03…

Uso:
    python3 _sistema/publicar_fotos.py            # muestra qué haría
    python3 _sistema/publicar_fotos.py --aplicar  # lo hace de verdad
"""
import os, sys, shutil, hashlib

AQUI = os.path.dirname(os.path.abspath(__file__))
SITIO = os.path.dirname(AQUI)
RAIZ = os.path.dirname(SITIO)
REC = os.path.join(RAIZ, "Recursos_graficos")
IMG = os.path.join(SITIO, "img")

# carpeta de recursos  →  id de la clase en la web
TALLERES = {
    "pilates_esperanza":             "pilates-mat",
    "danza_contemporanea_esperanza": "danza-contemporanea",
    "movimiento_flexible_consuelo":  "movimiento-flexible",
    "equilibrio_de_manos_consuelo":  "equilibrio-de-manos",
    "danza_filosofia_amar":          "danza-filosofia",
    "bellydance_kathia":             "bellydance-fusion",
}
# Carpetas cuyos archivos se copian tal cual, conservando el nombre.
# La web los busca por ese nombre exacto, así que no se renumeran.
TAL_CUAL = {
    "sala_y_clases": "sala",
    "fundadoras":    "fundadoras",
    "Logos":         "sala",
}
# Los afiches de las tertulias se publican en orden: afiche-01, -02, -03…
TERTULIAS = "tertulias_de_cine"

# No se publican: son archivo. Viven en Recursos_graficos y nada más.
# domingos_populares y talleres_descontinuados son decenas de imágenes
# que la web no referencia; publicarlas solo engordaría el repositorio.

APLICAR = "--aplicar" in sys.argv
firma = lambda p: hashlib.md5(open(p, "rb").read()).hexdigest()
cambios = []


def copiar(origen, destino):
    """Copia solo si cambió. Devuelve True si hubo cambio."""
    if os.path.exists(destino) and firma(origen) == firma(destino):
        return False
    cambios.append(os.path.relpath(destino, SITIO))
    if APLICAR:
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        shutil.copy2(origen, destino)
    return True


def jpgs_sueltas(carpeta):
    """Las fotos que están directamente en la carpeta, sin entrar a 1_flyers."""
    if not os.path.isdir(carpeta):
        return []
    return sorted(f for f in os.listdir(carpeta)
                  if f.lower().endswith((".jpg", ".jpeg")) and not f.startswith("."))


print("Revisando Recursos_graficos…\n")

for origen_dir, clase in TALLERES.items():
    base = os.path.join(REC, origen_dir)
    if not os.path.isdir(base):
        continue
    destino_clase = os.path.join(IMG, "talleres", clase)

    # 1) el afiche vigente pasa a ser flyer.jpg
    fl = os.path.join(base, "1_flyers", "clases_actuales")
    afiches = jpgs_sueltas(fl)
    if len(afiches) > 1:
        print(f"  ⚠ {origen_dir}: hay {len(afiches)} afiches en clases_actuales.")
        print(f"    Deja solo el vigente. Por ahora uso «{afiches[0]}».")
    if afiches:
        if copiar(os.path.join(fl, afiches[0]), os.path.join(destino_clase, "flyer.jpg")):
            print(f"  ✓ {clase}/flyer.jpg  ←  {origen_dir}/…/{afiches[0]}")

    # 2) las fotos sueltas se numeran 01, 02, 03… sin huecos
    fotos = jpgs_sueltas(base)
    dfotos = os.path.join(destino_clase, "fotos")
    for i, f in enumerate(fotos, 1):
        if copiar(os.path.join(base, f), os.path.join(dfotos, "%02d.jpg" % i)):
            print(f"  ✓ {clase}/fotos/%02d.jpg  ←  {origen_dir}/{f}" % i)
    # sobras de una vez anterior (si borraste fotos, que no queden colgando)
    if os.path.isdir(dfotos) and APLICAR:
        for f in sorted(os.listdir(dfotos)):
            if f.endswith(".jpg") and int(f[:2]) > len(fotos):
                os.remove(os.path.join(dfotos, f))
                print(f"  ✗ {clase}/fotos/{f} — ya no está en Recursos")

for origen_dir, destino_rel in TAL_CUAL.items():
    base = os.path.join(REC, origen_dir)
    if not os.path.isdir(base):
        continue
    for f in sorted(os.listdir(base)):
        if f.startswith(".") or not f.lower().endswith((".jpg", ".jpeg", ".svg", ".png")):
            continue
        if copiar(os.path.join(base, f), os.path.join(IMG, destino_rel, f)):
            print(f"  ✓ {destino_rel}/{f}")

# tertulias: los afiches se numeran, las fotos van con su nombre
base = os.path.join(REC, TERTULIAS)
if os.path.isdir(base):
    fl = os.path.join(base, "1_flyers", "clases_actuales")
    for i, f in enumerate(jpgs_sueltas(fl), 1):
        if copiar(os.path.join(fl, f), os.path.join(IMG, "tertulias", "afiche-%02d.jpg" % i)):
            print(f"  ✓ tertulias/afiche-%02d.jpg  ←  {f}" % i)
    for f in jpgs_sueltas(base):
        if copiar(os.path.join(base, f), os.path.join(IMG, "tertulias", "fotos", f)):
            print(f"  ✓ tertulias/fotos/{f}")

print()
if not cambios:
    print("Todo al día. No hay nada que publicar.")
elif APLICAR:
    print(f"{len(cambios)} archivos actualizados.\n")
    print("Ahora súbelo:")
    print('  git add -A && git commit -m "Imágenes nuevas" && git push')
else:
    print(f"{len(cambios)} archivos cambiarían. Para hacerlo de verdad:")
    print("  python3 _sistema/publicar_fotos.py --aplicar")
