# Fotos y afiches de cada clase

**La carpeta manda.** La web lee lo que hay acá; no hay que tocar código.

```
img/talleres/
├── pilates-mat/
│   ├── flyer.jpg        ← la portada (tarjeta del inicio + cabecera de su página)
│   └── fotos/
│       ├── 01.jpg       ← galería "La clase por dentro"
│       ├── 02.jpg
│       └── 03.jpg
├── danza-contemporanea/
├── movimiento-flexible/
├── equilibrio-de-manos/
├── danza-filosofia/
└── bellydance-fusion/
```

## Cambiar el afiche de una clase

Reemplaza `flyer.jpg` de esa carpeta. Mismo nombre, siempre `.jpg`.
Si una clase todavía no tiene afiche, la web usa su `fotos/01.jpg`;
y si tampoco hay fotos, dibuja una portada de tela con sus iniciales.

## Agregar o quitar fotos

Deja los archivos numerados **01.jpg, 02.jpg, 03.jpg…** y listo.

⚠️ **La numeración no puede tener huecos.** La web las va pidiendo en
orden y se detiene en la primera que falta: si borras la `02`, la `03`
deja de verse. Al eliminar una foto, renumera las que siguen.

Se muestran hasta 12 por clase, en el orden de los números.

## Afiche vs. foto

Un afiche se muestra **entero** (para no cortar horarios ni el título) y
una foto **llena** el marco. Por defecto se asume afiche. Si la portada
de una clase es una foto, agrega `portadaEsFoto: true` en su ficha de
`js/config.js` — es lo único de imágenes que sigue viviendo ahí.

## Tamaños recomendados

- **flyer.jpg**: vertical, proporción 4:5 (ej. 1080×1350)
- **fotos**: cualquier proporción; se recortan cuadradas en la galería
