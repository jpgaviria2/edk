from pathlib import Path
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'printables' / 'pdf'
OUT.mkdir(parents=True, exist_ok=True)

W, H = landscape(letter)
BG = HexColor('#fffaf0')
INK = HexColor('#1b1b1b')
GOLD = HexColor('#f7931a')
BLUE = HexColor('#2d6cdf')
GREEN = HexColor('#1f8f57')
PURPLE = HexColor('#7b3fe4')
RED = HexColor('#c84d2f')
BROWN = HexColor('#7a5a2b')

SPACES = [
    ('GO / PRODUCTION', GOLD),
    ('WATER TRADE', BLUE),
    ('OPEN MARKET A', BROWN),
    ('FOOD TRADE', GREEN),
    ('CRISIS A', RED),
    ('COMMODITY EXCHANGE', GOLD),
    ('COMMUNITY WELL', BLUE),
    ('SHELTER TRADE', BROWN),
    ('OPEN MARKET B', BROWN),
    ('FISH TRADE', GREEN),
    ('GOLD MARKET', GOLD),
    ('GOVERNMENT LEVY', RED),
    ('TRADE ROUTE', PURPLE),
    ('MEDICI BANK', PURPLE),
    ('OPEN MARKET C', BROWN),
    ('CATTLE TRADE', GREEN),
    ('CRISIS B', RED),
    ('CENTRAL BANK', BLUE),
    ('VAULT / TREASURY', GOLD),
    ('BITCOIN SAVINGS', GOLD),
    ('LIGHTNING PAYMENT', PURPLE),
    ('OPEN MARKET D', BROWN),
    ('GENERATIONAL WEALTH', GREEN),
    ('RULER / POLICY', RED),
]

GO_PAYOUTS = [
    'Mango +10',
    'Water +5',
    'Fish +4',
    'Cow +1',
    'Shelter +1',
    'Coffee +6',
    'Shell Collector +4 shells',
    'Merchant: choose 1 small good',
]


def draw_box(c, x, y, w, h, label, color, rotate=0):
    c.saveState()
    if rotate:
        c.translate(x + w/2, y + h/2)
        c.rotate(rotate)
        x2, y2 = -w/2, -h/2
    else:
        x2, y2 = x, y
    c.setFillColor(white)
    c.setStrokeColor(color)
    c.setLineWidth(2)
    c.roundRect(x2, y2, w, h, 8, stroke=1, fill=1)
    c.setFillColor(color)
    c.rect(x2, y2 + h - 12, w, 12, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 8)
    text = label.split(' / ')
    yy = y2 + h - 28
    for line in text:
        c.drawCentredString(x2 + w/2, yy, line)
        yy -= 10
    c.restoreState()


def main():
    p = OUT / 'table-board-24space.pdf'
    c = canvas.Canvas(str(p), pagesize=landscape(letter))
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    margin = 28
    corner = 76
    side_w = 92
    side_h = 58
    left = margin
    bottom = 34
    right = W - margin
    top = H - 34

    # corners
    corners = [
        (left, top - corner, corner, corner, SPACES[0]),
        (right - corner, top - corner, corner, corner, SPACES[6]),
        (right - corner, bottom, corner, corner, SPACES[12]),
        (left, bottom, corner, corner, SPACES[18]),
    ]
    for x, y, w, h, (label, color) in corners:
        draw_box(c, x, y, w, h, label, color)

    # top row 1-5
    x = left + corner
    y = top - side_h
    for i in range(1, 6):
        draw_box(c, x, y, side_w, side_h, SPACES[i][0], SPACES[i][1])
        x += side_w

    # right col 7-11
    x = right - side_h
    y = top - corner - side_w
    for i in range(7, 12):
        draw_box(c, x, y, side_h, side_w, SPACES[i][0], SPACES[i][1], rotate=-90)
        y -= side_w

    # bottom row 13-17
    x = right - corner - side_w
    y = bottom
    for i in range(13, 18):
        draw_box(c, x, y, side_w, side_h, SPACES[i][0], SPACES[i][1])
        x -= side_w

    # left col 19-23
    x = left
    y = bottom + corner
    for i in range(19, 24):
        draw_box(c, x, y, side_h, side_w, SPACES[i][0], SPACES[i][1], rotate=90)
        y += side_w

    # center
    cx1, cy1 = left + corner + 14, bottom + corner + 14
    cw, ch = W - 2*(margin + corner + 14), H - 2*(bottom + corner + 14)
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.roundRect(cx1, cy1, cw, ch, 18, stroke=1, fill=0)
    c.setFont('Helvetica-Bold', 26)
    c.setFillColor(INK)
    c.drawCentredString(cx1 + cw/2, cy1 + ch - 34, 'MONEYPOLY · TABLE BOARD')
    c.setFont('Helvetica', 14)
    c.drawCentredString(cx1 + cw/2, cy1 + ch - 56, 'Same board. Same goal. Different money.')

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx1 + 18, cy1 + ch - 92, 'GOAL EACH ERA')
    c.setFont('Helvetica', 12)
    goals = [
        'Secure essentials: food, water, shelter',
        'Set aside at least 1 savings asset',
        'Run the same board through barter, shells, gold, slips, fiat, and sats',
        'Only the method of trading changes',
    ]
    yy = cy1 + ch - 110
    for g in goals:
        c.drawString(cx1 + 24, yy, f'• {g}')
        yy -= 18

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx1 + 18, cy1 + ch - 198, 'GO PAYOUTS')
    c.setFont('Helvetica', 11)
    yy = cy1 + ch - 216
    for item in GO_PAYOUTS:
        c.drawString(cx1 + 24, yy, f'• {item}')
        yy -= 15

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx1 + cw/2 + 18, cy1 + ch - 92, 'ERA LADDER')
    c.setFont('Helvetica', 12)
    eras = [
        '1. Barter only',
        '2. Add shells / commodity money',
        '3. Add gold',
        '4. Add slips / ledgers',
        '5. Add fiat / dollars',
        '6. Add sats',
    ]
    yy = cy1 + ch - 110
    for era in eras:
        c.drawString(cx1 + cw/2 + 24, yy, f'• {era}')
        yy -= 18

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx1 + cw/2 + 18, cy1 + ch - 230, 'TURN LOOP')
    c.setFont('Helvetica', 12)
    steps = [
        'Moderator rolls for the room',
        'Everyone moves',
        'Resolve landed space',
        'Collect GO payout if passed GO',
        'Moderator announces next roll or event',
    ]
    yy = cy1 + ch - 248
    for step in steps:
        c.drawString(cx1 + cw/2 + 24, yy, f'• {step}')
        yy -= 18

    c.save()
    print(p)

if __name__ == '__main__':
    main()
