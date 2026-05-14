from pathlib import Path
from math import ceil
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "printables" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

BG = HexColor("#fffaf0")
INK = HexColor("#1b1b1b")
GOLD = HexColor("#f7931a")
GREEN = HexColor("#1f8f57")
BLUE = HexColor("#2d6cdf")
PURPLE = HexColor("#7b3fe4")
RED = HexColor("#c84d2f")
MUTED = HexColor("#666666")

ROLES = [
    ("Mango Farmer", "Start: 8 mangoes, 1 cow", ["Needs now: water, shelter", "Next generation: durable savings"]),
    ("Cattle Herder", "Start: 7 cows, 1 shelter", ["Needs now: water, mangoes", "Next generation: portable value"]),
    ("Water Keeper", "Start: 8 water, 1 fish", ["Needs now: cows, shelter", "Next generation: stable savings"]),
    ("Builder", "Start: 7 shelter, 1 cow", ["Needs now: mangoes, water", "Next generation: security"]),
    ("Fisher", "Start: 8 fish, 1 water", ["Needs now: shelter, mangoes", "Next generation: accepted money"]),
]

EVENTS = [
    ("Drought", "Water price doubles this round.", RED),
    ("Flood", "Shelter supply is reduced.", BLUE),
    ("Pest Outbreak", "Food supply is cut.", GREEN),
    ("Shell Rush", "More shells enter. Shell prices rise.", GOLD),
    ("Counterfeit Scare", "Gold verification required.", GOLD),
    ("Bank Run", "Slips redeem only if reserves exist.", PURPLE),
    ("Freeze Order", "Selected fiat balances cannot move this round.", BLUE),
    ("Money Printer", "Fiat supply expands. Adjust prices up.", RED),
    ("Confiscation", "Exposed gold can be seized.", RED),
    ("Wrong City", "Slip fails unless redeemable at this branch.", PURPLE),
    ("Lost Phone", "Hot-wallet team loses spending access this round.", BLUE),
    ("Seed Phrase Check", "Cold-storage teams keep savings if phrase retained.", GREEN),
    ("Node Verification", "Fake sats claim is rejected.", GOLD),
    ("Bandit Pass", "Carried gold is at risk.", RED),
    ("Stimulus", "Some tables get new notes first.", BLUE),
    ("Money Printer Fails", "No effect on sats supply.", GREEN),
]

SEEDS = [
    "orange river market shell cattle light field paper future stone mango ember",
    "coffee ladder hill lantern blue meadow copper water market paper olive grain",
    "sunset harbor cedar valley amber candle meadow lantern pebble willow river tide",
    "forest canyon maple orbit silver ember coral anchor velvet wheat signal dune",
]


def page(c, title, accent=GOLD):
    w, h = c._pagesize
    c.setFillColor(BG)
    c.rect(0, 0, w, h, stroke=0, fill=1)
    c.setFillColor(accent)
    c.rect(0, h - 30, w, 30, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(24, h - 20, f"Moneypoly Meetup Kit · {title}")
    c.setFillColor(INK)


def rounded_card(c, x, y, w, h, accent=GOLD, fill=white):
    c.setFillColor(fill)
    c.setStrokeColor(accent)
    c.setLineWidth(1.5)
    c.roundRect(x, y, w, h, 12, stroke=1, fill=1)
    c.setFillColor(accent)
    c.roundRect(x, y + h - 18, w, 18, 12, stroke=0, fill=1)
    c.setFillColor(INK)


def draw_lines(c, x, y, width, lines, size=11, leading=14, color=INK, bold_first=False):
    yy = y
    for i, line in enumerate(lines):
        c.setFillColor(color)
        c.setFont("Helvetica-Bold" if (bold_first and i == 0) else "Helvetica", size)
        wrapped = simpleSplit(line, c._fontname, size, width)
        for frag in wrapped:
            c.drawString(x, yy, frag)
            yy -= leading
    return yy


def grid_positions(page_w, page_h, cols, rows, margin=28, gap=12, top_pad=48, bottom=28):
    usable_w = page_w - margin * 2 - gap * (cols - 1)
    usable_h = page_h - top_pad - bottom - gap * (rows - 1)
    cell_w = usable_w / cols
    cell_h = usable_h / rows
    pos = []
    for r in range(rows):
        for c in range(cols):
            x = margin + c * (cell_w + gap)
            y = page_h - top_pad - (r + 1) * cell_h - r * gap
            pos.append((x, y, cell_w, cell_h))
    return pos


def save_roles():
    p = OUT / "role-cards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 2)
    cards = ROLES * 2
    for i in range(0, len(cards), 4):
        page(c, "Role Cards", GREEN)
        for (title, start, bullets), (x, y, w, h) in zip(cards[i:i+4], pos):
            rounded_card(c, x, y, w, h, GREEN)
            c.setFont("Helvetica-Bold", 18)
            c.drawString(x + 12, y + h - 42, title)
            c.setFillColor(MUTED)
            c.setFont("Helvetica-Bold", 12)
            c.drawString(x + 12, y + h - 62, start)
            draw_lines(c, x + 12, y + h - 84, w - 24, bullets, size=11, leading=15)
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 11)
            c.drawString(x + 12, y + 18, "Goal: survive today → preserve wealth → pass it down")
        c.showPage()
    c.save()
    return p


