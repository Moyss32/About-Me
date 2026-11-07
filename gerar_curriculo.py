"""Gera assets/curriculo-moyses-voss.pdf (A4, português).

Uso: pip install reportlab && python tools/gerar_curriculo.py
Edite os textos abaixo e rode de novo para atualizar o currículo.
"""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether

INK, MUT, BLUE, LAV = HexColor("#303947"), HexColor("#566376"), HexColor("#A9C7E8"), HexColor("#C7B9E8")
OUT = Path(__file__).resolve().parent.parent / "assets" / "curriculo-moyses-voss.pdf"
GH, LI = "https://github.com/Moyss32", "https://www.linkedin.com/in/mois%C3%A9s-voss-39854b304/"

S = {
    "name": ParagraphStyle("name", fontName="Times-Roman", fontSize=27, leading=30, textColor=INK),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=MUT, spaceBefore=2),
    "ct": ParagraphStyle("ct", fontName="Helvetica", fontSize=9, leading=13, textColor=INK, spaceBefore=3),
    "h": ParagraphStyle("h", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=INK, spaceBefore=11, spaceAfter=2),
    "p": ParagraphStyle("p", fontName="Helvetica", fontSize=9.2, leading=12.6, textColor=INK),
    "b": ParagraphStyle("b", fontName="Helvetica", fontSize=9.2, leading=12.6, textColor=INK, leftIndent=10, bulletIndent=1),
    "t": ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=9.8, leading=13, textColor=INK, spaceBefore=5),
    "m": ParagraphStyle("m", fontName="Helvetica", fontSize=8.6, leading=11.5, textColor=MUT),
}
link = lambda u, txt: f'<link href="{u}" color="#303947">{txt}</link>'


def section(title):
    return [Paragraph(title.upper(), S["h"]), HRFlowable(width="100%", thickness=1.4, color=BLUE, spaceAfter=4)]


def item(title, meta, bullets):
    out = [Paragraph(title, S["t"])]
    if meta:
        out.append(Paragraph(meta, S["m"]))
    out += [Paragraph(b, S["b"], bulletText="•") for b in bullets]
    return KeepTogether(out)


story = [
    Paragraph("Moysés Hedo Voss", S["name"]),
    Paragraph("Desenvolvedor web e back-end júnior · Estudante de Técnico em Informática para a Internet", S["role"]),
    Paragraph(f'moyseshvoss@gmail.com · +55 (54) 99906-0137 · Charrua, RS<br/>{link(GH, "github.com/Moyss32")} · {link(LI, "linkedin.com/in/moysés-voss-39854b304")}', S["ct"]),
]
story += section("Resumo profissional") + [Paragraph(
    "Estudante do Técnico em Informática para a Internet (IFC Concórdia, conclusão prevista em dezembro de 2026). "
    "Desenvolvo back-ends em Python com Django e Flask e interfaces web com JavaScript e React. Tenho experiência prática com "
    "autenticação JWT, assinaturas e pagamentos com Stripe, filas de tarefas com Celery e Redis, e com a hospedagem e a manutenção de um site em uso. "
    "Busco oportunidade como desenvolvedor web júnior ou em suporte técnico.", S["p"])]
story += section("Formação")
story.append(item("Técnico em Informática para a Internet", "Instituto Federal Catarinense (IFC), campus Concórdia · 2024 – 2026 (conclusão prevista: dezembro de 2026)", []))
story += section("Experiência prática")
story.append(item("IELB Charrua — desenvolvimento independente", "2026 – atual", [
    "Desenvolvimento, publicação e manutenção contínua do site de uma organização local, incluindo hospedagem.",
    "Uso de API própria servida pela Cloudflare; calendário alimentado por arquivo JSON, player de mensagens em áudio e contato via WhatsApp.",
]))
story.append(item("Infraestrutura e administração de servidores pessoais — prática em infraestrutura", "", [
    "Linux, CasaOS e containers; hospedagem, armazenamento, redes, acesso remoto e manutenção de serviços.",
]))
story += section("Projetos")
story.append(item(f'NucleoTech — {link("https://github.com/Moyss32/NucleoTech", "github.com/Moyss32/NucleoTech")}', "Plataforma de conversão e processamento de imagens e áudio · Python, Django REST, JWT, Celery, Redis, Stripe", [
    "Autor de 30 dos 37 commits do repositório (projeto em equipe): rotas, modelos e configuração do Django, webhooks do Stripe, permissões, downloads seguros e histórico de pagamentos.",
    "Planos com cotas de uso, processamento em tarefas Celery e auditoria de segurança do próprio código.",
]))
story.append(item(f'Jogos em Python — {link("https://github.com/Moyss32/Python_Games", "github.com/Moyss32/Python_Games")}', "Projeto individual · Python, Pygame, NEAT", [
    "Flappy Bird e Dino (Chrome) com versão jogável e versão controlada por IA treinada com NEAT (população de 50 redes, 50 gerações).",
]))
story.append(item("Renassol — projeto acadêmico (PI2, 2025)", "Loja virtual de placas solares, em grupo · React, Flask, MySQL", [
    "Back-end em Flask (modelos e rotas de usuários, produtos, carrinho e pedidos) e telas de cadastro, login e área do usuário em React.",
]))
story += section("Competências técnicas") + [
    Paragraph("<b>Linguagens:</b> Python, JavaScript, C/C++, SQL<br/><b>Back-end:</b> Django, Django REST Framework, Flask · <b>Dados:</b> Pandas, NumPy<br/>"
              "<b>Bancos de dados:</b> PostgreSQL, MySQL, SQLite · <b>Ferramentas:</b> Git, GitHub, Linux, Windows, Redis<br/>"
              "<b>Outros:</b> montagem e manutenção de computadores e servidores, fundamentos de redes, IoT (ESP32, Arduino Uno/Mega)", S["p"])]
story += section("Idiomas") + [Paragraph("Português: língua materna · Inglês: intermediário, B2", S["p"])]

OUT.parent.mkdir(parents=True, exist_ok=True)
SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=15 * mm, bottomMargin=14 * mm,
                  title="Currículo — Moysés Hedo Voss", author="Moysés Hedo Voss", lang="pt-BR").build(story)
print("gerado:", OUT)
