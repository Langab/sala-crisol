# Inscripciones de Sala Crisol · cómo dejarlo funcionando

Hola 👋 Esta guía es para dejar conectado el formulario de la web con una
planilla de Google. No necesitas saber programar: es copiar, pegar y apretar
botones. Tómate unos 10 minutos con calma.

---

## Qué hace esto, en tres líneas

Cuando una alumna se inscribe en el formulario de la página, sus datos viajan
solos a una planilla de Google Cálculo. Ahí quedan guardados: quién es, a qué
clase va, qué día, cuánto paga. Después, desde la página administrativa, puedes
marcar quién asistió y quién ya pagó, y eso se guarda de vuelta en la misma
planilla.

---

## Paso a paso para instalarlo (una sola vez)

### 1. Crear la planilla

1. Entra a tu Google Drive, a la carpeta de Sala Crisol.
2. Botón **+ Nuevo** → **Hojas de cálculo de Google** → **Hoja de cálculo en blanco**.
3. Arriba a la izquierda, donde dice *Hoja de cálculo sin título*, escribe:
   **Inscripciones Sala Crisol**

No armes ninguna columna ni pongas títulos. El sistema crea solo la hoja
"Inscripciones" con todas sus columnas la primera vez que alguien se inscribe.
Si la haces a mano, quedan mal puestas.

### 2. Pegar el código

4. Con la planilla abierta, anda al menú **Extensiones** → **Apps Script**.
   Se abre una pestaña nueva con un editor de código.
5. Vas a ver unas pocas líneas que dicen `function myFunction() {}`.
   **Selecciona todo eso y bórralo.** Tiene que quedar la hoja en blanco.
6. Abre el archivo `_sistema/inscripciones_sheets.gs` (está en la misma carpeta
   que este documento), copia **todo** su contenido y pégalo ahí.
7. Aprieta el ícono del **disquete** 💾 para guardar.

### 3. Publicarlo

8. Arriba a la derecha, botón azul **Implementar** → **Nueva implementación**.
9. Al lado de "Seleccionar tipo" hay un engranaje ⚙️. Aprieta ahí y elige
   **Aplicación web**.
10. Rellena así:
    - **Descripción**: `Inscripciones Sala Crisol` (o lo que quieras)
    - **Ejecutar como**: **Yo** (`tu-correo@gmail.com`)
    - **Quién tiene acceso**: **Cualquier persona**

    Esa última es la que más se equivoca la gente. Tiene que decir
    **Cualquier persona**, no "Cualquier persona con cuenta de Google".

11. Aprieta **Implementar**.
12. Google te va a pedir permisos. Aprieta **Autorizar acceso**, elige tu
    cuenta, y cuando salga la pantalla gris que dice *"Google no ha verificado
    esta aplicación"*, aprieta abajo en **Configuración avanzada** → **Ir a
    Inscripciones Sala Crisol (no seguro)** → **Permitir**.

    Da susto, pero es normal: la aplicación es tuya, la acabas de escribir tú.
    Google avisa eso de todos los scripts propios.

### 4. Copiar la dirección y pegarla en la web

13. Al final te muestra una **URL de la aplicación web**. Es larga y **termina
    en `/exec`**. Cópiala con el botón **Copiar**.
14. Pégala en dos lugares:
    - En el archivo `js/config.js`, en la línea que dice:

      ```js
      inscripcionesURL: "",
      ```

      Queda así (con la URL entre las comillas):

      ```js
      inscripcionesURL: "https://script.google.com/macros/s/AKfy.....A/exec",
      ```

    - En la **página administrativa** (`panel.html`), pestaña **Ajustes**, en el
      campo "URL del Apps Script".

15. Guarda, sube los cambios y listo. Prueba inscribiéndote tú misma a una
    clase: en unos segundos deberías ver tu nombre aparecer en la planilla.

---

### 5. La clave de lectura (esto protege los datos de las alumnas)

