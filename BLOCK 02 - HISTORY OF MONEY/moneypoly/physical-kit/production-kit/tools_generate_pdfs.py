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

ERA_EVENTS = {
    "Barter": {
        "accent": RED,
        "cards": [
            ("Drought", "Remove 1 water token from each table, then double the posted water price until the next event."),
            ("Flood", "Remove 1 shelter token from each team that has shelter; if a team has none, they lose 1 point at scoring."),
            ("Pest Outbreak", "Remove 2 food tokens from the table supply before any new trades happen."),
            ("Cattle Sickness", "All cow trades now require 2 extra food tokens on top of the usual price this round."),
            ("Builder Shortage", "The first 2 shelter trades at this table fail automatically; after that, shelter trades resume normally."),
            ("Spoiled Goods", "Any team holding more than 6 food tokens must discard 2 immediately."),
            ("Changed Appetite", "Each team flips one current need to a different survival need chosen by the banker."),
            ("Trade Rumor", "Choose 1 good at the table. No team may accept that good for the next 2 minutes."),
            ("Long Walk", "One chosen team skips its next trade attempt."),
            ("Family Emergency", "Each team must secure 1 survival good in the next 2 minutes or lose 1 scoring point."),
            ("Storage Rot", "Every team discards 1 stored food token from savings."),
            ("Sudden Feast", "Food needs are ignored for 1 minute, but water and shelter still count."),
            ("Broken Bridge", "No cross-table movement or banker-assisted swaps for the next 2 minutes."),
            ("Storm Delay", "All trading freezes for 60 seconds while the timer keeps running."),
            ("Double Wants Fail", "No team may trade unless both sides say out loud what they want and it matches exactly."),
            ("No Small Change", "Cow or shelter trades cannot be split; they must be traded as full units only this round."),
            ("Trader Absent", "One randomly chosen role packet at the table cannot trade for 90 seconds."),
            ("Seasonal Glut", "Choose 1 common good. Its trade value drops by half until the next event."),
            ("Scarcity Panic", "All teams now add water to their immediate needs until the next event."),
            ("Next-Generation Pressure", "Before trading again, each team must place 1 token aside as future savings."),
        ]
    },
    "Commodity Money": {
        "accent": GOLD,
        "cards": [
            ("Shell Acceptance", "From now until the next event, every seller at this table must accept shells."),
            ("Shell Rush", "Give 3 extra shells to every team, then raise all shell-priced goods by 1 shell."),
            ("Bean Spoilage", "Coffee beans can no longer be used as money at this table for the next 2 minutes."),
            ("Bead Mistrust", "Any payment using beads requires double quantity until the next event."),
            ("Small Change Win", "Any team may break 1 large unit into 2 smaller purchases without penalty this round."),
            ("Commodity Tax", "Each team pays 1 shell or 1 equivalent good to stay in the market this round."),
            ("Beach Harvest", "Add 20 shells to the table supply and increase shell prices by 1 more shell."),
            ("Coffee Mold", "Discard 10 coffee beans from the table supply immediately."),
            ("Fashion Boom", "Beads are accepted by everyone for 2 minutes, even if they were previously rejected."),
            ("Acceptance Split", "Half the teams, chosen by the banker, may only accept shells; the other half may only accept beans."),
            ("Tray Spill", "Remove 5 mixed commodity-money units from the table supply at random."),
            ("Hoarding Wave", "Each team must move 2 shells out of circulation into private savings until the next event."),
            ("Exchange Premium", "Any swap from goods into shells costs 1 extra good this round."),
            ("Mixed Basket Confusion", "Teams must announce the money type before paying; any unclear payment fails."),
            ("Merchant Preference", "Choose 1 seller role. That role accepts only shells until the next event."),
            ("Counterfeit Shell", "The next 3 shell payments must be inspected by the banker before they count."),
            ("Standard Weight", "Only payments in exact units of 2 are valid for the next 2 minutes."),
            ("Long-Distance Trader", "One table may trade with a neighboring table, but only using commodity money."),
            ("Commodity Shortage", "Choose 1 money good and remove half of it from the table supply."),
            ("Market Standardization", "Pick 1 commodity and make it the only accepted money at this table until the next event."),
        ]
    },
    "Gold": {
        "accent": GOLD,
        "cards": [
            ("Purity Check", "The next 3 gold payments do not count until the banker stamps them verified."),
            ("Bandit Pass", "Any team openly holding more than 3 gold loses 1 gold to the banker immediately."),
            ("Clipped Coin", "All gold payments are worth 1 less unit until the next event."),
            ("Making Change", "No banker or seller may make change for gold this round; overpay or do not trade."),
            ("Vault Fee", "Each team storing gold must pay 1 small good or 1 shell as a storage fee."),
            ("Assay Success", "Verified gold buys 1 extra small good on the next trade."),
            ("Hidden Stash", "Each team may protect 1 gold from theft by placing it face down in savings."),
            ("Ruler Tribute", "Every team pays 1 gold or loses access to 1 trade attempt."),
            ("Gold Shortage", "Remove 10 gold from circulation at this table."),
            ("Travel Burden", "Any team moving 3 or more gold skips its next turn."),
            ("Merchant Premium", "The first gold payment this round gets priority and a 1-unit discount."),
            ("Fake Coin Panic", "All gold trades pause until the banker approves the next 2 payments."),
            ("Mine Discovery", "Add 10 gold to the bank reserve, then reduce gold prices by 1 small unit."),
            ("Border Toll", "Any cross-table gold trade costs 1 gold fee."),
            ("Wedding Demand", "Shelter and status goods priced in gold cost 1 extra gold this round."),
            ("Inheritance Chest", "Any team that sets aside 2 gold in savings gains 1 bonus point at scoring."),
            ("Confiscation Order", "Any gold not hidden in savings is reduced by 1 for each team."),
            ("Reserve Exchange", "Teams may convert shells or fiat into gold, but lose 20% in the exchange."),
            ("Weighed Payment", "Only exact gold amounts count; no rounding or substitutions allowed."),
            ("Secure Vault", "Gold placed into vault storage is immune to the next gold-related event."),
        ]
    },
    "Credit & Ledgers": {
        "accent": PURPLE,
        "cards": [
            ("Trusted Branch", "All signed slips from this branch are accepted by every team until the next event."),
            ("Wrong City", "Any slip without the correct branch name is immediately void."),
            ("Bank Run", "The first 3 redemption requests succeed; all later ones must wait until the next round."),
            ("Double-Entry Check", "If the ledger is complete, this table gains 1 bonus point; if not, all slips pause."),
            ("Late Courier", "Cross-table slip transfers are frozen for 2 minutes."),
            ("Forged Signature", "Any unstamped or unsigned slip is discarded immediately."),
            ("Reserve Reveal", "The banker must show reserves before issuing more slips; if short, no more slips this round."),
            ("Fee Hike", "All new slip issuance costs 20% instead of 10% until the next event."),
            ("Account Freeze", "One chosen team cannot redeem slips this round."),
            ("Debt Call", "Any team holding more than 3 slips must redeem or lose 1 slip immediately."),
            ("Quiet Transfer", "One team may transfer value by slip without moving any physical money."),
            ("Ledger Fire", "Cross out the last ledger entry and resolve the dispute before play continues."),
            ("Branch Merger", "This table may accept slips from one neighboring table’s branch for 1 round."),
            ("Merchant Acceptance", "All sellers at this table must accept signed slips for the next 2 minutes."),
            ("Stamp Required", "A slip without banker mark plus signature does not count."),
            ("Political Pressure", "The banker must deny service to 1 chosen team this round."),
            ("Reserve Shortage", "Only half the outstanding slips may be redeemed right now."),
            ("Redemption Window", "Teams have 90 seconds to redeem slips or hold them to the next era."),
            ("Audit Day", "If every issued slip matches the ledger, trust is restored and fees drop to 0 for 1 round."),
            ("Trusted Network", "This table may settle one trade with another table using only signed slips."),
        ]
    },
    "Fiat": {
        "accent": BLUE,
        "cards": [
            ("Stimulus", "Give 5 fiat notes to 2 chosen teams first, then 2 notes to everyone else."),
            ("Freeze Order", "One chosen team cannot spend fiat until the next event."),
            ("Money Printer", "Give every team 3 extra notes and raise all fiat prices by 2 notes."),
            ("Price Controls", "Prices stay posted, but sellers may refuse one low-priced sale each round."),
            ("Salary Lag", "Each team loses 1 purchasing-power point unless they already hold hard assets."),
            ("Rent Repricing", "Shelter now costs 3 extra notes until the next event."),
            ("Bank Holiday", "No fiat withdrawals, exchanges, or banker conversions for 2 minutes."),
            ("Favored Recipients", "The first 2 teams to receive new notes may buy before repricing happens."),
            ("Surprise Tax", "Each team hands 2 fiat notes back to the banker immediately."),
            ("Confiscation Notice", "Any team showing more than 10 notes loses 3 notes."),
            ("Black Market Premium", "Any scarce good costs double in fiat this round."),
            ("Wage Illusion", "Give each team 2 notes, then raise every posted fiat price by 3 notes."),
            ("Debt Relief", "Any team owing fiat debt clears it, but savers lose 2 notes."),
            ("Bank Fees", "Every fiat payment to the banker costs 1 extra note."),
            ("Note Redesign", "Exchange old notes with the banker within 90 seconds or they expire."),
            ("Inflation Panic", "Teams may make only 1 purchase before all fiat prices rise by 1 more note."),
            ("Interest Cut", "Savings in fiat earn nothing; hard-asset savers gain 1 scoring point instead."),
            ("Merchant Repricing", "Each seller increases one good price immediately by 2 notes."),
            ("Subsidy Coupon", "One chosen good is discounted by 2 notes for all teams this round."),
            ("Cash Limit", "Any fiat payment above 5 notes must be split into two separate trades."),
        ]
    },
    "Bitcoin": {
        "accent": GREEN,
        "cards": [
            ("Node Verification", "The banker rejects the next fake or incorrect sats payment automatically."),
            ("Money Printer Fails", "No extra sats are created; leave all sats balances unchanged."),
            ("Lost Phone", "One hot-wallet team cannot spend sats for the next 2 minutes."),
            ("Seed Phrase Check", "Any cold-storage team with its seed card keeps full savings through the next shock."),
            ("Lightning Instant", "One small sats payment settles immediately with no delay or fee."),
            ("Mempool Spike", "Any on-chain style settlement costs 1 extra fee token this round."),
            ("Phishing Attempt", "Any team that cannot explain its custody choice loses 1 sats payment opportunity."),
            ("Self-Custody Win", "Cold-storage teams ignore the next freeze or confiscation event."),
            ("Confiscation Attempt", "Goods may still be lost, but self-custodied sats balances stay unchanged."),
            ("Watch-Only Audit", "The banker may verify one balance without moving those sats."),
            ("Miner Inclusion", "One pending sats trade becomes final immediately."),
            ("Fee Estimation", "Teams choosing to wait save the fee; teams rushing pay 1 fee token."),
            ("Power Outage", "Pause sats spending for 60 seconds, but do not change any balances."),
            ("Backup Restored", "One affected team regains access if it still holds its seed card."),
            ("Hot Wallet Convenience", "Hot-wallet teams may make 1 extra small purchase this round."),
            ("Cold Storage Patience", "Cold-storage teams cannot spend for 1 minute but gain 1 bonus point if they keep savings intact."),
            ("Inheritance Plan", "Any team that can explain how heirs recover funds gains 1 point."),
            ("Merchant Sats Discount", "One seller offers a 1-unit discount for sats payment this round."),
            ("Recovery Failure", "Any team without a seed backup loses access to 2 sats units until the next round."),
            ("Global Liquidity", "One team may settle a trade with any table in sats without moving physical goods."),
        ]
    }
}


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
    for era, meta in ERA_EVENTS.items():
        cards = [(era, title, body, meta["accent"]) for title, body in meta["cards"]]
        for i in range(0, len(cards), 8):
            page(c, f"{era} Event Cards", meta["accent"])
            for (era_name, title, body, accent), (x, y, w, h) in zip(cards[i:i+8], pos):
                rounded_card(c, x, y, w, h, accent)
                c.setFont("Helvetica-Bold", 8)
                c.setFillColor(MUTED)
                c.drawString(x + 12, y + h - 32, f"ERA: {era_name.upper()}")
                c.setFillColor(INK)
                c.setFont("Helvetica-Bold", 11)
                c.drawString(x + 12, y + h - 48, f"EVENT: {title}")
                c.setFont("Helvetica-Bold", 9)
                c.setFillColor(MUTED)
                c.drawString(x + 12, y + h - 64, "CONSEQUENCE:")
                c.setFillColor(INK)
                draw_lines(c, x + 12, y + h - 78, w - 24, [body], size=9.5, leading=12)
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
