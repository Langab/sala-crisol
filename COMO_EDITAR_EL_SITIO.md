# Cómo editar el sitio de Sala Crisol 🔥

Este sitio es **estático**: no necesita servidor, base de datos ni mantenciones.

**Está publicado en:** https://salacrisol.cl/

## Dónde llegan las inscripciones

Todos los botones y formularios abren WhatsApp con el mensaje ya escrito y lo
mandan al número de la sala, configurado en `js/config.js`:

```js
whatsapp: "56991757042",   // +56 9 9175 7042 (Consuelo)
```

Si algún día cambia, edita esa línea: código de país + número, sin `+` y sin
espacios. Con eso quedan actualizados los 11 botones y los formularios de una vez.

## Ediciones de cada mes (5 minutos)

Todo se hace en `js/config.js`:

- **Mes visible en portada**: cambia `mesActual: "Agosto"`.
- **Cupos disponibles**: en cada taller, edita `cuposDisponibles`. Cuando alguien
  se inscribe, réstale 1. Si pones `0` aparece "Sin cupos"; si pones `null` no
  se muestran cupos.
- **Horarios**: edita `dia` y `hora` de cada taller, y la sección `grilla`
  (lo que se pinta en la tabla semanal de la portada).
- **Precios**: edita los textos de `precios` (son texto libre).
- **Taller pausado**: cambia `estado: "activo"` por `estado: "pronto"` para que
  aparezca "Nueva fecha por anunciar".

## Cuando haya una nueva tertulia

1. Guarda el afiche en `img/` (ej: `img/poster-tertulia-4.jpg`).
2. En `index.html`, busca `<!-- Próxima tertulia (marco vacío) -->` y copia el
   bloque de una tertulia anterior, cambiando imagen, título, fecha y color
   (`--acento-afiche`). Deja el marco vacío al final para la tertulia 05.

## Para agregar un taller nuevo

1. Agrega el bloque en `talleres: [...]` de `js/config.js` (copia uno existente
   y cambia los datos). Con eso ya aparece en la portada, la cinta y la grilla.
2. Duplica una página de `talleres/` (ej: copia `capoeira.html`), renómbrala
   igual que la `pagina` que pusiste en config, y edita los textos.
3. Agrégala al menú desplegable de todas las páginas (busca `nav__despliegue`).

## Videos 🎥

Los reels de Instagram no se pudieron descargar automáticamente, pero el sitio
está listo para recibirlos:

- **Opción simple**: descarga tu reel (en Instagram: ⋯ → Guardar, o con la app
  oficial de Meta), guárdalo como `img/video-clase.mp4` y en la página del
  taller reemplaza la `<img>` del hero por:
  ```html
  <video src="../img/video-clase.mp4" autoplay muted loop playsinline
         style="width:100%; height:100%; object-fit:cover;"></video>
  ```
- Videos cortos (10–20 s), en silencio y en loop = página viva sin marear.

## Estructura de archivos

```
sala_crisol_web/
├── index.html            ← portada
├── nosotros.html         ← página "Nosotras"
├── talleres/             ← una página por taller
├── css/estilo.css        ← todos los estilos (colores arriba del archivo)
├── js/config.js          ← ★ EL ARCHIVO QUE SE EDITA ★
├── js/main.js            ← funcionamiento (no tocar)
└── img/                  ← fotos, flyers y afiches
```

## Cómo se publican los cambios

El sitio vive en GitHub Pages (repo `Langab/sala-crisol`). **Guardar el archivo
no basta**: hay que subir los cambios. Desde la carpeta `sala_crisol_web`:

```bash
git add -A && git commit -m "Actualizo horarios y cupos" && git push
```

En 1–2 minutos https://salacrisol.cl/ queda actualizado.
(Si no ves el cambio, recarga con Ctrl+Shift+R / Cmd+Shift+R.)

### Si prefieres no usar la terminal

En https://github.com/Langab/sala-crisol puedes abrir `js/config.js`, tocar el
lápiz ✏️, editar ahí mismo y darle "Commit changes". Se publica solo.

## Ojo con la vista previa al compartir

Cuando pegues el link en Instagram o WhatsApp, la imagen que aparece está
definida en cada página en la etiqueta `og:image`. Hoy la portada usa la foto
grupal de flexibilidad. Si la cambias, usa una imagen horizontal — las
cuadradas se ven chicas en la vista previa.
