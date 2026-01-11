# Site BEMA — Conteúdos em Markdown (Opção B1)

✅ Agora os textos vivem em `conteudos/*.md`.

## Como editar
- Para editar a **home**: `conteudos/inicio.md`
- Serviços: `conteudos/servicos.md`
- Documentos: `conteudos/documentos.md`
- FAQ: `conteudos/faq.md`
- +Cultura: `conteudos/cultura.md`
- PNL: `conteudos/pnl.md`
- Contactos: `conteudos/contactos.md`

### Dicas rápidas de Markdown
- `#` Título
- `##` Subtítulo
- `-` lista
- `**negrito**`
- `[texto](link)`

## Publicar no GitHub Pages
Settings → Pages → Deploy from branch → main → /(root)


## Notícias/Avisos na Home
Edita `conteudos/noticias.md`.

Formato recomendado:
- **data** — texto curto (podes usar links e negrito)


## Área reservada (com password)
Existe `area-reservada.html` com uma barreira leve (password em JS).
⚠️ Não é segurança absoluta; serve para não estar à vista no site.

Para mudar a password:
- abre `assets/js/main.js`
- procura `RESERVED_PASSWORD` e altera o valor.
