# AgroLens Dashboard — GitHub Pages

Dashboard estático mobile-first para mostrar resultados de vuelo de AgroLens en un fundo de palta Hass.

## Archivos incluidos

- `index.html`: estructura del dashboard.
- `styles.css`: diseño responsive mobile y desktop.
- `app.js`: interacciones del prototipo.
- `.nojekyll`: evita procesamiento Jekyll en GitHub Pages.

## Cómo verlo localmente

Solo abre `index.html` en tu navegador.

También puedes levantar un servidor simple:

```bash
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo: `agrolens-dashboard`.
2. Sube estos archivos a la raíz del repositorio.
3. En GitHub, entra a `Settings` → `Pages`.
4. En `Build and deployment`, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda los cambios.
6. Espera unos minutos y GitHub te mostrará el link público.

## Personalización rápida

Puedes cambiar los datos del fundo editando:

- Textos principales en `index.html`.
- Alertas, lotes y tareas en `app.js`.
- Colores y estilo visual en `styles.css`.

## Nota importante

Este prototipo usa datos simulados. El análisis está planteado como detección visual asistida por IA sobre imágenes RGB y debe validarse en campo antes de tomar decisiones agronómicas.
