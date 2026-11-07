# Portfólio — Moysés Hedo Voss

Site estático (HTML, CSS e JavaScript puros), sem build e sem dependências. Português por padrão, com alternância PT/EN.

## Executar e publicar
- Local: `python3 -m http.server 8000` dentro desta pasta e abra http://localhost:8000 (ou abra `index.html`).
- Publicar: envie a pasta inteira para qualquer hospedagem estática (Cloudflare Pages, GitHub Pages, Netlify).

## Estrutura
- `index.html`: conteúdo em português (fonte do texto PT, marcado com `data-i`).
- `script.js`: módulos (idioma, menu/tema, rolagem, carrossel, diagrama, mesa interativa). O inglês fica no objeto `EN`; textos gerados por script, em `DYN`.
- `style.css`: estilos, tema escuro e impressão (A4).
- `tools/gerar_curriculo.py`: gera `assets/curriculo-moyses-voss.pdf` (`pip install reportlab`).
- `robots.txt`, `sitemap.xml` (falta o domínio).

## Como editar
- Texto: altere o português no HTML e a chave de mesmo nome em `EN`. Chave sem tradução cai no português.
- Tecnologias da mesa: objeto `SC` em `script.js` (`[nome, descrição PT, descrição EN]`).
- Formação concluída: edite `edu.s1`, `edu.s2` e `edu.t2` (HTML e `EN`).

## Imagens que faltam (os cartões mostram um aviso até elas existirem)
| Arquivo | O que capturar |
|---|---|
| `assets/nucleotech/dashboard.webp`, `tools.webp`, `upload.webp`, `history.webp`, `subscription.webp` | Telas reais do NucleoTech (16:10, ~1280×800, WebP até ~150 KB) |
| `assets/games/flappy-ia.gif` | Gravação da IA jogando. Ex.: `ffmpeg -i gravacao.mp4 -vf "fps=12,scale=720:-1:flags=lanczos" -loop 0 assets/games/flappy-ia.gif` |
| `assets/ielb/home-mobile.webp`, `calendar-mobile.webp`, `messages-mobile.webp` | Telas reais do site no celular (9:16) |

## Pendências de confirmação
- Link do LinkedIn (não foi possível validar automaticamente).
- Domínio definitivo (canonical, sitemap, Open Graph com URL).
- Problema, aprendizados e resultados do IELB Charrua; gerenciamento de conteúdo e detalhes da Cloudflare.
- Currículo PDF existe só em português.
