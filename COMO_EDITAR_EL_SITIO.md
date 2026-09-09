# Cómo editar el sitio de Sala Crisol 🔥

Este sitio es **estático**: no necesita servidor, base de datos ni mantenciones.

**Está publicado en:** https://salacrisol.cl/

---

## Lo importante en tres líneas

1. **Todo el contenido vive en un solo archivo:** `datos/contenido.json`.
2. **Ese archivo se edita desde un panel, sin tocar código.** Clases, horarios,
   cupos, precios, tertulias, fotos, textos: todo.
3. **Nadie tiene que escribir HTML nunca más.** Las páginas son moldes vacíos que
   se llenan solas con lo que dice el panel.

```
Consuelo entra al panel desde el celular
   → cambia un cupo, sube un afiche, publica una tertulia
      → se guarda como un cambio en el repositorio de GitHub
         → el sitio se republica solo
            → en 1 o 2 minutos está en línea
```

Como cada cambio queda registrado, si algo sale mal se devuelve en 30 segundos.

---

## Qué se puede cambiar desde el panel

| | |
|---|---|
| **Clases** | Nombre, profe, frase, nivel, color, textos de la página, foto de la profe, portada, fotos de la galería |
| **Horarios y cupos** | Día, hora, cupos totales y disponibles. El horario semanal de la portada **se arma solo** con esto |
| **Precios** | De cada clase, por separado |
| **Estado de una clase** | Activa · «nueva fecha por anunciar» · oculta |
| **Tertulias** | Afiche, película, fecha, relato, piezas gráficas, fotos de la noche, colores |
| **Domingo Popular** | Fecha, afiche, la jornada hora por hora, aportes en plata y en materiales |
| **Datos de la sala** | WhatsApp, Instagram, dirección del pie, mes visible en la portada |
| **Arriendo** | Los precios |

## Qué NO se puede cambiar desde el panel (y está bien así)

El diseño, los colores del sitio, las tipografías, la estructura de las secciones,
los textos de la portada y el `index.html`. Eso se toca en el código, y es a
propósito: es lo que hace que el sitio se siga viendo bien en seis meses.

Regla que se siguió al armar el panel: **si un campo no cambia nada visible en el
sitio, no va en el panel**. Por eso quedaron fuera «cómo llegar en metro» (está
escrito dentro del texto de la portada), el correo de la sala (no se muestra en
ninguna parte) y la duración de cada clase (ya se lee en el horario). Si alguno
de esos se quiere mostrar algún día, primero hay que pintarlo en la página y
después agregar el campo a los dos paneles.

---

## Cómo se entra al panel

Hay dos paneles montados y **los dos editan lo mismo**. Se puede usar cualquiera.

### Opción A — Pages CMS (la que se usa hoy)

- Se entra en **https://app.pagescms.org** con el correo al que llegó la invitación.
- **No hace falta cuenta de GitHub**: llega un enlace por correo y con eso entra.
- La configuración de los campos está en `.pages.yml`, en la raíz del repositorio.

Para invitar a alguien nuevo: entrar a app.pagescms.org → el repositorio
`Langab/sala-crisol` → colaboradores → invitar por correo.

### Opción B — el panel en el propio dominio

- Se entra en **https://salacrisol.cl/admin/**, en español y desde el celular.
- Falta un paso técnico para que funcione (el intermediario que valida el ingreso
  con GitHub). Está explicado en `_sistema/LEEME_PANEL.md`.
- La configuración de los campos está en `admin/config.yml`.

> Si agregas un campo nuevo en un panel, agrégalo también en el otro. Si no, ese
> campo no se puede editar desde el otro panel.

---

## Las fotos

Hay **dos formas** de que una imagen llegue al sitio, y conviene entender cuál manda.

**1. Desde el panel.** La foto se sube ahí mismo y queda en `img/subidas/`.
Es lo que usan las chicas.

**2. Desde `Recursos_graficos/`.** Benjamín trabaja las imágenes en esa carpeta y
las publica con:

```bash
python3 _sistema/publicar_fotos.py --aplicar
```

Eso las deja en `img/talleres/<clase>/flyer.jpg` y `img/talleres/<clase>/fotos/01.jpg`, `02.jpg`…

**Cuál gana:** si el panel tiene una imagen puesta en el campo «Portada» o en
«Fotos de la clase», **esa manda**. Si esos campos están vacíos, se usa la de la
carpeta. O sea: para volver a la imagen de `Recursos_graficos`, hay que **vaciar
el campo en el panel**, no reemplazar el archivo.

