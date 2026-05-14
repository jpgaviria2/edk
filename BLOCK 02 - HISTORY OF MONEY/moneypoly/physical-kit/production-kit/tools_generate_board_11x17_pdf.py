from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'printables' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)

# 11x17 landscape in points
W, H = 17 * 72, 11 * 72
BG = HexColor('#0c6f3d')
PAPER = HexColor('#fffaf0')
BLACK = HexColor('#000000')
GOLD = HexColor('#f7931a')
BLUE = HexColor('#2374d8')
GREEN = HexColor('#35c66b')
PURPLE = HexColor('#7b3fe4')
RED = HexColor('#d66a55')
BROWN = HexColor('#8a6330')
AMBER = HexColor('#ffba71')

SPACES = [
    ('GO', 'Production', GOLD),
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


def draw_label(c, x, y, w, h, line1, line2='', rotate=0, fs1=15, fs2=12):
    c.saveState()
    if rotate:
        c.translate(x + w / 2, y + h / 2)
        c.rotate(rotate)
        x, y = -w / 2, -h / 2
    c.setFillColor(AMBER)
    c.setFont('Helvetica-Bold', fs1)
    if line2:
        c.drawCentredString(x + w / 2, y + h / 2 + 8, line1)
        c.setFont('Helvetica-Bold', fs2)
        c.drawCentredString(x + w / 2, y + h / 2 - 12, line2)
    else:
        words = line1.split()
        if len(words) > 2:
            split = len(words) // 2
            top = ' '.join(words[:split])
            bottom = ' '.join(words[split:])
            c.drawCentredString(x + w / 2, y + h / 2 + 8, top)
            c.drawCentredString(x + w / 2, y + h / 2 - 12, bottom)
        else:
            c.drawCentredString(x + w / 2, y + h / 2 - 2, line1)
    c.restoreState()


def draw_space(c, x, y, w, h, label1, label2, bar_color, rotate=0, corner=False):
    c.saveState()
    if rotate:
        c.translate(x + w / 2, y + h / 2)
        c.rotate(rotate)
        x, y = -w / 2, -h / 2
    c.setFillColor(HexColor('#1a1a1a'))
    c.setStrokeColor(BLACK)
    c.setLineWidth(2.5)
    c.roundRect(x, y, w, h, 8, stroke=1, fill=1)
    c.setFillColor(bar_color)
    if rotate == 0:
        c.rect(x + 2, y + h - 18, w - 4, 14, stroke=0, fill=1)
    elif rotate == 90:
        c.rect(x + w - 18, y + 2, 14, h - 4, stroke=0, fill=1)
    elif rotate == -90:
        c.rect(x + 4, y + 2, 14, h - 4, stroke=0, fill=1)
    draw_label(c, x, y, w, h, label1, label2, 0 if rotate == 0 else rotate, fs1=16 if corner else 13, fs2=12 if corner else 10)
    c.restoreState()


def main():
    p = OUT / 'table-board-24space-11x17.pdf'
    c = canvas.Canvas(str(p), pagesize=(W, H))

    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    board = 930
    x0 = (W - board) / 2
    y0 = (H - board) / 2

    c.setFillColor(PAPER)
    c.roundRect(x0 - 18, y0 - 18, board + 36, board + 36, 26, stroke=0, fill=1)
    c.setStrokeColor(BLACK)
    c.setLineWidth(5)
    c.roundRect(x0, y0, board, board, 14, stroke=1, fill=0)

    corner = 128
    row_w = (board - 2 * corner) / 5
    row_h = 104
    side_w = 104
    side_h = (board - 2 * corner) / 5

    # top
    draw_space(c, x0, y0 + board - corner, corner, corner, *SPACES[0], rotate=0, corner=True)
    x = x0 + corner
    for i in range(1, 6):
        draw_space(c, x, y0 + board - row_h, row_w, row_h, *SPACES[i], rotate=0)
        x += row_w
    draw_space(c, x0 + board - corner, y0 + board - corner, corner, corner, *SPACES[6], rotate=0, corner=True)

    # right
    y = y0 + board - corner - side_h
    for i in range(7, 12):
        draw_space(c, x0 + board - side_w, y, side_w, side_h, *SPACES[i], rotate=-90)
        y -= side_h
    draw_space(c, x0 + board - corner, y0, corner, corner, *SPACES[12], rotate=0, corner=True)

    # bottom
    x = x0 + board - corner - row_w
    for i in range(13, 18):
        draw_space(c, x, y0, row_w, row_h, *SPACES[i], rotate=0)
        x -= row_w
    draw_space(c, x0, y0, corner, corner, *SPACES[18], rotate=0, corner=True)

    # left
    y = y0 + corner
    for i in range(19, 24):
        draw_space(c, x0, y, side_w, side_h, *SPACES[i], rotate=90)
        y += side_h

    # center
    cx = x0 + corner + 22
    cy = y0 + corner + 22
    cw = board - 2 * corner - 44
    ch = board - 2 * corner - 44
    c.setFillColor(HexColor('#101010'))
    c.roundRect(cx, cy, cw, ch, 28, stroke=0, fill=1)
    c.setStrokeColor(BLACK)
    c.setLineWidth(4)
    c.roundRect(cx, cy, cw, ch, 28, stroke=1, fill=0)

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 44)
    c.drawCentredString(cx + cw / 2, cy + ch - 88, 'MONEYPOLY')
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(cx + cw / 2, cy + ch - 126, 'Same board. Same goal. Different money.')

    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    chip_w = 420
    chip_h = 64
    chip_x = cx + (cw - chip_w) / 2
    chip_y = cy + ch / 2 + 28
    c.setFillColor(HexColor('#2a1605'))
    c.roundRect(chip_x, chip_y, chip_w, chip_h, 32, stroke=1, fill=1)
    c.setFillColor(HexColor('#ffd58b'))
    c.setFont('Helvetica-Bold', 24)
    c.drawCentredString(cx + cw / 2, chip_y + 23, 'Goal: secure food + water + shelter + savings')

    eras = ['Barter', 'Shells', 'Gold', 'Slips', 'Fiat', 'Sats']
    pill_w = 170
    pill_h = 42
    gap = 12
    start_x = cx + (cw - (3 * pill_w + 2 * gap)) / 2
    start_y = cy + 70
    idx = 0
    for row in range(2):
        for col in range(3):
            c.setFillColor(HexColor('#1e1e1e'))
            c.roundRect(start_x + col * (pill_w + gap), start_y + (1 - row) * (pill_h + 10), pill_w, pill_h, 20, stroke=1, fill=1)
            c.setFillColor(AMBER)
            c.setFont('Helvetica-Bold', 18)
            c.drawCentredString(start_x + col * (pill_w + gap) + pill_w / 2, start_y + (1 - row) * (pill_h + 10) + 14, eras[idx])
            idx += 1

    c.save()
    print(p)

if __name__ == '__main__':
    main()