def save_have_need():
    p = OUT / "have-need-cards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 5, gap=10)
    for _ in range(4):
        page(c, "Have / Need Cards", BLUE)
        for x, y, w, h in pos:
            rounded_card(c, x, y, w, h, BLUE)
            c.setFont("Helvetica-Bold", 13)
            c.drawString(x + 12, y + h - 38, "I HAVE")
            c.line(x + 12, y + h - 46, x + w - 12, y + h - 46)
            c.drawString(x + 12, y + h - 70, "I NEED NOW")
            c.setFont("Helvetica", 11)
            c.drawString(x + 12, y + h - 86, "food / water / shelter")
            c.setFont("Helvetica-Bold", 13)
            c.drawString(x + 12, y + h - 112, "I NEED NEXT GENERATION")
            c.line(x + 12, y + h - 120, x + w - 12, y + h - 120)
        c.showPage()
    c.save()
    return p


def save_acceptance():
    p = OUT / "commodity-acceptance-signs.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 4)
    page(c, "Commodity Acceptance Signs", GOLD)
    for x, y, w, h in pos:
        rounded_card(c, x, y, w, h, GOLD)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(x + w/2, y + h - 40, "THIS TABLE ACCEPTS")
        items = ["☐ Shells", "☐ Coffee Beans", "☐ Beads", "☐ Gold", "☐ Paper Notes", "☐ Sats"]
        yy = y + h - 72
        for item in items:
            c.setFont("Helvetica", 14)
            c.drawString(x + 26, yy, item)
            yy -= 20
    c.showPage(); c.save(); return p


def save_price_boards():
    p = OUT / "price-boards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    page(c, "Master Price Board", GOLD)
    rounded_card(c, 40, 90, 532, 620, GOLD)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(306, 660, "BASE PRICES")
    prices = [
        "1 mango = $1 = 100 sats",
        "1 water = $2 = 200 sats",
        "1 fish = $4 = 400 sats",
        "1 cow = $10 = 1,000 sats",
        "1 shelter = $20 = 2,000 sats",
        "1 gold coin = $25 = 2,500 sats",
        "1 credit slip = 0.9 gold coin after 10% fee",
    ]
    yy = 600
    for line in prices:
        c.setFont("Helvetica-Bold", 19)
        c.drawCentredString(306, yy, line)
        yy -= 58
    c.showPage()
    pos = grid_positions(*letter, 2, 4)
    page(c, "Tabletop Price Boards", GOLD)
    for x, y, w, h in pos:
        rounded_card(c, x, y, w, h, GOLD)
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(x + w/2, y + h - 38, "TABLETOP PRICE BOARD")
        draw_lines(c, x + 16, y + h - 68, w - 32, prices[:6], size=12, leading=18)
    c.showPage(); c.save(); return p


def save_event_cards():
    p = OUT / "event-cards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 4)
    for i in range(0, len(EVENTS), 8):
        page(c, "Event Cards", RED)
        for (title, body, accent), (x, y, w, h) in zip(EVENTS[i:i+8], pos):
            rounded_card(c, x, y, w, h, accent)
            c.setFont("Helvetica-Bold", 18)
            c.drawString(x + 12, y + h - 42, title)
            draw_lines(c, x + 12, y + h - 68, w - 24, [body], size=12, leading=16)
        c.showPage()
    c.save(); return p


def save_credit_slips():
    p = OUT / "medici-credit-slips.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 4)
    for _ in range(2):
        page(c, "Medici Credit Slips", PURPLE)
        for x, y, w, h in pos:
            rounded_card(c, x, y, w, h, PURPLE)
            c.setFont("Helvetica-Bold", 16)
            c.drawString(x + 12, y + h - 40, "MEDICI CREDIT SLIP")
            lines = [
                "Branch issued: ____________________",
                "Redeemable at: ___________________",
                "Depositor: _______________________",
                "Gross deposit: ______ gold",
                "Fee: 10%",
                "Net claim: ______________________",
                "Manager signature: ______________",
                "Ledger entry #: _________________",
            ]
            draw_lines(c, x + 12, y + h - 62, w - 24, lines, size=10, leading=13)
        c.showPage()
    c.save(); return p


def save_ledgers():
    p = OUT / "ledger-sheets.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    for _ in range(6):
        page(c, "Branch Ledger Sheets", PURPLE)
        rounded_card(c, 30, 60, 552, 690, PURPLE)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(48, 712, "BRANCH: ______________________")
        c.drawString(320, 712, "STARTING RESERVES: __________ GOLD")
        headers = ["Entry #", "Player", "Deposit", "Withdrawal", "Slip Issued", "Fee", "New Reserve", "Signature"]
        xs = [48, 98, 188, 260, 345, 420, 465, 530]
        c.setFont("Helvetica-Bold", 9)
        for header, x in zip(headers, xs):
            c.drawString(x, 680, header)
        y = 662
        for _row in range(18):
            c.line(46, y, 564, y)
            y -= 28
        for x in [46, 94, 184, 256, 341, 416, 461, 526, 564]:
            c.line(x, 662, x, 158)
        c.showPage()
    c.save(); return p


