#!/bin/bash
# ============================================================
#  Pasa el sitio de langab.github.io/sala-crisol a salacrisol.cl
# ------------------------------------------------------------
#  NO lo corras antes de que el DNS esté resolviendo: el script
#  lo comprueba solo y se detiene si no lo está. Ejecutarlo antes
#  deja el sitio caído, porque GitHub redirige la dirección vieja
#  al dominio nuevo y ese dominio todavía no llevaría a ninguna
#  parte.
#
#  Uso:  bash _sistema/cambiar_a_dominio.sh
# ============================================================
set -e
DOM="salacrisol.cl"
VIEJA="https://langab.github.io/sala-crisol/"
NUEVA="https://${DOM}/"
cd "$(dirname "$0")/.."

echo "1. Comprobando el DNS de ${DOM}…"
# Una sola consulta puede fallar con la caché fría del resolvedor local,
# así que se reintenta y se cae a resolvedores públicos.
IPS=""
for intento in 1 2 3; do
  IPS=$(dig +short "$DOM" A 2>/dev/null | grep -E '^[0-9.]+$' | sort | tr '\n' ' ')
  [ -n "$IPS" ] && break
  IPS=$(dig +short @1.1.1.1 "$DOM" A 2>/dev/null | grep -E '^[0-9.]+$' | sort | tr '\n' ' ')
  [ -n "$IPS" ] && break
  sleep 3
done
ESPERADAS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
if [ -z "$IPS" ]; then
  echo "   ✗ ${DOM} todavía no resuelve. Falta configurar el DNS."
  echo "     Revisa _sistema/LEEME_DOMINIO.md y vuelve a intentarlo."
  exit 1
fi
echo "   IPs que responden: ${IPS}"
for ip in $ESPERADAS; do
  echo "$IPS" | grep -q "$ip" || { echo "   ✗ falta el registro A ${ip}"; exit 1; }
done
echo "   ✓ los 4 registros A de GitHub Pages están puestos"

echo "2. Cambiando las direcciones dentro del sitio…"
ARCHIVOS=$(grep -rl "langab.github.io/sala-crisol" --include="*.html" --include="*.js" --include="*.md" . || true)
for f in $ARCHIVOS; do
  sed -i '' "s|${VIEJA}|${NUEVA}|g; s|https://langab.github.io/sala-crisol|https://${DOM}|g" "$f"
  echo "   · $f"
done

echo "3. Creando el archivo CNAME…"
echo "$DOM" > CNAME

echo "4. Subiendo los cambios…"
git add -A
git commit -m "El sitio pasa a ${DOM}

Cambia las direcciones absolutas (canonical, og:url y og:image) para
que las vistas previas al compartir apunten al dominio propio, y agrega
el archivo CNAME que le dice a GitHub Pages cuál es el dominio."
git push origin main

echo "5. Registrando el dominio en GitHub Pages…"
gh api -X PUT repos/Langab/sala-crisol/pages -f cname="$DOM" -F https_enforced=true >/dev/null 2>&1 || \
  echo "   (si falla, ponlo a mano en Settings → Pages → Custom domain)"

echo
echo "Listo. GitHub tarda un rato en emitir el certificado."
echo "Si HTTPS no anda en una hora: Settings → Pages → quita el dominio,"
echo "guarda, vuelve a ponerlo y guarda otra vez."
