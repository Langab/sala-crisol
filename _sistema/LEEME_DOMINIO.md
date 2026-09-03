# Comprar salacrisol.cl y conectarlo al sitio

Hola 👋 Esta guía es para dejar la página funcionando en **https://salacrisol.cl**
en vez de la dirección larga de GitHub que usamos hoy. No hay que programar
nada: es llenar formularios, copiar y pegar. Cuenta unos 40 minutos de trabajo
tuyo, repartidos en dos días (hay esperas de por medio).

**Al 1 de septiembre de 2026 el nombre `salacrisol.cl` estaba libre.** Lo
revisé en el buscador oficial de NIC Chile y dijo *"Nombre de dominio no
existe"*. Nadie lo tiene reservado, pero tampoco está guardado a tu nombre:
el que lo paga primero se lo lleva. Si vas a hacerlo, hazlo pronto.

---

## 1. Antes de empezar

### Qué vas a conseguir

Hoy la página vive en `https://salacrisol.cl/`. Funciona
perfecto, pero es larga, tiene el nombre de otra persona adentro (`langab`) y
no se puede dictar por teléfono.

Cuando termines esto, la misma página se va a abrir en **`salacrisol.cl`**.
La dirección vieja va a seguir funcionando y redirigiendo sola, así que nada
se rompe ni se pierde.

**Lo que NO cambia:** la página es la misma, sigue viviendo en GitHub, sigue
siendo gratis alojarla, y sigues editándola igual que hoy (ver
`COMO_EDITAR_EL_SITIO.md`). Lo único que compras es **el nombre**.

### Cuánto cuesta

| Concepto | Costo |
|---|---|
| Dominio `salacrisol.cl` en NIC Chile, 1 año | **$9.990** (exento de IVA) |
| Servicio de DNS en Cloudflare | **$0** |
| Alojamiento en GitHub Pages | **$0** |
| **Total primer año** | **$9.990** |

Si lo tomas por 2 años de una vez: **$19.980**. No hay descuento por tomar
más años (el precio es exactamente $9.990 por cada año), pero sí te ahorras
el riesgo de olvidarte de renovar. Más sobre eso al final.

*(Tarifa oficial de NIC Chile, vigente desde el 1 de noviembre de 2023,
confirmada hoy en nic.cl/dominios/tarifas.html.)*

### Palabras que van a aparecer

Tres nomás, y después no las nombro más de lo necesario:

- **Dominio**: el nombre. `salacrisol.cl`. Es lo que compras.
- **DNS**: la guía telefónica de internet. Es lo que traduce "salacrisol.cl"
  a la dirección numérica del computador donde está la página. Sin esto, el
  nombre que compraste no apunta a ninguna parte.
- **Registrador**: la empresa donde compras el nombre. Para los `.cl` el
  dueño oficial es NIC Chile, pero también puedes comprarlo a través de
  empresas chilenas de hosting.

---

## 2. Decidir dónde comprarlo

Acá está el único punto donde tienes que elegir. El detalle importante:
**NIC Chile vende el nombre pero no te da dónde configurarlo.** Ellos mismos
lo dicen en su ayuda: *"NIC Chile no entrega el servicio de DNS primario
para sus clientes."* Solo te dejan un campo para escribir a qué servidores
delegas el dominio. Así que si compras ahí, necesitas además un servicio de
DNS aparte — Cloudflare, que es gratis.

| | **Opción barata**<br>NIC Chile + Cloudflare | **Opción simple**<br>Registrador chileno con panel |
|---|---|---|
| Dónde | nic.cl + cloudflare.com | HostingPlus, Planetahosting u otro |
| Precio al año | **$9.990** | **~$15.000** (HostingPlus)<br>**~$12.990** (Planetahosting) |
| Cuentas que creas | 2 | 1 |
| ¿Trae panel de DNS? | No NIC Chile; sí Cloudflare (gratis) | Sí, incluido |
| Pasos totales | ~12 | ~8 |
| Soporte en español por teléfono | No (Cloudflare es en inglés) | Sí |
| Si algo se rompe en 3 años | Lo arreglas tú o quien te ayude | Les escribes y lo ven ellos |

### Mi recomendación: **NIC Chile + Cloudflare**

Por tres razones:

1. **El nombre queda directamente a tu nombre en NIC Chile**, que es quien
   manda de verdad sobre los `.cl`. Si mañana te peleas con una empresa de
   hosting, no te pueden retener el dominio: ya es tuyo.
