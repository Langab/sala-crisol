# Retratos de las fundadoras

La página "Nosotras" lee estos dos archivos. **Para cambiar una foto,
reemplaza el archivo con el mismo nombre.** No hay que tocar código.

```
img/fundadoras/
├── consuelo-ongaro.jpg
└── esperanza-fredes.jpg
```

- Formato: `.jpg`, vertical (se muestran en proporción 4:5)
- Tamaño recomendado: alrededor de 1000×1250 px
- Si la foto es horizontal se recorta por el centro, así que conviene
  que la persona no quede muy al borde

Después de reemplazarla:

```bash
git add -A && git commit -m "Retrato nuevo de <nombre>" && git push
```
