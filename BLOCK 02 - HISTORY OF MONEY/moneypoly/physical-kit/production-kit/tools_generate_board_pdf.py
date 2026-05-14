from pathlib import Path
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import simpleSplit
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
MUTED = HexColor('#666666')

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

ERA_LADDER = [
    '1. Barter',
    '2. Shells',
    '3. Gold',
    '4. Slips / Ledgers',
    '5. Fiat / Dollars',
    '6. Sats',
]

SPACE_RULES = [
    ('GO / Production', 'Collect your role payout when you land on or pass GO.'),
    ('Water / Food / Fish / Shelter / Cattle Trade', 'Buy the resource, sell it if allowed, or skip.'),
    ('Open Market', 'Choose 1 posted trade or skip.'),
    ('Commodity Exchange', 'Convert goods into the current exchange medium when the era allows it.'),
    ('Crisis Space', 'Resolve the active event if it affects you.'),
    ('Community Well', 'Emergency water / recovery space when rules or events allow it.'),
    ('Gold Market', 'Convert into or out of gold when the era allows it.'),
    ('Government Levy / Ruler Policy', 'Apply taxes, freezes, confiscations, subsidies, or decrees.'),
    ('Trade Route', 'Optional cross-table trade window when the moderator opens it.'),
    ('Medici Bank', 'Deposit gold, receive signed slips, redeem slips, or verify branch rules.'),
    ('Central Bank', 'Introduce or use fiat and resolve printing or freeze effects.'),
    ('Vault / Treasury', 'Protect reserves or staged savings if rules allow it.'),
    ('Bitcoin Savings', 'Convert into sats, choose custody, or protect savings.'),
    ('Lightning Payment', 'Make one fast small sats payment.'),
    ('Generational Wealth', 'Set aside future savings for final scoring.'),
]


def page_bg(c, title):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.roundRect(18, H - 28, W - 36, 16, 8, stroke=0, fill=1)
    c.setFont('Helvetica-Bold', 13)
    c.setFillColor(white)
    c.drawString(28, H - 23, title)
    c.setFillColor(INK)


def wrap_label(label):
    if ' / ' in label:
        return label.split(' / ')
    parts = label.split()
    if len(parts) <= 2:
        return [' '.join(parts)]
    if len(parts) == 3:
        return [' '.join(parts[:2]), parts[2]]
    return [' '.join(parts[:2]), ' '.join(parts[2:])]