La URL `/exec` tiene que estar abierta a *cualquier persona*, si no el
formulario de la web no puede anotar a nadie. Y como esa URL vive en
`js/config.js`, que es un archivo público, **cualquiera que mire el código
de la página la puede encontrar**.

Por eso el script pide una clave para *leer* la lista. Sin ella, quien tenga
la URL solo puede inscribirse; no puede ver los nombres, teléfonos ni correos
de nadie, ni marcarse como pagado.

La clave está dentro de `inscripciones_sheets.gs`, arriba del todo:

```js
var TOKEN_LECTURA = 'HCOA3upzmTG5zewYjc82ijMF';
```

16. Cópiala y pégala en la **página administrativa → Ajustes → "Clave de
    lectura"**. Hay que hacerlo **una vez en cada dispositivo** que use el
    panel (tu teléfono, el de Esperanza, el computador de la sala).
17. **Nunca la pongas en `js/config.js`** ni en ningún archivo de la web
    pública: ahí se vería.

Si alguna vez sospechas que se filtró, cambia ese texto por otro cualquiera,
vuelve a implementar (ver más abajo) y pégalo de nuevo en los paneles. Las
inscripciones no se pierden.

---

## Si después cambias el código

Si alguna vez tocas el archivo `inscripciones_sheets.gs` y lo vuelves a pegar,
**no basta con guardar**. Tienes que ir a **Implementar** → **Administrar
implementaciones** → el **lápiz** ✏️ → en "Versión" elegir **Nueva versión** →
**Implementar**. Si no haces eso, Google sigue mostrando la versión antigua y
parece que tu cambio no hizo nada.

---

## Si algo falla

**Se inscriben y no aparece nada en la planilla.**
Casi siempre es una de estas tres:

1. **Quedó en "/dev" en vez de "/exec".** Mira la URL que pegaste en
   `config.js`. Si termina en `/dev`, esa es la de prueba y solo funciona para
   ti estando con tu sesión abierta. Vuelve al paso 13 y copia la que termina
   en **`/exec`**.

2. **No autorizaste los permisos.** Si en el paso 12 cerraste la ventana o
   apretaste "Cancelar", el script no puede escribir en la planilla. Solución:
   Implementar → Administrar implementaciones → y vuelve a hacer el proceso
   autorizando esta vez.

3. **Pusiste acceso restringido.** Si en "Quién tiene acceso" quedó *Solo yo* o
   *Cualquier persona con cuenta de Google*, las alumnas no pueden mandar nada.
   Anda a Implementar → Administrar implementaciones → lápiz ✏️ → cambia a
   **Cualquier persona** → Implementar.

**Aparece una alumna dos veces.**
Se inscribió dos veces, no es un error del sistema. Puedes marcar una como
cancelada desde la página administrativa.

**Borré una fila sin querer.**
En la planilla: **Archivo** → **Historial de versiones** → **Ver historial de
versiones**, y recuperas la de antes. Google guarda todo.

**Quiero ver solo las de un día o de una clase.**
Además de filtrar en la planilla, puedes pegar esto en el navegador agregándolo
al final de tu URL:

- `?fecha=2026-09-15` → solo las de esa fecha
- `?clase=pilates-mat` → solo las de esa clase

Por ejemplo: `https://script.google.com/.../exec?fecha=2026-09-15`

---

## ⚠️ Sobre la privacidad — esto importa

Esa planilla guarda **nombres, teléfonos y correos de las alumnas**. Son datos
personales de otras personas, no tuyos.

- **No compartas el link de la planilla públicamente**: ni en el Instagram, ni
  en un grupo de WhatsApp, ni en la página web.
- Compártela solo con quien realmente necesite verla, y por el botón
  **Compartir** de Google agregando su correo, nunca poniendo
  "Cualquier persona con el enlace".
- Si dejas de trabajar con alguien, quítale el acceso.
- Los teléfonos y correos son para contactar por temas de las clases. No los
  uses para otra cosa ni se los pases a nadie.

Si alguna alumna te pide que borres sus datos, bórrale la fila y listo: está en
su derecho.
