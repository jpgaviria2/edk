from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'printables' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)

W, H = 17 * 72, 11 * 72  # 11x17 landscape
FELT = HexColor('#0d6b3e')
FELT_DARK = HexColor('#084a2a')
PAPER = HexColor('#fbf4e3')
PAPER_SHADE = HexColor('#f3e5c2')
BLACK = HexColor('#121212')
GOLD = HexColor('#f7931a')
GOLD_LIGHT = HexColor('#ffd58b')
BLUE = HexColor('#2f80ed')
GREEN = HexColor('#36c66a')
PURPLE = HexColor('#8c52ff')
RED = HexColor('#e76f51')
BROWN = HexColor('#9a6b2f')
INK = HexColor('#2a241d')
MUTED = HexColor('#6a6255')

SPACES = [
    ('GO', 'Collect Production', GOLD),
    ('Water Trade', '', BLUE),
    ('Open Market A', '', BROWN),
    ('Food Trade', '', GREEN),
    ('Crisis A', '', RED),
    ('Commodity Exchange', '', GOLD),
    ('Community Well', '', BLUE),
    ('Shelter Trade', '', BROWN),
    ('Open Market B', '', BROWN),
    ('Fish Trade', '', GREEN),
    ('Gold Market', '', GOLD),
    ('Government Levy', '', RED),
    ('Trade Route', '', PURPLE),
    ('Medici Bank', '', PURPLE),
    ('Open Market C', '', BROWN),
    ('Cattle Trade', '', GREEN),
    ('Crisis B', '', RED),
    ('Central Bank', '', BLUE),
    ('Vault', 'Treasury', GOLD),
    ('Bitcoin Savings', '', GOLD),
    ('Lightning Payment', '', PURPLE),
    ('Open Market D', '', BROWN),
    ('Generational Wealth', '', GREEN),
    ('Ruler / Policy', '', RED),
]

CENTER_ERAS = ['BARTER', 'SHELLS', 'GOLD', 'SLIPS', 'FIAT', 'SATS']


def split_label(text):
    if ' / ' in text:
        return text.split(' / ')
    words = text.split()
    if len(words) <= 2:
        return [' '.join(words)]
    if len(words) == 3:
        return [' '.join(words[:2]), words[2]]
    pivot = len(words) // 2
    return [' '.join(words[:pivot]), ' '.join(words[pivot:])]


def draw_outer_background(c):
    c.setFillColor(FELT)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setStrokeColor(FELT_DARK)
    c.setLineWidth(18)
    c.rect(10, 10, W - 20, H - 20, stroke=1, fill=0)
    c.setStrokeColor(PAPER_SHADE)
    c.setLineWidth(2)
    c.rect(22, 22, W - 44, H - 44, stroke=1, fill=0)


