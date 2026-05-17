from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.utils import ImageReader

OUT = Path(__file__).resolve().parent / 'history-of-money-card-trading-kit.pdf'
PAGE_W, PAGE_H = landscape(letter)
MARGIN_X = 20
MARGIN_Y = 24
GAP_X = 10
GAP_Y = 12
COLS = 4
ROWS = 2
CARD_W = 2.5 * 72
CARD_H = 3.5 * 72
RADIUS = 14
COUNT = 100

CARDS = [
    ('mango', 'Mango', '🥭', '#ee7c2b', '#8f3b10', 'Perishable food value', 'Tradeable nourishment with short shelf life.', 'Barter supply'),
    ('cattle', 'Cattle', '🐄', '#6e4f3f', '#2e2019', 'High-value living wealth', 'Bulky wealth that stores value but is hard to divide.', 'Stored status'),
    ('shelter', 'Shelter', '⛺', '#5c4a86', '#2d2446', 'Protection & stability', 'A core need that becomes scarce fast under stress.', 'Security layer'),
    ('water', 'Water', '💧', '#2187c7', '#114366', 'Essential daily need', 'Universal demand makes water urgent but hard to store.', 'Life-support trade'),
    ('fish', 'Fish', '🐟', '#14806d', '#0b3b35', 'Protein & market flow', 'Useful food that spoils and pressures quick exchange.', 'Fast-moving barter'),
    ('gold-coins', 'Gold Coins', '🪙', '#d2a217', '#715108', 'Hard money era', 'Portable wealth with stronger long-term monetary properties.', 'Durable savings'),
    ('banknotes', 'Banknotes', '🏦', '#53743c', '#24351a', 'Redeemable paper claims', 'Convenient claims whose strength depends on institutions.', 'Ledger trust'),
    ('dollars', 'Dollars', '💵', '#1b9d5d', '#0b4d2c', 'Fiat convenience', 'Easy to use, easy to issue, and vulnerable to debasement.', 'Modern liquidity'),
]

EMOJI_FONT = '/System/Library/Fonts/Apple Color Emoji.ttc'


