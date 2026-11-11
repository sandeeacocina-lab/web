# Sandra Mangas — Web

Sitio estático (HTML + JavaScript, sin build). Bilingüe ES/EN, blog con etiquetas por tipo y área. Prueba


## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `sandra-mangas-web`).
2. Sube **todo el contenido de esta carpeta** a la raíz del repositorio:
   - `index.html`
   - `support.js`
   - `images/`
3. En el repositorio: **Settings → Pages**.
4. En *Build and deployment* → *Source*, elige **Deploy from a branch**.
5. Branch: `main` (o `master`) y carpeta `/ (root)`. Guarda.
6. En 1–2 minutos tu web estará en `https://TU-USUARIO.github.io/sandra-mangas-web/`.

> No hace falta ningún paso de compilación. Es HTML estático: GitHub Pages lo sirve tal cual.

## Notas

- Las tipografías (Zilla Slab y Source Sans 3) se cargan desde Google Fonts, así que el navegador necesita conexión la primera vez.
- La navegación usa rutas con `#` (por ejemplo `#/blog`, `#/t/juegos`), compatibles con hosting estático.
- Para editar contenido (textos, artículos, imágenes), edita `index.html`.

## Cabecera y pie de las entradas

Las entradas con enlace permanente incluyen la navegación completa en su HTML. El panel de publicación usa la misma plantilla para las entradas nuevas. Para cambiar los textos o enlaces compartidos, edita `scripts/sync-article-shell.py` y ejecuta `python3 scripts/sync-article-shell.py`. No se modifican las redirecciones antiguas. El aspecto y el menú móvil se ajustan en `assets/article-shell.css` y `assets/article-shell.js`.

El buscador de las entradas abre el índice del blog en `/#/buscar/…`; el idioma se recuerda tanto en el índice como en los artículos.