---

## Agregar una clase nueva sin escribir código

1. En el panel, en «Clases», tocar **Agregar**.
2. Llenar nombre, profe, horarios, precios y el **código interno** (minúsculas y
   guiones: `yoga-suave`).
3. Guardar. Listo: ya aparece en la portada, en la cinta y en el horario semanal,
   y tiene su propia página en `talleres/clase.html?id=yoga-suave`.

Si esa clase se queda y merece una dirección más bonita
(`salacrisol.cl/talleres/yoga-suave.html`), Benjamín copia cualquier archivo de
`talleres/`, le cambia el `data-taller-actual` del `<body>`, el `<title>` y las
etiquetas `og:`, y después borra el campo «Página propia» del panel. Nada más:
el contenido lo sigue poniendo el panel.

Con las tertulias funciona igual, con `tertulias/tertulia.html?id=…`.

---

## Estructura de archivos

```
sala_crisol_web/
├── datos/contenido.json   ← ★ TODO EL CONTENIDO DEL SITIO ★
├── .pages.yml             ← qué se puede editar (panel A)
├── admin/                 ← el panel B, en salacrisol.cl/admin/
├── index.html             ← portada
├── nosotros.html          ← página "Nosotras"
├── talleres/              ← una página por clase + clase.html (genérica)
├── tertulias/             ← una página por tertulia + tertulia.html (genérica)
├── css/estilo.css         ← todos los estilos (colores arriba del archivo)
├── js/config.js           ← ajustes técnicos y carga del contenido
├── js/main.js             ← funcionamiento (no tocar)
├── privacidad.html        ← qué hacemos con los datos de quien se inscribe
├── panel.html             ← inscripciones (pide clave, no se indexa)
└── img/
    ├── subidas/           ← lo que suben las chicas desde el panel
    ├── talleres/          ← lo que publica publicar_fotos.py
    └── tertulias/
```

### Los textos con negrita y cursiva

En el panel se escribe **texto normal, no HTML**. Para destacar algo se usan las
mismas marcas de WhatsApp:

- `**así**` sale en **negrita**
- `*así*` sale en *cursiva* (sirve para los títulos de películas)

Cualquier otra cosa que se pegue —código, texto con formato de Word— se muestra
como texto y no rompe la página.

---

## ⚠️ Regla de oro: esta carpeta es pública

Todo lo que esté dentro de `sala_crisol_web/` queda visible en internet, aunque no
haya ningún enlace que lleve hasta ahí. Cualquiera puede escribir la dirección del
archivo y abrirlo. **Eso ahora incluye `datos/contenido.json`**, que se puede
abrir en https://salacrisol.cl/datos/contenido.json.

Así que **nunca** dejes acá dentro:

- claves ni contraseñas de ningún tipo,
- planillas o listas con datos de las alumnas,
- documentos internos, presupuestos, borradores.

Todo eso va en la carpeta `_sistema/`, que está **un nivel más arriba** y no se
publica. Si tienes dudas sobre algo, ahí hay un `LEEME_SEGURIDAD.md`.

---

## Cómo se publican los cambios

**Desde el panel:** se publica solo. No hay que hacer nada más.

**Desde el computador** (cuando Benjamín toca código o publica fotos):

```bash
git add -A && git commit -m "Actualizo la portada" && git push
```

En 1–2 minutos https://salacrisol.cl/ queda actualizado.
(Si no ves el cambio, recarga con Ctrl+Shift+R / Cmd+Shift+R.)

### Para ver el sitio en el computador antes de subirlo

El sitio ahora carga `datos/contenido.json` por red, así que **abrir el
`index.html` con doble clic ya no funciona** (el navegador lo bloquea). Hay que
levantar un servidor local, que es una línea:

```bash
python3 -m http.server 4173
```

Y abrir http://localhost:4173 en el navegador.

---

## Ojo con la vista previa al compartir

Cuando pegues el link en Instagram o WhatsApp, la imagen que aparece está definida
en cada página en la etiqueta `og:image` — y esa **sí** está escrita en el HTML,
no en el panel. Si cambias el afiche de una clase desde el panel, la vista previa
al compartir sigue mostrando el anterior hasta que alguien actualice esa etiqueta.
Usa siempre una imagen horizontal: las cuadradas se ven chicas en la vista previa.