2. **Son $5.000 al año menos** y la configuración es de una sola vez. La haces
   ahora, y después no la tocas nunca más.
3. **Cloudflare no se cae y no cobra.** El DNS gratis es su producto de
   entrada de hace más de diez años, no una promoción que puedan quitar.

La opción del registrador chileno es razonable si te da lata crear una cuenta
en un servicio en inglés, o si prefieres poder llamar por teléfono a alguien.
No está mal, solo es más cara. Si eliges esa, salta el paso 4 de esta guía y
usa el panel que te den ellos con la misma tabla de registros del paso 4.

> **Por confirmar:** los precios de HostingPlus (~$15.000) y Planetahosting
> (~$12.990) los saqué de sus propios sitios web y pueden estar sin IVA o con
> IVA incluido, no quedó claro. Si te vas por esa vía, mira el total en el
> carrito antes de pagar. El de NIC Chile sí está confirmado y es exento de IVA.

**El resto de esta guía asume que elegiste NIC Chile + Cloudflare.**

---

## 3. Comprar el dominio en NIC Chile

Necesitas: un correo que revises de verdad, y una tarjeta.

1. Entra a **https://www.nic.cl** y arriba a la derecha aprieta
   **Iniciar sesión** (o anda directo a **https://clientes.nic.cl**).

2. Si nunca has tenido un dominio `.cl`, aprieta **Crear cuenta de usuario**.
   Te va a pedir nombre, correo, teléfono y dirección. **No necesitas RUT de
   empresa ni ser una empresa**: una persona natural puede ser dueña de un
   dominio `.cl` sin problema. Según la reglamentación de NIC Chile, incluso
   declarar el número de documento de identidad es optativo.

   👉 **El correo que pongas acá es importante.** A esa dirección van a llegar
   los avisos de renovación dentro de un año. Usa uno que revises, no uno que
   tengas abandonado.

3. Con la sesión abierta, en el buscador de la portada escribe
   **`salacrisol`** y elige `.cl`. Debería decirte que está **disponible**.

   *(Si dice que ya está inscrito, alguien se te adelantó entre que escribí
   esto y el momento en que lo lees. En ese caso hay que elegir otro nombre:
   `salacrisol.cl` no se puede compartir. Alternativas razonables:
   `sala-crisol.cl`, `salacrisolvalpo.cl`, `crisolsala.cl`.)*

4. Aprieta **Inscribir** / **Agregar al carro**.

5. **Elige el período.** Acá aparece un menú con 1, 2, 3... años. Te
   recomiendo **2 años ($19.980)**. Explico por qué en el punto 8.

6. **Datos del titular.** Que salga tu nombre completo (o el de Consuelo, o
   el nombre legal de la sala si tiene uno). *Este dato es el que define quién
   es el dueño del nombre*, así que ponlo bien a la primera.

7. **Servidores de nombre (DNS).** Acá te va a pedir dos direcciones tipo
   `algo.ns.cloudflare.com`. **Todavía no las tienes.**

   Buena noticia: NIC Chile dice explícitamente que *"no es indispensable
   informar este dato en el proceso de inscripción. En cualquier momento
   posterior puede hacer una modificación."*

   👉 **Déjalo en blanco y sigue.** Volvemos acá en el paso 4.

8. **Paga.** NIC Chile trabaja con Webpay (tarjetas chilenas) y Servipag.
   La inscripción queda hecha apenas reciben el pago — no hay que esperar
   aprobación de nadie.

   > **Por confirmar:** si hay opción de PayPal o pago en dólares. Lo vi
   > mencionado en guías de terceros, no en el sitio oficial. Con tarjeta
   > chilena por Webpay funciona seguro.

9. **Guarda el correo de confirmación.** Trae el número de la operación y la
   fecha de vencimiento. Mételo en una carpeta del correo que se llame
   "Sala Crisol - dominio" y no lo borres nunca.

✅ **A esta altura el nombre ya es tuyo.** Todavía no lleva a ninguna parte,
pero nadie te lo puede quitar.

---

## 4. Conectarlo al sitio

Esto es lo único que se parece a algo técnico, y son 15 minutos.

### 4.1 Crear la cuenta en Cloudflare

1. Anda a **https://dash.cloudflare.com/sign-up**. Correo y contraseña.
   No pide tarjeta.

2. Confirma el correo que te llega.

3. En el panel, aprieta **Add a domain** (o **Onboard a domain**).

4. Escribe **`salacrisol.cl`** y continúa.

5. Cuando te pregunte el plan, elige **Free — $0**. Está más abajo en la
   lista, hay que bajar un poco. Es el que sirve.

6. Cloudflare va a decir que no encontró registros existentes. **Está bien**,
   es un dominio nuevo. Sigue.

### 4.2 Poner los registros

Ahora estás en la pantalla **DNS → Records**. Aprieta **Add record** y crea
**cinco** registros, uno por uno, exactamente así:

| Type | Name | IPv4 address / Target | Proxy status | TTL |
|---|---|---|---|---|
| `A` | `@` | `185.199.108.153` | **DNS only** | Auto |
| `A` | `@` | `185.199.109.153` | **DNS only** | Auto |
| `A` | `@` | `185.199.110.153` | **DNS only** | Auto |
| `A` | `@` | `185.199.111.153` | **DNS only** | Auto |
| `CNAME` | `www` | `langab.github.io` | **DNS only** | Auto |

*(Las cuatro direcciones numéricas son las oficiales de GitHub Pages,
confirmadas hoy en la documentación de GitHub. El `@` significa "el dominio
pelado", o sea `salacrisol.cl` sin nada adelante. Son cuatro para que si un
servidor de GitHub se cae, los otros tres respondan igual.)*

Tres cosas que se equivocan siempre:

- 🔴 **"Proxy status" tiene que quedar en `DNS only`, con la nubecita GRIS.**
  Si queda naranja (`Proxied`), GitHub no puede emitir el certificado de
  seguridad y tu página va a salir con advertencia de "sitio no seguro".
  La nubecita se aprieta para cambiarla; asegúrate de que los cinco
  registros queden grises.
- 🔴 **El CNAME apunta a `langab.github.io`**, sin `/sala-crisol` al final y
  sin `https://` adelante. Solo eso.
- 🔴 No pongas un punto al final de nada ni espacios extra.

### 4.3 Copiar los servidores de Cloudflare a NIC Chile

7. Cloudflare te va a mostrar **dos direcciones** parecidas a
   `dana.ns.cloudflare.com` y `rob.ns.cloudflare.com`. Los nombres son
   inventados y distintos para cada cuenta — **usa los tuyos, no estos**.
   Si te las perdiste, están en **Overview** de tu dominio.

8. Vuelve a **https://clientes.nic.cl**, entra a tu dominio y busca
   **Modificar servidores de nombre** (o **Cambiar DNS**).

9. Pega las dos direcciones de Cloudflare, una en cada campo, **copiadas
   exactamente**. Sin `www`, sin `https://`, sin puntos al final.

10. Guarda.

11. Vuelve a Cloudflare y aprieta **Check nameservers** / **Continue**.
    Va a decir "Pending". Es normal. **Acá empieza la espera** — puede
    demorar desde 15 minutos hasta un día. Cloudflare te manda un correo
    cuando queda activo. Anda a hacer otra cosa.

---

## 5. Configurarlo en GitHub

Haz esto **después** de que Cloudflare te avise que el dominio está activo.

1. Entra a **https://github.com/Langab/sala-crisol**

2. Arriba, en la fila de pestañas (`Code`, `Issues`, `Pull requests`...),
   aprieta **⚙️ Settings**. Es la última a la derecha.

3. En la columna de la izquierda baja hasta la sección
   **Code, planning, and automation** y aprieta **Pages**.

4. Busca el recuadro que dice **Custom domain**. Escribe:

   ```
   salacrisol.cl
   ```

   Sin `https://`, sin `www`, sin barra al final. Aprieta **Save**.

5. GitHub va a mostrar **"DNS check in progress"** con un círculo amarillo.
   Espera. Cuando termine debería aparecer un ✅ verde al lado de
   `salacrisol.cl`.

6. Debajo hay una casilla que dice **Enforce HTTPS**. **Márcala.**

   👉 Esa casilla puede aparecer **gris y no dejarse marcar** al principio.
   Es normal: GitHub está pidiendo el certificado de seguridad y eso demora.
   La documentación oficial dice que puede tardar hasta una hora, y en la
   práctica a veces más. Cierra, tómate un café, y vuelve más tarde.
   **No sigas hasta que la puedas marcar.** Sin eso, el candadito del
   navegador va a salir tachado y la gente va a desconfiar.

7. Comprueba las cuatro direcciones en el navegador. Las cuatro tienen que
   terminar mostrando la página con candado:

   - `salacrisol.cl`
   - `www.salacrisol.cl`
   - `http://salacrisol.cl` (debe saltar solo a `https://`)
   - `https://salacrisol.cl/` (debe redirigir a `salacrisol.cl`)

⚠️ **Un detalle si editas el sitio desde la terminal:** cuando guardas el
"Custom domain", GitHub crea solo un archivo llamado `CNAME` dentro del
repositorio. Ese archivo **no está en tu carpeta local**. Antes de tu próximo
`git push`, corre primero:

```bash
git pull
```

Si no lo haces, el push te va a dar un error de conflicto. Con el `git pull`
se arregla y ya no molesta más nunca.

---

## 6. Después de que funcione: arreglar las metaetiquetas

Esto **no es opcional si te importa cómo se ve el link al compartirlo**.

### Qué son y por qué importan

En el código de cada página hay tres líneas escondidas arriba del todo que
hoy dicen `https://salacrisol.cl/...`:

- **`canonical`** — le dice a Google *"la dirección de verdad de esta página
  es ésta"*. Si queda apuntando a la vieja, Google puede seguir mostrando la
  dirección de GitHub en los resultados de búsqueda en vez de `salacrisol.cl`.

- **`og:url`** y **`og:image`** — son las que usan **WhatsApp e Instagram**
  para armar esa tarjetita con foto y título que aparece cuando pegas un
  link. Si `og:image` sigue apuntando a la dirección vieja, la foto puede
  dejar de cargar y el link se va a ver como texto pelado y desconfiable.
  Justo lo contrario de lo que quieres cuando mandas el link por WhatsApp
  para llenar un taller.

### Exactamente cuántas y dónde

Revisé todos los `.html` del proyecto. Son **24 líneas en 8 archivos** —
las tres mismas en cada uno:

| Archivo | Líneas | Cuáles |
|---|---|---|
| `index.html` | 8, 12, 15 | canonical, og:url, og:image |
| `nosotros.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/bellydance-fusion.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/danza-contemporanea.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/danza-filosofia.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/equilibrio-de-manos.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/movimiento-flexible.html` | 8, 12, 15 | canonical, og:url, og:image |
| `talleres/pilates-mat.html` | 8, 12, 15 | canonical, og:url, og:image |

`panel.html` **no tiene ninguna** y no hay que tocarlo.

En todos los casos el cambio es el mismo: reemplazar

```
https://salacrisol.cl/
```

por

```
https://salacrisol.cl/
```

El resto de cada línea queda igual. Por ejemplo, en `index.html` la línea 8
pasa de:

```html
<link rel="canonical" href="https://salacrisol.cl/">
```

a:

```html
<link rel="canonical" href="https://salacrisol.cl/">
```

### Cómo hacerlo sin abrir 8 archivos

Desde la carpeta `sala_crisol_web`, en la terminal:

```bash
grep -rl "langab.github.io/sala-crisol" --include="*.html" . \
  | xargs sed -i '' 's|https://salacrisol.cl/|https://salacrisol.cl/|g'
```

Después revisa que quedó bien y no quedó nada suelto:

```bash
grep -rn "langab.github.io" --include="*.html" .
```

Si no muestra nada, quedó perfecto. Sube los cambios como siempre
(`git add -A && git commit -m "Cambio a dominio propio" && git push`).

### Un archivo más, de paso

`COMO_EDITAR_EL_SITIO.md` nombra la dirección vieja en dos lugares (líneas
5 y 84). No afecta a la página, pero conviene actualizarlo para no confundirte
en un año. Ese sí, a mano.

### Comprobar que quedó bien

Manda el link `https://salacrisol.cl` por WhatsApp **a ti mismo**. Debería
aparecer la tarjeta con la foto y el título. Si sale sin foto, WhatsApp
tiene guardada la versión vieja; espera unas horas y prueba de nuevo con
`https://salacrisol.cl/?1` (el `?1` lo obliga a mirar de nuevo).

---

## 7. Cuánto demora cada cosa y qué hacer si falla

### Los tiempos reales

| Paso | Tu trabajo | Espera después |
|---|---|---|
| Comprar en NIC Chile | 15 min | Inmediato (apenas se paga) |
| Crear Cloudflare y poner registros | 15 min | — |
| Delegar los DNS en NIC Chile | 5 min | **15 min a 24 horas** |
| Custom domain en GitHub | 2 min | Minutos |
| Que se pueda marcar "Enforce HTTPS" | 1 min | **Hasta 1 hora, a veces más** |
| Cambiar las metaetiquetas | 10 min | 1–2 min en publicarse |

En total: **una tarde de trabajo repartida en dos días.** No lo empieces
media hora antes de tener que mandar el link a alguien.

### Los cuatro errores típicos

**1. "Su conexión no es privada" / candado tachado.**
El error más común, y casi siempre es la nubecita naranja. Anda a Cloudflare →
DNS → Records y revisa que **los cinco registros** digan **`DNS only`** con la
nube gris, no `Proxied` con la nube naranja. Corrige, espera media hora, y en
GitHub → Settings → Pages quita el Custom domain, guarda, vuelve a ponerlo y
guarda otra vez. Eso obliga a GitHub a pedir el certificado de nuevo.

**2. GitHub dice "Domain does not resolve to the GitHub Pages server".**
Los DNS todavía no llegaron, o quedaron mal escritos. Revisa:
- ¿Cloudflare dice **Active** (no "Pending")? Si dice Pending, el problema
  está en NIC Chile: vuelve al paso 4.3 y compara letra por letra las dos
  direcciones que pegaste.
- ¿Las cuatro direcciones numéricas están bien copiadas? Se escapa un dígito
  con facilidad. Son `.108`, `.109`, `.110`, `.111` — todas terminadas en `.153`.
- Si todo está bien, **es cuestión de esperar**. Vuelve mañana. Casi todos
  los "no funciona" a las 2 horas funcionan solos a las 12.

**3. `salacrisol.cl` funciona pero `www.salacrisol.cl` no (o al revés).**
Falta el registro `CNAME` de `www`, o quedó mal el destino. Tiene que decir
exactamente `langab.github.io`, sin nada más.

**4. La casilla "Enforce HTTPS" está gris y no se deja marcar.**
No está roto: GitHub todavía no termina de emitir el certificado. Espera.
Si después de 24 horas sigue gris, revisa el error 1 (nubecita naranja) —
es la causa el 90% de las veces.

**Regla general:** con los DNS, casi todo se arregla esperando. Si cambias
cosas cada 10 minutos porque no funciona, solo empeoras la situación, porque
cada cambio reinicia los relojes. Haz un cambio, espera de verdad, después
revisa.

---

## 8. Recordatorios para no perder el dominio

### La renovación

Los dominios `.cl` **se arriendan, no se compran para siempre.** Si no
renuevas, se vence, y después de un tiempo cualquiera lo puede tomar. Si eso
pasa, la página se cae y todos los links que hayas repartido en un año dejan
de servir.

Anota esto:

- **Fecha de vencimiento:** _______________ *(la trae el correo de NIC Chile)*
- **Precio de renovación:** $9.990 por año, mismo valor que la inscripción
- **Dónde se renueva:** https://clientes.nic.cl con tu cuenta

### Por qué comprar 2 años

NIC Chile **no da descuento** por período largo — dos años cuestan exactamente
el doble que uno, $19.980. Así que la razón para tomar dos no es la plata:

Los avisos de renovación llegan por correo, y un correo se pierde con una
facilidad increíble: cae en spam, cambias de teléfono, estás de vacaciones,
la casilla está llena. **Un dominio se pierde por un correo no leído, no por
falta de $9.990.** Dos años es una red de seguridad barata.

### Las dos cosas que sí o sí tienes que hacer hoy

1. **Pon una alerta en tu calendario del teléfono** para **un mes antes** del
   vencimiento, que se repita todos los años. Título: *"Renovar salacrisol.cl
   en clientes.nic.cl"*. No confíes en el correo de NIC Chile: que sea el
   respaldo, no el aviso principal.

2. **Guarda la clave de `clientes.nic.cl` donde la vayas a encontrar en un
   año.** Es la única llave del dominio. Si se pierde hay forma de
   recuperarla, pero es un trámite lento y siempre pasa en el peor momento.
   Anótala junto con el correo con que creaste la cuenta — ese dato también
   se olvida.

### Si algún día cambias de sitio o de persona

El dominio es independiente de GitHub. Si en el futuro la página se muda a
otro lado, solo cambias los registros en Cloudflare y `salacrisol.cl` sigue
siendo el mismo. Nadie tiene que aprenderse una dirección nueva. Esa es,
al final, la gracia de tener nombre propio.

---

## Checklist

Ve marcando. Los 🕐 son los puntos donde hay que esperar sí o sí.

**Comprar**
- [ ] Decidí dónde comprarlo (recomendado: NIC Chile + Cloudflare)
- [ ] Creé cuenta en clientes.nic.cl con un correo que reviso de verdad
- [ ] Confirmé que `salacrisol.cl` sigue disponible
- [ ] Elegí período (recomendado: 2 años, $19.980)
- [ ] Revisé que el nombre del titular esté bien escrito
- [ ] Pagué y guardé el correo de confirmación
- [ ] Anoté la fecha de vencimiento: _______________

**Conectar**
- [ ] Creé cuenta en Cloudflare y agregué `salacrisol.cl` con plan **Free**
- [ ] Creé los 4 registros `A` (`.108`, `.109`, `.110`, `.111`)
- [ ] Creé el registro `CNAME` de `www` → `langab.github.io`
- [ ] **Verifiqué que los 5 registros están en `DNS only` (nube GRIS)**
- [ ] Copié los 2 servidores de Cloudflare a NIC Chile
- [ ] 🕐 Cloudflare dice **Active**

**Publicar**
- [ ] GitHub → Settings → Pages → Custom domain = `salacrisol.cl`
- [ ] 🕐 GitHub muestra el ✅ verde al lado del dominio
- [ ] 🕐 Marqué **Enforce HTTPS**
- [ ] Probé `salacrisol.cl`, `www.salacrisol.cl` y `http://salacrisol.cl`
- [ ] Probé que la dirección vieja de GitHub redirige sola
- [ ] Hice `git pull` antes de mi siguiente cambio (por el archivo `CNAME`)

**Rematar**
- [ ] Cambié las 24 metaetiquetas en los 8 archivos `.html`
- [ ] `grep -rn "langab.github.io" --include="*.html" .` no muestra nada
- [ ] Subí los cambios con `git push`
- [ ] Mandé el link por WhatsApp a mí mismo y aparece la foto
- [ ] Actualicé `COMO_EDITAR_EL_SITIO.md` (líneas 5 y 84)

**No olvidar**
- [ ] Alerta anual en el calendario, un mes antes del vencimiento
- [ ] Guardé la clave de `clientes.nic.cl` en un lugar seguro
- [ ] Actualicé el link en la bio de Instagram y en el WhatsApp de la sala

---

### Qué está confirmado y qué no

**Confirmado hoy (1 de septiembre de 2026), en la fuente oficial:**

- `salacrisol.cl` disponible — buscador WHOIS de NIC Chile
- Tarifas: $9.990 por 1 año, $19.980 por 2, exento de IVA, sin descuento por
  período largo — nic.cl/dominios/tarifas.html
- NIC Chile no entrega servicio de DNS y no es obligatorio declarar los
  servidores al inscribir — nic.cl/ayuda/faq/ins-05.html
- Las 4 direcciones IP de GitHub Pages y el destino del CNAME — docs.github.com
- Dónde están "Custom domain" y "Enforce HTTPS", y que el certificado puede
  demorar hasta una hora — docs.github.com
- Que el plan gratuito de Cloudflare permite administrar el DNS del dominio
  cambiando los servidores en el registrador — developers.cloudflare.com

**Por confirmar cuando estés ahí:**

- **Precios de HostingPlus y Planetahosting**: los saqué de sus sitios, pero
  no quedó claro si son con IVA o sin IVA. Mira el total en el carrito.
- **Medios de pago de NIC Chile**: Webpay y Servipag aparecen en guías de
  terceros, no en el sitio oficial. Con tarjeta chilena funciona; si necesitas
  pagar desde el extranjero, pregúntales antes.
- **Que la nubecita tiene que estar gris**: esto no está escrito en la
  documentación oficial de GitHub, pero lo repiten todas las guías de
  Cloudflare + GitHub Pages y coincide con cómo funciona el certificado.
  Empieza en gris; si después quieres probar en naranja, hazlo cuando el
  sitio ya funcione y sabiendo que puedes tener que volver atrás.
- **Cuánto demora la delegación en NIC Chile**: puse "15 minutos a 24 horas"
  como rango habitual, no es un dato oficial de NIC Chile.