def draw_box(c, x, y, w, h, label, color, rotate=0, fs=8):
    lines = wrap_label(label)
    c.saveState()
    if rotate:
        c.translate(x + w / 2, y + h / 2)
        c.rotate(rotate)
        x, y = -w / 2, -h / 2
    c.setFillColor(white)
    c.setStrokeColor(color)
    c.setLineWidth(2)
    c.roundRect(x, y, w, h, 9, stroke=1, fill=1)
    c.setFillColor(color)
    c.roundRect(x + 2, y + h - 14, w - 4, 10, 6, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', fs)
    start_y = y + h / 2 + (4 if len(lines) == 1 else 8)
    for i, line in enumerate(lines):
        c.drawCentredString(x + w / 2, start_y - i * 10, line)
    c.restoreState()


def draw_board_page(c):
    page_bg(c, 'Moneypoly · 24-Space Moderator Board')

    margin_x = 26
    margin_y = 28
    corner = 84
    top_bottom_w = 110
    top_bottom_h = 68
    side_w = 68
    side_h = 110

    left = margin_x
    right = W - margin_x
    bottom = margin_y
    top = H - margin_y

    # corners
    corners = [
        (left, top - corner, corner, corner, SPACES[0]),
        (right - corner, top - corner, corner, corner, SPACES[6]),
        (right - corner, bottom, corner, corner, SPACES[12]),
        (left, bottom, corner, corner, SPACES[18]),
    ]
    for x, y, w, h, (label, color) in corners:
        draw_box(c, x, y, w, h, label, color, fs=9)

    # top row 1-5
    x = left + corner
    y = top - top_bottom_h
    for i in range(1, 6):
        draw_box(c, x, y, top_bottom_w, top_bottom_h, SPACES[i][0], SPACES[i][1], fs=8)
        x += top_bottom_w

    # right side 7-11
    x = right - side_w
    y = top - corner - side_h
    for i in range(7, 12):
        draw_box(c, x, y, side_w, side_h, SPACES[i][0], SPACES[i][1], rotate=-90, fs=8)
        y -= side_h

    # bottom row 13-17
    x = right - corner - top_bottom_w
    y = bottom
    for i in range(13, 18):
        draw_box(c, x, y, top_bottom_w, top_bottom_h, SPACES[i][0], SPACES[i][1], fs=8)
        x -= top_bottom_w

    # left side 19-23
    x = left
    y = bottom + corner
    for i in range(19, 24):
        draw_box(c, x, y, side_w, side_h, SPACES[i][0], SPACES[i][1], rotate=90, fs=8)
        y += side_h

    # center board area
    cx = left + corner + 18
    cy = bottom + corner + 18
    cw = W - 2 * (margin_x + corner + 18)
    ch = H - 2 * (margin_y + corner + 18)
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.roundRect(cx, cy, cw, ch, 18, stroke=1, fill=0)

    c.setFont('Helvetica-Bold', 28)
    c.drawCentredString(cx + cw / 2, cy + ch - 36, 'MONEYPOLY')
    c.setFont('Helvetica', 14)
    c.setFillColor(MUTED)
    c.drawCentredString(cx + cw / 2, cy + ch - 56, 'Same board. Same goal. Different money.')
    c.setFillColor(INK)

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx + 22, cy + ch - 88, 'CORE OBJECTIVE')
    c.setFont('Helvetica', 12)
    bullets = [
        'Secure food, water, and shelter.',
        'Set aside at least 1 savings asset.',
        'Run the same board through all money eras.',
    ]
    yy = cy + ch - 108
    for b in bullets:
        c.drawString(cx + 28, yy, f'• {b}')
        yy -= 18

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx + 22, cy + ch - 176, 'TURN LOOP')
    c.setFont('Helvetica', 12)
    steps = [
        '1. Moderator rolls for the room',
        '2. Everyone moves',
        '3. Resolve landed space',
        '4. Collect GO payout if you passed GO',
        '5. Moderator reveals next roll or event',
    ]
    yy = cy + ch - 196
    for s in steps:
        c.drawString(cx + 28, yy, s)
        yy -= 17

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx + cw / 2 + 10, cy + ch - 88, 'ERA LADDER')
    c.setFont('Helvetica', 12)
    yy = cy + ch - 108
    for era in ERA_LADDER:
        c.drawString(cx + cw / 2 + 18, yy, f'• {era}')
        yy -= 18

    c.setFont('Helvetica-Bold', 14)
    c.drawString(cx + cw / 2 + 10, cy + ch - 216, 'SPACE RULE')
    c.setFont('Helvetica', 12)
    lines = simpleSplit('The spaces stay the same. Only the payment method changes: barter → shells → gold → slips → fiat → sats.', 'Helvetica', 12, cw / 2 - 32)
    yy = cy + ch - 236
    for line in lines:
        c.drawString(cx + cw / 2 + 18, yy, line)
        yy -= 16

    c.setFont('Helvetica-Bold', 12)
    c.drawCentredString(cx + cw / 2, cy + 22, 'See page 2 for payouts, space legend, and facilitator notes.')


def draw_legend_page(c):
    page_bg(c, 'Moneypoly · Board Legend')
    c.setFont('Helvetica-Bold', 24)
    c.drawString(28, H - 52, 'Board Legend + GO Payouts')
    c.setFont('Helvetica', 12)
    c.setFillColor(MUTED)
    c.drawString(28, H - 70, 'Use this page as the banker / moderator reference sheet.')
    c.setFillColor(INK)

    c.setFont('Helvetica-Bold', 14)
    c.drawString(28, H - 104, 'GO PAYOUTS')
    c.setFont('Helvetica', 11)
    yy = H - 124
    for item in GO_PAYOUTS:
        c.drawString(34, yy, f'• {item}')
        yy -= 15

    c.setFont('Helvetica-Bold', 14)
    c.drawString(28, yy - 8, 'SPACE LEGEND')
    yy -= 28
    c.setFont('Helvetica', 10.5)
    for title, desc in SPACE_RULES:
        c.setFont('Helvetica-Bold', 10.5)
        c.drawString(34, yy, f'• {title}')
        yy -= 13
        c.setFont('Helvetica', 10.2)
        for line in simpleSplit(desc, 'Helvetica', 10.2, W - 80):
            c.drawString(48, yy, line)
            yy -= 12
        yy -= 5
        if yy < 80:
            c.showPage()
            page_bg(c, 'Moneypoly · Board Legend (cont.)')
            yy = H - 50

    c.setFont('Helvetica-Bold', 14)
    c.drawString(W / 2 + 40, H - 104, 'FACILITATOR REMINDER')
    c.setFont('Helvetica', 11)
    reminder = [
        'Same board, same needs, same objective.',
        'Only the money layer changes each era.',
        'Keep turns fast: land, decide, resolve, next roll.',
        'Use posted trades instead of open-ended bargaining.',
        'Stage events should name: who is affected + consequence.',
    ]
    yy2 = H - 124
    for r in reminder:
        c.drawString(W / 2 + 46, yy2, f'• {r}')
        yy2 -= 16


def main():
    p = OUT / 'table-board-24space.pdf'
    c = canvas.Canvas(str(p), pagesize=landscape(letter))
    draw_board_page(c)
    c.showPage()
    draw_legend_page(c)
    c.save()
    print(p)

if __name__ == '__main__':
    main()
