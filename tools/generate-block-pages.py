#!/usr/bin/env python3
from pathlib import Path
import html
import re

ROOT = Path(__file__).resolve().parents[1]

BLOCKS = [
  ('BLOCK 01 - WHAT IS MONEY','1','What Is Money?','Practical: money function classifier, value comparison games.'),
  ('BLOCK 02 - HISTORY OF MONEY','2','History of Money','Already started. Barter → commodity money → fiat → Bitcoin.'),
  ('BLOCK 03 - FIAT INFLATION & PURCHASING POWER','3','Fiat, Inflation & Purchasing Power','Practical: inflation simulator, wage vs prices game, central bank money printer model.'),
  ('BLOCK 04 - WHY BITCOIN','4','Why Bitcoin? Problems → Solutions','Practical: match each fiat/debt/trust problem to Bitcoin design features.'),
  ('BLOCK 05 - WHAT IS BITCOIN','5','What Is Bitcoin?','Practical: “Bitcoin is not…” misconception game, sound money property comparison.'),
  ('BLOCK 06 - WALLETS KEYS & CUSTODY','6','Wallets, Keys & Custody','Practical: hot/cold wallet chooser, seed phrase safety scenarios.'),
  ('BLOCK 07 - TRANSACTIONS SEND & RECEIVE','7','Transactions: Send & Receive','Practical: QR invoice flow, address-checking, “spot the bad send” game.'),
  ('BLOCK 08 - LIGHTNING & DAILY PAYMENTS','8','Lightning & Daily Payments','Practical: coffee payment simulator, routing puzzle, custodial vs non-custodial tradeoffs.'),
  ('BLOCK 09 - HASHING MINING & PROOF OF WORK','9','Hashing, Mining & Proof of Work','Practical: hash race, nonce guessing, mining difficulty demo.'),
  ('BLOCK 10 - NODES RULES & CONSENSUS','10','Nodes, Rules & Consensus','Practical: node validation game, Byzantine generals, invalid block rejection.'),
  ('BLOCK 11 - UTXOS FEES & PRIVACY','11','UTXOs, Fees & Privacy','Practical: coin-selection puzzle, fee market simulator, privacy leak detector.'),
  ('BLOCK 12 - BITCOIN FUTURE & PHILOSOPHY','12','Bitcoin Future & Philosophy','Practical: CBDC vs Bitcoin comparison, censorship-resistance scenarios, financial empowerment case studies.'),
]

def inline_md(text: str) -> str:
    text = html.escape(text)
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img alt="\1" src="\2" loading="lazy" />', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    return text

def flush_para(out, para):
    if para:
        out.append('<p>' + inline_md(' '.join(para).strip()) + '</p>')
        para.clear()

def flush_list(out, items, ordered=False):
    if items:
        tag = 'ol' if ordered else 'ul'
        out.append(f'<{tag}>' + ''.join(f'<li>{inline_md(i)}</li>' for i in items) + f'</{tag}>')
        items.clear()

def render_table(lines):
    rows=[]
    for line in lines:
        cells=[c.strip() for c in line.strip().strip('|').split('|')]
        rows.append(cells)
    if len(rows) < 2:
        return '<p>' + inline_md(' '.join(lines)) + '</p>'
    head=rows[0]
    body=rows[2:] if set(''.join(rows[1])) <= set('-: ') else rows[1:]
    h='<thead><tr>' + ''.join(f'<th>{inline_md(c)}</th>' for c in head) + '</tr></thead>'
    b='<tbody>' + ''.join('<tr>' + ''.join(f'<td>{inline_md(c)}</td>' for c in row) + '</tr>' for row in body) + '</tbody>'
    return f'<div class="table-wrap"><table>{h}{b}</table></div>'

def md_to_html(text: str) -> str:
    out=[]; para=[]; ul=[]; ol=[]; table=[]; quote=[]
    lines=text.splitlines()
    def flush_all():
        nonlocal table, quote
        flush_para(out, para); flush_list(out, ul, False); flush_list(out, ol, True)
        if table:
            out.append(render_table(table)); table=[]
        if quote:
            out.append('<blockquote>' + ''.join(f'<p>{inline_md(q)}</p>' for q in quote) + '</blockquote>'); quote=[]
    for raw in lines:
        line=raw.rstrip()
        if not line.strip():
            flush_all(); continue
        if line.strip() == '---':
            flush_all(); out.append('<hr />'); continue
        if line.lstrip().startswith('|') and '|' in line.strip()[1:]:
            flush_para(out, para); flush_list(out, ul, False); flush_list(out, ol, True); table.append(line); continue
        elif table:
            out.append(render_table(table)); table=[]
        if line.startswith('>'):
            flush_para(out, para); flush_list(out, ul, False); flush_list(out, ol, True); quote.append(line.lstrip('> ').strip()); continue
        elif quote:
            out.append('<blockquote>' + ''.join(f'<p>{inline_md(q)}</p>' for q in quote) + '</blockquote>'); quote=[]
        m=re.match(r'^(#{1,6})\s+(.+)$', line)
        if m:
            flush_all(); level=min(len(m.group(1))+1,6); out.append(f'<h{level}>{inline_md(m.group(2).strip())}</h{level}>'); continue
        m=re.match(r'^\s*[-*]\s+(.+)$', line)
        if m:
            flush_para(out, para); flush_list(out, ol, True); ul.append(m.group(1).strip()); continue
        m=re.match(r'^\s*\d+[.)]\s+(.+)$', line)
        if m:
            flush_para(out, para); flush_list(out, ul, False); ol.append(m.group(1).strip()); continue
        para.append(line.strip())
    flush_all()
    return '\n'.join(out)