def save_wallet_cards():
    p = OUT / "wallet-cards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 4)
    cards = []
    for seed in SEEDS:
        cards.extend([
            ("HOT WALLET", ["Easy to spend.", "Risk: phone loss or theft can reduce spendable sats."], BLUE),
            ("COLD STORAGE", ["Harder to spend quickly.", "Best for generational savings."], GREEN),
            ("FAKE SEED PHRASE", [seed, "Never use real seed words."], GOLD),
            ("NODE / LIGHTNING", ["Verify rules.", "Fast small payments for small purchases."], PURPLE),
        ])
    for i in range(0, len(cards), 8):
        page(c, "Wallet / Seed / Node Cards", GOLD)
        for (title, body, accent), (x, y, w, h) in zip(cards[i:i+8], pos):
            rounded_card(c, x, y, w, h, accent)
            c.setFont("Helvetica-Bold", 16)
            c.drawString(x + 12, y + h - 40, title)
            draw_lines(c, x + 12, y + h - 64, w - 24, body, size=10 if title == "FAKE SEED PHRASE" else 12, leading=14)
        c.showPage()
    c.save(); return p


def save_scorecards():
    p = OUT / "final-scorecards.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    pos = grid_positions(*letter, 2, 5, gap=10)
    categories = ["Food 0/1", "Water 0/1", "Shelter 0/1", "Next generation 0/2", "Preserved wealth 0/3", "No freeze/seizure loss 0/2", "Strong money use 0/3", "Explain lesson 0/3", "Total: ____"]
    for _ in range(4):
        page(c, "Final Scorecards", GREEN)
        for x, y, w, h in pos:
            rounded_card(c, x, y, w, h, GREEN)
            c.setFont("Helvetica-Bold", 14)
            c.drawString(x + 10, y + h - 34, "FINAL SCORECARD")
            draw_lines(c, x + 10, y + h - 56, w - 20, categories, size=9.5, leading=11)
        c.showPage()
    c.save(); return p


def save_table_signs():
    p = OUT / "table-signs.pdf"
    c = canvas.Canvas(str(p), pagesize=landscape(letter))
    w, h = landscape(letter)
    for n in range(1, 9):
        page(c, f"Table {n}", GOLD)
        c.setStrokeColor(GOLD)
        c.setLineWidth(4)
        c.roundRect(60, 90, w - 120, h - 180, 22, stroke=1, fill=0)
        c.setFont("Helvetica-Bold", 48)
        c.drawCentredString(w / 2, h / 2 + 28, "MONEYPOLY")
        c.setFont("Helvetica-Bold", 96)
        c.drawCentredString(w / 2, h / 2 - 64, f"TABLE {n}")
        c.showPage()
    c.save(); return p


def save_cheat_sheet():
    p = OUT / "facilitator-cheat-sheet.pdf"
    c = canvas.Canvas(str(p), pagesize=letter)
    page(c, "Facilitator Cheat Sheet", GOLD)
    rounded_card(c, 36, 60, 540, 690, GOLD)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(52, 712, "Goal")
    draw_lines(c, 52, 688, 500, ["Survive today, preserve wealth, and pass value to the next generation."], size=14, leading=18)
    sections = [
        ("Order", ["Barter → Commodity → Gold → Ledgers → Fiat → Bitcoin"], BLUE),
        ("Barter", ["Feel double coincidence of wants."], GREEN),
        ("Commodity", ["Acceptance lowers trade friction."], GOLD),
        ("Gold", ["Harder money, harder portability."], GOLD),
        ("Ledgers", ["Trust and signatures matter."], PURPLE),
        ("Fiat", ["Convenience with debasement and control risk."], BLUE),
        ("Bitcoin", ["Scarce digital money with self-custody tradeoffs."], GREEN),
        ("Close", ["The deepest question is what preserves the fruits of work across time."], RED),
    ]
    y = 640
    for title, body, accent in sections:
        c.setFillColor(accent)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(52, y, title)
        y = draw_lines(c, 140, y, 390, body, size=12, leading=16) - 10
    c.showPage(); c.save(); return p


def save_manifest():
    outputs = [
        save_roles(), save_have_need(), save_acceptance(), save_price_boards(), save_event_cards(),
        save_credit_slips(), save_ledgers(), save_wallet_cards(), save_scorecards(), save_table_signs(), save_cheat_sheet()
    ]
    manifest = ROOT / "printables" / "pdf" / "MANIFEST.txt"
    manifest.write_text("\n".join(p.name for p in outputs) + "\n", encoding="utf-8")
    print("Generated PDFs:")
    for p in outputs:
        print(f"- {p.name} ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    save_manifest()
