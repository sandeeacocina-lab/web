#!/usr/bin/env python3
"""Render the shared, static article navigation into permalinks and the publishing panel.
Run from anywhere with Python 3. No build or template fetch is needed on the live site.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def bi(es, en):
    return f'<span class="smx-es">{es}</span><span class="smx-en" lang="en">{en}</span>'

def link(href, es, en=None, extra=''):
    return f'<a href="{href}"{extra}>{bi(es, en) if en else es}</a>'

NAV = link('/', 'Inicio', 'Home') + link('/#/blog', 'Blog') + link('/#/about', 'Sobre mí', 'About')
HEADER_NAV = NAV.replace('href="/#/blog"', 'href="/#/blog" aria-current="location"')
AREAS = [
    ('digitalizacion', 'Digitalización', 'Digitalisation'),
    ('simulacion', 'Simulación empresarial', 'Business simulation'),
    ('emprendimiento', 'Emprendimiento', 'Entrepreneurship'),
    ('rrhh', 'RRHH y RSC', 'HR and CSR'),
    ('ia', 'Inteligencia artificial', 'Artificial intelligence'),
]
HEADER = f'''<header id="sm-article-header">
  <div class="smx-row">
    <a class="smx-brand" href="/">Sandra Mangas</a>
    <div class="smx-panel" id="sm-article-panel">
      <nav class="smx-nav" aria-label="Navegación principal" data-sm-en-label="Main navigation">{HEADER_NAV}</nav>
      <form class="smx-search" action="/" method="get" role="search" aria-label="Buscar en el blog" data-sm-en-label="Search the blog">
        <input name="q" type="search" required aria-label="Buscar en el blog" data-sm-en-label="Search the blog" placeholder="Buscar…">
        <button type="submit" aria-label="Buscar" data-sm-en-label="Search"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>
      </form>
    </div>
    <div class="smx-languages" role="group" aria-label="Idioma" data-sm-en-label="Language">
      <button type="button" id="btn-es" lang="es" aria-label="Español" aria-pressed="true">ES</button><button type="button" id="btn-en" lang="en" aria-label="English" aria-pressed="false">EN</button>
    </div>
    <button class="smx-menu" type="button" aria-expanded="false" aria-controls="sm-article-panel"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>{bi('Menú','Menu')}</span></button>
  </div>
</header>'''
FOOTER = f'''<footer id="sm-article-footer">
  <div class="smx-footgrid">
    <div class="smx-identity">
      <a class="smx-signature" href="/">Sandra Mangas</a>
      <p class="smx-kicker">{bi('Innovación educativa · Formación Profesional','Educational innovation · Vocational Training')}</p>
      <p class="smx-blurb">{bi('Recursos, proyectos y experiencias para transformar el aula con metodologías activas, simulación empresarial e inteligencia artificial.','Resources, projects and experiences to transform the classroom with active methodologies, business simulation and artificial intelligence.')}</p>
    </div>
    <nav class="smx-footnav" aria-labelledby="sm-explore"><h2 id="sm-explore">{bi('Explorar','Explore')}</h2>{NAV}</nav>
    <nav class="smx-footnav smx-areas" aria-labelledby="sm-areas"><h2 id="sm-areas">{bi('Áreas de trabajo','Focus areas')}</h2>{''.join(link('/#/a/'+k,es,en) for k,es,en in AREAS)}</nav>
    <div class="smx-contact">
      <h2>{bi('Contacto','Contact')}</h2>
      <p>{bi('Para colaborar, preguntar o compartir ideas, escríbeme por correo.','For collaborations, questions or ideas, send me an email.')}</p>
      {link('mailto:sandeeacocina@gmail.com','Escribirme por correo','Send me an email',' class="smx-email"')}
    </div>
  </div>
  <div class="smx-baseline"><div class="smx-legal">
    <span>© 2026 Sandra Mangas</span>
    <div>{link('/#/about','Hablemos','Talk to me')}{link('http://www.larecetadelafelicidad.com','La receta de la felicidad',extra=' rel="noopener" target="_blank"')}{link('/privacidad/','Privacidad y cookies','Privacy and cookies')}{link('/privacidad/#preferencias','Cambiar cookies','Cookie settings',' data-cookie-settings')}</div>
  </div><p class="smx-note" data-site-ai-note>{bi('En esta web utilizo inteligencia artificial para generar algunas imágenes y como apoyo editorial, siempre bajo mi criterio y revisión.','On this website, I use artificial intelligence to generate some images and for editorial support, always guided by my own judgement and review.')}</p></div>
</footer>'''
CSS = '<link rel="stylesheet" href="/assets/article-shell.css">'
JS = '<script defer src="/assets/article-shell.js"></script>'
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&amp;family=Zilla+Slab:wght@700&amp;display=swap">'
TOPIC_LABEL = '<span class="smx-topic-label">' + bi('Temas de esta entrada', 'Topics in this post') + '</span>'

def once(text, pattern, replacement):
    result, n = re.subn(pattern, lambda m: replacement(m) if callable(replacement) else replacement, text, flags=re.S)
    if n != 1:
        raise ValueError(f'Expected one match for {pattern!r}; found {n}')
    return result

def article(s):
    if not re.search(r'<body[^>]*>\s*<header\b', s):
        if re.search(r'<meta[^>]+http-equiv=["\']refresh', s, re.I):
            return s
        raise ValueError('Unrecognised permalink (neither an article nor a redirect)')
    s = once(s, r'(<body[^>]*>\s*)<header\b[^>]*>.*?</header>', lambda m:m[1]+HEADER)
    s = once(s, r'<footer\b[^>]*>.*?</footer>', FOOTER)
    s = re.sub(r'(<main\b[^>]*>)\s*<div class="(?:langtoggle|language-controls)"[^>]*>.*?</div>',r'\1',s,count=1,flags=re.S)
    s = re.sub(r"document\.getElementById\('btn-(es|en)'\)\.addEventListener\('click',\(\)=>setLang\('\1'\)\);\n?",'',s)
    if CSS not in s:
        s = once(s, r'</head>', (FONT+'\n' if 'fonts.googleapis.com/css2' not in s else '')+CSS+'\n'+JS+'\n</head>')
    s = s.replace('← Volver al blog','Volver al blog').replace('← Back to the blog','Back to the blog')
    if '<nav class="topic-links"' in s and 'class="smx-topic-label"' not in s:
        s = once(s, r'(<nav class="topic-links"[^>]*>)', lambda m:m[1]+TOPIC_LABEL)
    return s

def panel(s):
    # Its template is a JSON string inside a bundle. Leave the manifest and the app code intact.
    pattern = r'(<script type="__bundler/template">)(\s*)(".*?")(\s*)(</script>)'
    def render(match):
        p = json.loads(match[3])
        # The legacy panel omitted the closing angle bracket on the privacy script.
        p = p.replace('privacy.js"\'+SCR_CLOSE', 'privacy.js">\'+SCR_CLOSE')
        if '/*smx-header*/' not in p:
            p = once(p, r"(const bodyHtml = '<body>\\n)<header class=\"site\">.*?</header>(\\n<main class=\"wrap\">\\n)  <div class=\"langtoggle\".*?</div>\\n",lambda m:m[1]+"' + /*smx-header*/\"\"/*/smx-header*/ + '"+m[2])
            p = once(p, r"(</main>\\n)<footer class=\"site\">.*?</footer>(\\n';\s*const scriptHtml)",lambda m:m[1]+"' + /*smx-footer*/\"\"/*/smx-footer*/ + '"+m[2])
            p = once(p, r"(\+'\\n)</head>(\\n';\s*const bottomNav)", lambda m:m[1]+CSS+r"\n' + SCR_OPEN + ' defer src=\"/assets/article-shell.js\">' + SCR_CLOSE + '\n</head>"+m[2])
            p = p.replace('← Volver al blog','Volver al blog').replace('← Back to the blog','Back to the blog')
        for name, html in [('header',HEADER),('footer',FOOTER)]:
            p = once(p, rf'/\*smx-{name}\*/.*?/\*/smx-{name}\*/', f'/*smx-{name}*/'+json.dumps(html,ensure_ascii=False)+f'/*/smx-{name}*/')
        # The original bundler escapes HTML delimiters (not non-ASCII text).
        encoded = json.dumps(p,ensure_ascii=False)
        for c in "<>&'":
            encoded = encoded.replace(c, f'\\u{ord(c):04x}')
        return match[1]+match[2]+encoded+match[4]+match[5]
    return once(s,pattern,render)

if __name__ == '__main__':
    count = 0
    for f in sorted(ROOT.glob('20??/*/*/*/index.html'))+[ROOT/'panel/index.html']:
        old = f.read_bytes().decode()
        new = panel(old) if f.parent.name=='panel' else article(old)
        if new != old:
            f.write_bytes(new.encode()); count += 1
    print(f'{count} files updated')
