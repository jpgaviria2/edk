from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import black, white, HexColor
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parent / 'history-of-money-card-trading-kit-bw-8up.pdf'
PAGE_W, PAGE_H = letter
MARGIN_X = 20
MARGIN_Y = 24
GAP_X = 10
GAP_Y = 12
COLS = 2
ROWS = 4
CARD_W = (PAGE_W - 2 * MARGIN_X - GAP_X * (COLS - 1)) / COLS
CARD_H = (PAGE_H - 2 * MARGIN_Y - GAP_Y * (ROWS - 1)) / ROWS
HEADER_H = 18
RADIUS = 12
BG = HexColor('#f6f6f6')
MID = HexColor('#b8b8b8')
LIGHT = HexColor('#e7e7e7')
TEXT_SOFT = HexColor('#444444')
CARD_TYPES = [
    ('Mango', 'Perishable food value', 'Useful food, but hard to store for long.', '////'),
    ('Cattle', 'High-value living wealth', 'Stores value, but bulky and hard to divide.', '\\\\'),
    ('Shelter', 'Protection & stability', 'Core need that becomes scarce under stress.', 'xxxx'),
    ('Water', 'Essential daily need', 'Universal demand makes it urgent and powerful.', '....'),
    ('Fish', 'Protein & market flow', 'Fast-moving food that pressures quick exchange.', 'oooo'),
    ('Gold Coins', 'Hard money era', 'Portable hard money with strong savings properties.', '++++'),
    ('Banknotes', 'Redeemable paper claims', 'Convenient claims that rely on trust and redemption.', '===='),
    ('Dollars', 'Fiat convenience', 'Easy to spend, easy to issue, easy to debase.', '####'),
]
COUNT = 100


def chunks(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]


def positions():
    top_y = PAGE_H - MARGIN_Y - CARD_H
    out = []
    for r in range(ROWS):
        for c in range(COLS):
            x = MARGIN_X + c * (CARD_W + GAP_X)
            y = top_y - r * (CARD_H + GAP_Y)
            out.append((x, y))
    return out


def crop_marks(pdf, x, y, w, h):
    m, l = 6, 10
    pdf.setStrokeColor(MID)
    pdf.setLineWidth(0.5)
    pdf.line(x - m, y + h, x - m + l, y + h)
    pdf.line(x, y + h + m, x, y + h + m - l)
    pdf.line(x + w + m, y + h, x + w + m - l, y + h)
    pdf.line(x + w, y + h + m, x + w, y + h + m - l)
    pdf.line(x - m, y, x - m + l, y)
    pdf.line(x, y - m, x, y - m + l)
    pdf.line(x + w + m, y, x + w + m - l, y)
    pdf.line(x + w, y - m, x + w, y - m + l)


def header(pdf, title, page_num, total_pages):
    pdf.setFillColor(TEXT_SOFT)
    pdf.setFont('Helvetica', 7)
    pdf.drawString(MARGIN_X, 10, title)
    pdf.drawRightString(PAGE_W - MARGIN_X, 10, f'Page {page_num} of {total_pages}')


