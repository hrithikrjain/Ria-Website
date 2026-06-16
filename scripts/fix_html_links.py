"""
Remove .html from /products/, /collections/, /occasions/ links across all files.
Two patterns handled:
  1. href/template-literal style:  /products/bangles-01.html  -> /products/bangles-01
  2. JS concatenation style:       +'.html  or  + '.html      -> +'  or  + '
"""
import re, os

BASE = r'C:\Users\Sandesh Jain\Downloads\Ria-Website'

# Matches /products/X.html, /collections/X.html, /occasions/X.html
# X can include template literal chars like ${p.slug}
HREF_RE = re.compile(
    r'((?:/products|/collections|/occasions)/[a-zA-Z0-9\-_${}\\.]+)\.html'
)

# Matches JS single-quoted concatenation: +'.html  or  + '.html
CONCAT_RE = re.compile(r"(\+\s*')\.html")

FILES = [
    'assets/js/collection-page.js',
    'assets/js/products.js',
    'assets/js/search.js',
    'assets/js/product-page.js',
    'assets/js/occasion-page.js',
    'assets/js/whatsapp.js',
    'assets/js/components.js',
    'index.html',
    'search.html',
    'collections/index.html',
    'occasions/bridal.html',
    'occasions/reception.html',
    'occasions/mehendi.html',
    'occasions/sangeet.html',
    'occasions/festive.html',
    'occasions/party-wear.html',
]

changed_total = 0

for rel in FILES:
    path = os.path.join(BASE, rel.replace('/', os.sep))
    with open(path, 'r', encoding='utf-8', newline='') as f:
        original = f.read()

    fixed = HREF_RE.sub(r'\1', original)
    fixed = CONCAT_RE.sub(r'\1', fixed)

    if fixed != original:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(fixed)
        changed = sum(1 for a, b in zip(original.splitlines(), fixed.splitlines()) if a != b)
        print(f'CHANGED ({changed} lines): {rel}')
        changed_total += 1
    else:
        print(f'  clean: {rel}')

print(f'\n{changed_total} files modified.')