def draw_banner(c, x, y, w, h, text, subtext=''):
    c.setFillColor(PAPER)
    c.roundRect(x, y, w, h, 18, stroke=0, fill=1)
    c.setStrokeColor(BLACK)
    c.setLineWidth(2.5)
    c.roundRect(x, y, w, h, 18, stroke=1, fill=0)
    c.setFillColor(GOLD)
    c.roundRect(x + 12, y + h - 18, w - 24, 8, 4, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont('Times-Bold', 26)
    c.drawCentredString(x + w / 2, y + h - 48, text)
    if subtext:
        c.setFillColor(MUTED)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(x + w / 2, y + 18, subtext)


def draw_space(c, x, y, w, h, label1, label2, color, rotate=0, corner=False):
    lines = split_label(label1)
    c.saveState()
    if rotate:
        c.translate(x + w / 2, y + h / 2)
        c.rotate(rotate)
        x, y = -w / 2, -h / 2

    c.setFillColor(PAPER)
    c.setStrokeColor(BLACK)
    c.setLineWidth(2.2 if not corner else 2.8)
    c.roundRect(x, y, w, h, 10 if not corner else 14, stroke=1, fill=1)

    c.setFillColor(color)
    if rotate == 0:
        c.rect(x + 3, y + h - 20, w - 6, 14, stroke=0, fill=1)
    elif rotate == 90:
        c.rect(x + w - 20, y + 3, 14, h - 6, stroke=0, fill=1)
    elif rotate == -90:
        c.rect(x + 6, y + 3, 14, h - 6, stroke=0, fill=1)

    c.setFillColor(INK)
    if corner:
        c.setFont('Helvetica-Bold', 15)
        if len(lines) == 1:
            c.drawCentredString(x + w / 2, y + h / 2 + 4, lines[0])
        else:
            c.drawCentredString(x + w / 2, y + h / 2 + 10, lines[0])
            c.drawCentredString(x + w / 2, y + h / 2 - 10, lines[1])
        if label2:
            c.setFillColor(MUTED)
            c.setFont('Helvetica-Bold', 10)
            c.drawCentredString(x + w / 2, y + 16, label2)
    else:
        if rotate == 0:
            c.setFont('Helvetica-Bold', 11)
            yy = y + h / 2 + (6 if len(lines) == 1 else 12)
            for i, line in enumerate(lines):
                c.drawCentredString(x + w / 2, yy - i * 12, line)
        else:
            c.translate(x + w / 2, y + h / 2)
            c.rotate(-rotate)
            c.setFont('Helvetica-Bold', 10.5)
            yy = 8 if len(lines) == 1 else 12
            for i, line in enumerate(lines):
                c.drawCentredString(0, yy - i * 12, line)

    c.restoreState()


def draw_center(c, x, y, w, h):
    c.setFillColor(HexColor('#17130f'))
    c.roundRect(x, y, w, h, 30, stroke=0, fill=1)
    c.setStrokeColor(BLACK)
    c.setLineWidth(4)
    c.roundRect(x, y, w, h, 30, stroke=1, fill=0)

    # coin medallion
    coin_r = min(w, h) * 0.19
    coin_x = x + w / 2
    coin_y = y + h * 0.67
    c.setFillColor(HexColor('#2a1605'))
    c.setStrokeColor(GOLD)
    c.setLineWidth(4)
    c.circle(coin_x, coin_y, coin_r, stroke=1, fill=1)
    c.setLineWidth(1.5)
    c.circle(coin_x, coin_y, coin_r - 12, stroke=1, fill=0)
    c.setFillColor(GOLD)
    c.setFont('Times-Bold', 46)
    c.drawCentredString(coin_x, coin_y - 16, '₿')

    c.setFillColor(GOLD)
    c.setFont('Times-Bold', 38)
    c.drawCentredString(x + w / 2, y + h - 62, 'MONEYPOLY')
    c.setFillColor(GOLD_LIGHT)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(x + w / 2, y + h - 88, 'Same board · Same goal · Different money')

    # objective plaque
    plaque_w = w * 0.78
    plaque_h = 64
    px = x + (w - plaque_w) / 2
    py = y + h * 0.36
    c.setFillColor(HexColor('#24150b'))
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.roundRect(px, py, plaque_w, plaque_h, 20, stroke=1, fill=1)
    c.setFillColor(GOLD_LIGHT)
    c.setFont('Helvetica-Bold', 20)
    c.drawCentredString(x + w / 2, py + 24, 'Goal: secure food + water + shelter + savings')

    # era chips
    chip_w = 92
    chip_h = 30
    gap = 10
    total = 3 * chip_w + 2 * gap
    start_x = x + (w - total) / 2
    row1_y = y + 92
    row2_y = y + 52
    idx = 0
    for row_y in [row1_y, row2_y]:
        for col in range(3):
            cx = start_x + col * (chip_w + gap)
            c.setFillColor(HexColor('#221c17'))
            c.setStrokeColor(GOLD)
            c.setLineWidth(2)
            c.roundRect(cx, row_y, chip_w, chip_h, 14, stroke=1, fill=1)
            c.setFillColor(GOLD_LIGHT)
            c.setFont('Helvetica-Bold', 12)
            c.drawCentredString(cx + chip_w / 2, row_y + 10, CENTER_ERAS[idx])
            idx += 1


def main():
    p = OUT / 'table-board-24space-11x17.pdf'
    c = canvas.Canvas(str(p), pagesize=(W, H))
    draw_outer_background(c)

    draw_banner(c, 110, H - 92, W - 220, 58, 'MONEYPOLY', 'Moderator board · 24 spaces · 11×17 print')

    board = 900
    x0 = (W - board) / 2
    y0 = 78

    c.setFillColor(PAPER_SHADE)
    c.roundRect(x0 - 18, y0 - 18, board + 36, board + 36, 26, stroke=0, fill=1)
    c.setFillColor(PAPER)
    c.roundRect(x0 - 8, y0 - 8, board + 16, board + 16, 20, stroke=0, fill=1)
    c.setStrokeColor(BLACK)
    c.setLineWidth(5)
    c.roundRect(x0, y0, board, board, 16, stroke=1, fill=0)

    corner = 132
    row_w = (board - 2 * corner) / 5
    row_h = 100
    side_w = 100
    side_h = (board - 2 * corner) / 5

    # top row
    draw_space(c, x0, y0 + board - corner, corner, corner, *SPACES[0], rotate=0, corner=True)
    x = x0 + corner
    for i in range(1, 6):
        draw_space(c, x, y0 + board - row_h, row_w, row_h, *SPACES[i], rotate=0)
        x += row_w
    draw_space(c, x0 + board - corner, y0 + board - corner, corner, corner, *SPACES[6], rotate=0, corner=True)

    # right side
    y = y0 + board - corner - side_h
    for i in range(7, 12):
        draw_space(c, x0 + board - side_w, y, side_w, side_h, *SPACES[i], rotate=-90)
        y -= side_h
    draw_space(c, x0 + board - corner, y0, corner, corner, *SPACES[12], rotate=0, corner=True)

    # bottom row
    x = x0 + board - corner - row_w
    for i in range(13, 18):
        draw_space(c, x, y0, row_w, row_h, *SPACES[i], rotate=0)
        x -= row_w
    draw_space(c, x0, y0, corner, corner, *SPACES[18], rotate=0, corner=True)

    # left side
    y = y0 + corner
    for i in range(19, 24):
        draw_space(c, x0, y, side_w, side_h, *SPACES[i], rotate=90)
        y += side_h

    # center
    cx = x0 + corner + 18
    cy = y0 + corner + 18
    cw = board - 2 * corner - 36
    ch = board - 2 * corner - 36
    draw_center(c, cx, cy, cw, ch)

    c.save()
    print(p)


if __name__ == '__main__':
    main()