def draw_face(pdf, card, x, y):
    crop_marks(pdf, x, y, CARD_W, CARD_H)
    pdf.setFillColor(white)
    pdf.setStrokeColor(black)
    pdf.setLineWidth(1.2)
    pdf.roundRect(x, y, CARD_W, CARD_H, RADIUS, stroke=1, fill=1)
    pdf.setFillColor(black)
    pdf.roundRect(x, y + CARD_H - HEADER_H, CARD_W, HEADER_H, RADIUS, stroke=0, fill=1)
    pdf.setFillColor(white)
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawString(x + 10, y + CARD_H - 13, card['label'])
    pdf.drawRightString(x + CARD_W - 10, y + CARD_H - 13, f"#{card['serial']:03d}")

    pdf.setFillColor(LIGHT)
    pdf.setStrokeColor(MID)
    pdf.roundRect(x + 18, y + CARD_H - 102, CARD_W - 36, 48, 10, stroke=1, fill=1)
    pdf.setFillColor(TEXT_SOFT)
    pdf.setFont('Courier-Bold', 15)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 82, card['pattern'])

    pdf.setFillColor(black)
    pdf.setFont('Helvetica-Bold', 15)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 120, card['label'])
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 135, card['note'])

    text = pdf.beginText(x + 14, y + CARD_H - 154)
    text.setFont('Helvetica', 8)
    text.setLeading(10)
    text.textLine('Workshop trade card · black & white print edition')
    text.textLine('')
    text.textLine(card['lesson'])
    pdf.drawText(text)

    pdf.setFillColor(LIGHT)
    pdf.setStrokeColor(black)
    pdf.roundRect(x + 16, y + 14, CARD_W - 32, 28, 8, stroke=1, fill=1)
    pdf.setFillColor(black)
    pdf.setFont('Helvetica-Bold', 9)
    pdf.drawCentredString(x + CARD_W / 2, y + 25, card['label'].upper())
    pdf.setFont('Helvetica', 7)
    pdf.drawCentredString(x + CARD_W / 2, y + 17, 'Front')


def draw_back(pdf, card, x, y):
    crop_marks(pdf, x, y, CARD_W, CARD_H)
    pdf.setFillColor(white)
    pdf.setStrokeColor(black)
    pdf.setLineWidth(1.2)
    pdf.roundRect(x, y, CARD_W, CARD_H, RADIUS, stroke=1, fill=1)
    pdf.setFillColor(BG)
    pdf.roundRect(x + 12, y + 12, CARD_W - 24, CARD_H - 24, RADIUS - 2, stroke=1, fill=1)
    pdf.setFillColor(black)
    pdf.setFont('Helvetica-Bold', 16)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 50, card['label'])
    pdf.setFont('Helvetica-Bold', 11)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 67, 'History of Money')
    pdf.setFont('Helvetica', 10)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H - 82, 'Card Trading Kit')

    pdf.setFillColor(LIGHT)
    pdf.setStrokeColor(MID)
    pdf.roundRect(x + 24, y + CARD_H / 2 - 24, CARD_W - 48, 48, 12, stroke=1, fill=1)
    pdf.setFillColor(TEXT_SOFT)
    pdf.setFont('Courier-Bold', 16)
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H / 2 + 6, card['pattern'])
    pdf.drawCentredString(x + CARD_W / 2, y + CARD_H / 2 - 10, card['pattern'])

    pdf.setFillColor(black)
    pdf.setFont('Helvetica', 9)
    pdf.drawCentredString(x + CARD_W / 2, y + 30, 'Block 02 · printable B&W deck back')
    pdf.drawCentredString(x + CARD_W / 2, y + 18, 'Flip on long edge')


def main():
    cards = []
    for label, note, lesson, pattern in CARD_TYPES:
        for serial in range(1, COUNT + 1):
            cards.append({'label': label, 'note': note, 'lesson': lesson, 'pattern': pattern, 'serial': serial})
    pos = positions()
    grouped = chunks(cards, COLS * ROWS)
    pdf = canvas.Canvas(str(OUT), pagesize=letter)
    total = len(grouped)

    for page_num, group in enumerate(grouped, start=1):
        header(pdf, 'Black & white fronts · safer 8-up layout', page_num, total)
        for (x, y), card in zip(pos, group):
            draw_face(pdf, card, x, y)
        pdf.showPage()

    for page_num, group in enumerate(grouped, start=1):
        header(pdf, 'Black & white mirrored backs · safer 8-up layout', page_num, total)
        rows = [group[i:i + COLS] for i in range(0, len(group), COLS)]
        mirrored = []
        for row in rows:
            mirrored.extend(reversed(row))
        for (x, y), card in zip(pos, mirrored):
            draw_back(pdf, card, x, y)
        pdf.showPage()

    pdf.save()
    print(OUT)


if __name__ == '__main__':
    main()