def title_from_md(path: Path, fallback: str) -> str:
    for line in path.read_text().splitlines():
        if line.startswith('#'):
            return line.lstrip('#').strip()
    return fallback

def block_sources(block_dir: Path):
    return sorted((block_dir/'curriculum-content').rglob('*.md'))

def write_block_page(block_dir_name, n, title, practical):
    block_dir=ROOT/block_dir_name
    sources=block_sources(block_dir)
    sections=[]
    toc=[]
    for idx, src in enumerate(sources, 1):
        rel=src.relative_to(block_dir)
        sec_id=f'source-{idx}'
        heading=title_from_md(src, src.stem)
        toc.append(f'<a href="#{sec_id}">{html.escape(heading)}</a>')
        body=md_to_html(src.read_text())
        sections.append(f'<article class="lesson-section" id="{sec_id}"><div class="source-path">{html.escape(str(rel))}</div>{body}</article>')
    app_link = '<a class="btn primary" href="./mini-app/">Open current practical app</a>' if (block_dir/'mini-app').exists() else '<span class="pill">Practical app ready to build</span>'
    brief = md_to_html((block_dir/'APP-BRIEF.md').read_text()) if (block_dir/'APP-BRIEF.md').exists() else ''
    plan = md_to_html((block_dir/'CONTENT-PLAN.md').read_text()) if (block_dir/'CONTENT-PLAN.md').exists() else ''
    page=f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Block {n} · {html.escape(title)}</title>
  <style>
    :root {{ color-scheme: dark; --bg:#07111f; --panel:rgba(13,24,43,.92); --text:#f6f8ff; --muted:#b8c3dc; --accent:#ffbe63; --accent2:#77e0ff; --border:rgba(255,255,255,.12); font-family:Inter,system-ui,sans-serif; }}
    * {{ box-sizing:border-box; }} body {{ margin:0; background:radial-gradient(circle at top left,rgba(119,224,255,.16),transparent 28%),linear-gradient(180deg,#07111f,#091527 55%,#07111f); color:var(--text); }}
    main {{ width:min(1180px,100%); margin:0 auto; padding:18px; }} a {{ color:inherit; }}
    .top {{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px; }}
    .hero,.card,.lesson-section {{ border:1px solid var(--border); border-radius:26px; background:var(--panel); box-shadow:0 24px 70px rgba(0,0,0,.28); }}
    .hero {{ padding:clamp(22px,5vw,42px); margin-bottom:16px; }} .card {{ padding:20px; margin:16px 0; }} .lesson-section {{ padding:24px; margin:18px 0; }}
    .eyebrow,.source-path {{ color:var(--accent); text-transform:uppercase; letter-spacing:.14em; font-size:.72rem; font-weight:900; }}
    h1 {{ font-size:clamp(2.3rem,7vw,5rem); line-height:.96; margin:.15em 0; letter-spacing:-.045em; }} h2 {{ font-size:clamp(1.45rem,4vw,2.5rem); }} h2,h3,h4 {{ margin:1.1em 0 .45em; }} p,li,td,th {{ color:var(--muted); line-height:1.65; }} blockquote {{ border-left:4px solid var(--accent); margin:18px 0; padding:12px 18px; background:rgba(255,190,99,.08); border-radius:14px; }}
    .btn,.pill,.toc a {{ display:inline-flex; padding:11px 14px; border-radius:14px; border:1px solid var(--border); text-decoration:none; font-weight:900; margin:4px; }} .primary {{ background:linear-gradient(135deg,#ffc875,#ff9758); color:#261400; border:0; }} .pill,.toc a {{ color:var(--accent2); background:rgba(119,224,255,.1); }}
    .toc {{ display:flex; flex-wrap:wrap; gap:6px; }} .grid {{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }}
    img {{ max-width:100%; height:auto; }} .table-wrap {{ overflow:auto; }} table {{ width:100%; border-collapse:collapse; margin:16px 0; }} th,td {{ border:1px solid var(--border); padding:10px; text-align:left; }} th {{ color:var(--text); background:rgba(255,255,255,.06); }} code {{ color:var(--accent2); }} hr {{ border:0; border-top:1px solid var(--border); margin:24px 0; }}
    @media(max-width:800px) {{ main {{ padding:12px; }} .grid {{ grid-template-columns:1fr; }} }}
  </style>
</head>
<body>
  <main>
    <nav class="top"><a class="btn" href="../">← EDK home</a>{app_link}</nav>
    <section class="hero"><div class="eyebrow">Block {n}</div><h1>{html.escape(title)}</h1><p><strong>{html.escape(practical)}</strong></p><p>Curriculum source adapted from My First Bitcoin Bitcoin Diploma, licensed CC BY-SA 4.0.</p></section>
    <section class="card"><h2>Lesson contents</h2><div class="toc">{''.join(toc)}</div></section>
    <section class="grid"><article class="card"><h2>Content plan</h2>{plan}</article><article class="card"><h2>Practical app brief</h2>{brief}</article></section>
    <section class="card"><h2>Curriculum lesson content</h2><p>The source markdown has been rendered below as learner-readable HTML so the practical app can be built directly from the block page.</p></section>
    {''.join(sections)}
  </main>
</body>
</html>
'''
    (block_dir/'index.html').write_text(page)

for args in BLOCKS:
    write_block_page(*args)
print('rendered curriculum HTML for', len(BLOCKS), 'blocks')