def make_emoji(char: str) -> ImageReader:
    img = Image.new('RGBA', (220, 220), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(EMOJI_FONT, 160)
    box = draw.textbbox((0, 0), char, font=font, embedded_color=True)
    x = (220 - (box[2] - box[0])) / 2 - box[0]
    y = (220 - (box[3] - box[1])) / 2 - box[1] - 4
    draw.text((x, y), char, font=font, embedded_color=True)
    return ImageReader(img)


ICON_CACHE = {key: make_emoji(emoji) for key, _, emoji, *_ in CARDS}


def all_cards():
    items = []
    for key, label, emoji, accent, dark, title, lesson, back in CARDS:
        for serial in range(1, COUNT + 1):
            items.append({
                'key': key,
                'label': label,
                'accent': HexColor(accent),
                'dark': HexColor(dark),
                'title': title,
                'lesson': lesson,
                'back': back,
                'serial': serial,
            })
    return items


def chunk(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]


def positions():
    top_y = PAGE_H - MARGIN_Y - CARD_H
    out = []
    for row in range(ROWS):
        for col in range(COLS):
            x = MARGIN_X + col * (CARD_W + GAP_X)
            y = top_y - row * (CARD_H + GAP_Y)
            out.append((x, y))
    return out


def wrap_lines(pdf, text, font_name, font_size, max_width, max_lines):
    words = text.split()
    lines = []
    current = ''
    for word in words:
        trial = (current + ' ' + word).strip()
        if pdf.stringWidth(trial, font_name, font_size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    if len(lines) <= max_lines:
        return lines
    trimmed = lines[:max_lines]
    last = trimmed[-1]
    while pdf.stringWidth(last + '…', font_name, font_size) > max_width and last:
        last = last[:-1]
    trimmed[-1] = last.rstrip() + '…'
    return trimmed


def crop_marks(pdf, x, y, w, h):
    m = 6
    l = 10
    pdf.setStrokeColor(HexColor('#d7c9b5'))
    pdf.setLineWidth(0.6)
    pdf.line(x - m, y + h, x - m + l, y + h)
    pdf.line(x, y + h + m, x, y + h + m - l)
    pdf.line(x + w + m, y + h, x + w + m - l, y + h)
    pdf.line(x + w, y + h + m, x + w, y + h + m - l)
    pdf.line(x - m, y, x - m + l, y)
    pdf.line(x, y - m, x, y - m + l)
    pdf.line(x + w + m, y, x + w + m - l, y)
    pdf.line(x + w, y - m, x + w, y - m + l)


def rounded_path(pdf, x, y, w, h, r):
    path = pdf.beginPath()
    path.roundRect(x, y, w, h, r)
    return path


def blend(a: Color, b: Color, t: float) -> Color:
    return Color(
        a.red + (b.red - a.red) * t,
        a.green + (b.green - a.green) * t,
        a.blue + (b.blue - a.blue) * t,
    )


def vertical_gradient(pdf, x, y, w, h, top: Color, bottom: Color, steps=40):
    for i in range(steps):
        t = i / (steps - 1)
        pdf.setFillColor(blend(top, bottom, t))
        seg_y = y + h * (steps - 1 - i) / steps
        pdf.rect(x, seg_y, w, h / steps + 0.8, stroke=0, fill=1)


def draw_face(pdf, card, x, y):
    crop_marks(pdf, x, y, CARD_W, CARD_H)
    path = rounded_path(pdf, x, y, CARD_W, CARD_H, RADIUS)
    pdf.saveState()
    pdf.clipPath(path, stroke=0, fill=0)
    vertical_gradient(pdf, x, y, CARD_W, CARD_H, card['accent'], card['dark'])
    pdf.setFillColor(Color(1, 1, 1, 0.05))
    pdf.circle(x + CARD_W * 0.82, y + CARD_H * 0.84, 32, stroke=0, fill=1)
    pdf.circle(x + CARD_W * 0.93, y + CARD_H * 0.70, 20, stroke=0, fill=1)
    pdf.restoreState()
    pdf.setStrokeColor(Color(0.35, 0.18, 0.05, 0.45))
    pdf.setLineWidth(1.2)
    pdf.drawPath(path, stroke=1, fill=0)

    pdf.setFillColor(white)
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawString(x + 10, y + CARD_H - 14, card['label'].upper())
    pdf.drawRightString(x + CARD_W - 10, y + CARD_H - 14, f"#{card['serial']:03d}")

    panel_x = x + 14
    panel_y = y + CARD_H - 88
    panel_w = CARD_W - 28
    panel_h = 40
    pdf.setFillColor(Color(1, 1, 1, 0.12))
    pdf.setStrokeColor(Color(1, 1, 1, 0.2))
    pdf.roundRect(panel_x, panel_y, panel_w, panel_h, 10, stroke=1, fill=1)
    pdf.drawImage(ICON_CACHE[card['key']], panel_x + panel_w / 2 - 18, panel_y + 2, width=36, height=36, mask='auto')

    pdf.setFillColor(white)
    title_lines = wrap_lines(pdf, card['title'], 'Helvetica-Bold', 15, CARD_W - 28, 2)
    title_y = y + CARD_H - 106
    pdf.setFont('Helvetica-Bold', 15)
    for line in title_lines:
        pdf.drawString(x + 14, title_y, line)
        title_y -= 16

    lesson_lines = wrap_lines(pdf, card['lesson'], 'Helvetica', 8.5, CARD_W - 28, 2)
    lesson_y = y + 32
    pdf.setFont('Helvetica', 8.5)
    for line in lesson_lines:
        pdf.drawString(x + 14, lesson_y, line)
        lesson_y -= 10

    pdf.setFont('Helvetica-Bold', 8.5)
    pdf.drawString(x + 14, y + 12, 'Workshop trade')
    pdf.drawRightString(x + CARD_W - 14, y + 12, card['label'].upper())


def draw_back(pdf, card, x, y):
    crop_marks(pdf, x, y, CARD_W, CARD_H)
    path = rounded_path(pdf, x, y, CARD_W, CARD_H, RADIUS)
    pdf.saveState()
    pdf.clipPath(path, stroke=0, fill=0)
    vertical_gradient(pdf, x, y, CARD_W, CARD_H, card['dark'], HexColor('#21160b'))
    pdf.setFillColor(Color(1, 1, 1, 0.08))
    pdf.circle(x + CARD_W * 0.5, y + CARD_H * 0.55, 44, stroke=0, fill=1)
    pdf.restoreState()
    pdf.setStrokeColor(Color(0.18, 0.10, 0.05, 0.5))
    pdf.setLineWidth(1.2)
    pdf.drawPath(path, stroke=1, fill=0)

    pdf.setStrokeColor(Color(1, 1, 1, 0.18))
    pdf.roundRect(x + 12, y + 12, CARD_W - 24, CARD_H - 24, RADIUS - 2, stroke=1, fill=0)
    pdf.drawImage(ICON_CACHE[card['key']], x + CARD_W / 2 - 30, y + CARD_H / 2 + 6, width=60, height=60, mask='auto')
    pdf.setFillColor(white)
    pdf.setFont('Helvetica-Bold', 15)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H / 2 - 18, card['label'])
    pdf.setFont('Helvetica', 9)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H / 2 - 31, 'History of Money · Trading Kit')
    pdf.drawCentredString(x + CARD_W / 2, y + 18, f"Block 02 · {card['back']}")


def footer(pdf, label, page_num, total_pages):
    pdf.setFillColor(HexColor('#6a5b46'))
    pdf.setFont('Helvetica', 7)
    pdf.drawString(MARGIN_X, 10, label)
    pdf.drawRightString(PAGE_W - MARGIN_X, 10, f'Page {page_num} of {total_pages}')


def build_pdf():
    pdf = canvas.Canvas(str(OUT), pagesize=landscape(letter))
    cards = all_cards()
    pos = positions()
    pages = chunk(cards, COLS * ROWS)
    total = len(pages)

    for page_num, page_cards in enumerate(pages, start=1):
        footer(pdf, 'Color fronts · landscape 8-up poker size', page_num, total)
        for (x, y), card in zip(pos, page_cards):
            draw_face(pdf, card, x, y)
        pdf.showPage()

    for page_num, page_cards in enumerate(pages, start=1):
        footer(pdf, 'Color mirrored backs · landscape 8-up poker size', page_num, total)
        rows = [page_cards[i:i + COLS] for i in range(0, len(page_cards), COLS)]
        mirrored = []
        for row in rows:
            mirrored.extend(list(reversed(row)))
        for (x, y), card in zip(pos, mirrored):
            draw_back(pdf, card, x, y)
        pdf.showPage()

    pdf.save()
    print(OUT)


if __name__ == '__main__':
    build_pdf()
