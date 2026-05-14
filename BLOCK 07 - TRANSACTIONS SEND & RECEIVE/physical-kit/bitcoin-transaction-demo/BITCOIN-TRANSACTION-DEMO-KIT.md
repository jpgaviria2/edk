# Bitcoin Transaction Demo Kit

Live-event kit for Block 7: Transactions — Send & Receive.

**Audience format:** 8 tables × 10 people = 80 participants  
**Session length:** 25–35 minutes inside a larger event, or 45 minutes as a standalone activity  
**Core idea:** people physically create transactions, nodes validate them, the mempool orders them by fees, miners compete to create blocks, and everyone updates the ledger.

---

## Facilitator Review of the Original Game Plan

The concept is strong. The practical demo is exactly the right improvement over a purely explanatory setup because people feel the system: waiting in the mempool, fee competition, validation, mining randomness, and ledger updates.

Recommended fixes before using it live:

1. **Use “signature cards,” not actual locked boxes for every transaction.**  
   Lockable boxes are memorable but slow for 80 people. Use one fake private-key envelope/stamp per wallet. A signed transaction must include the wallet’s matching stamp/sticker/secret word. Keep one lockbox at the front as a quick self-custody prop.

2. **Separate validation from mining clearly.**  
   Nodes validate transactions before mempool entry. Nodes then validate the winning block again before it is added, mainly to catch stale balances and double-spends.

3. **Track balances with one table ledger, not independent node ledgers only.**  
   Each node keeps a sheet, but table captain also maintains the “public ledger” so disputes don’t eat the round.

4. **Treat fees as a visible market.**  
   The mempool role should physically sort transactions from highest fee to lowest and explain: “Miners usually pick the most profitable transactions first.”

5. **Adjust dice difficulty for live pacing.**  
   - Low difficulty: roll at least **one 6** with 3 dice. Expected win is very fast.
   - Medium difficulty: roll at least **two 6s** with 3 dice. Better for a 1–2 minute mining race.
   - High difficulty: roll **three 6s** with 3 dice. This is a great demonstration of difficulty, but too slow for normal rounds. Use only as a 30-second “wow, blocks got harder” demo, then lower it or allow both miners to keep cumulative sixes.

6. **Make block rewards explicit as a coinbase transaction.**  
   The miner does not just “get tokens”; the block contains a special reward transaction: `NEW BTC → Miner`.

7. **Do not let wallets pre-check perfectly.**  
   Allow one or two invalid transactions on purpose: insufficient funds, fake signature, low-fee stuck transaction, double spend. That makes nodes valuable.

---

## Recommended Live Format for 8 Tables

Each table runs an identical miniature Bitcoin network.

### Roles per Table: 10 People

| Count | Role | What they do |
|---:|---|---|
| 4 | Wallets A–D | Create and sign transactions. Try to pay/receive BTC. |
| 2 | Nodes | Validate signatures, balances, and block contents. |
| 2 | Miners | Roll dice to find blocks and collect rewards/fees. |
| 1 | Mempool / Fee Market | Receives valid transactions, sorts by fee, announces top transactions. |
| 1 | Table Captain / Auditor | Keeps time, resolves disputes, maintains public ledger, reports final result. |

If you want everyone to experience every role, rotate roles after Round 2.

---

## Learning Outcomes

By the end, participants should be able to explain:

- Wallets create and sign transactions; they do not “send coins through the internet” like objects.
- Nodes enforce the rules before transactions and blocks are accepted.
- The mempool is a waiting room for valid, unconfirmed transactions.
- Fees influence which transactions miners include first.
- Mining is a probabilistic race to produce the next valid block.
- Difficulty adjusts so blocks do not come too quickly or too slowly.
- The blockchain is the shared history after nodes accept valid blocks.
- A miner can mine an empty block and still receive the block reward.
- Invalid transactions and invalid blocks are rejected even if a miner proposes them.

---

## Table Kit Contents

### Per Table Kit

Pack each table in a labelled bin or large envelope.

| Item | Quantity per table | Purpose |
|---|---:|---|
| Table sign | 1 | Table 1–8 |
| Role cards | 10 | Wallets, nodes, miners, mempool, captain |
| Wallet balance cards | 4 | Starting balances for Wallets A–D |
| Wallet private-key envelopes/stamps | 4 | Fake signing authority |
| Transaction cards | 40 | Enough for 4–5 rounds |
| Invalid transaction cards | 4 | Seeded teachable moments |
| Node validation checklist | 2 | One per node |
| Node ledger sheets | 2 | Node copy of balances |
| Public table ledger | 1 | Table captain source of truth |
| Mempool basket/tray | 1 | Physical waiting room |
| Fee sorting strip | 1 | High fee → low fee line |
| Block envelopes/boxes | 6 | One per mined block |
| Blockchain string/tape strip | 1 | Connect block envelopes in order |
| Dice | 6 | 3 dice per miner |
| Miner reward cards | 8 | Coinbase transaction cards |
| BTC tokens/sats tokens | 80–120 | Optional tactile accounting |
| Pens/markers | 6 | Transactions and ledgers |
| Round timer card | 1 | Pacing reminder |
| Debrief card | 1 | Final discussion prompts |

### Whole-Room Extras

| Item | Quantity | Purpose |
|---|---:|---|
| Lead facilitator script | 1 | Main stage pacing |
| Projected timer | 1 | Keeps 8 tables synchronized |
| Front-of-room demo lockbox | 1 | Memorable “private key” prop |
| Giant mempool basket | 1 | Optional stage visual |
| Giant block box | 1 | Optional stage visual |
| Spare transaction cards | 80 | Backup |
| Spare dice | 16 | Backup |
| Tape rolls | 8–12 | Blockchain strips and signs |
| Clipboards | 8–12 | Captains/nodes |

---

## Suggested Starting Balances

Use whole numbers so the room can do the math quickly.

| Wallet | Starting balance | Personality prompt |
|---|---:|---|
| Wallet A | 10 BTC | Wants to buy coffee from B |
| Wallet B | 10 BTC | Sells coffee, pays rent to C |
| Wallet C | 10 BTC | Runs the venue, pays staff D |
| Wallet D | 10 BTC | Staff member, sends money to A |
| Miner 1 | 0 BTC | Earns rewards and fees |
| Miner 2 | 0 BTC | Earns rewards and fees |

**Block reward:** 6 BTC for demo math.  
**Block size limit:** 4 transactions.  
**Fee options:** 0, 1, 2, or 3 BTC. High fee confirms first; zero-fee may wait.

Note: real Bitcoin does not use whole BTC fees like this. This is intentionally simplified.

---

## Transaction Card Fields

Every card should include:

- Transaction ID: `T____`
- From wallet: `A / B / C / D`
- To wallet: `A / B / C / D / Miner 1 / Miner 2`
- Amount: `____ BTC`
- Fee: `0 / 1 / 2 / 3 BTC`
- Total cost to sender: `amount + fee`
- Signature mark: sticker/stamp/secret word
- Node status: `valid / invalid`
- Reason if invalid: `bad signature / insufficient funds / double spend / malformed`

---

## Round Structure

Run 4 rounds for a 25–30 minute demo. Run 6 rounds for a 45 minute version.

### Round 0: Setup and Explainer — 5 minutes

Lead facilitator says:

> “Each table is a tiny Bitcoin network. Wallets create transactions. Nodes check the rules. Valid transactions wait in the mempool. Miners compete to build the next block. Nodes decide whether that block becomes part of the chain.”

Table captains confirm:

- wallets have balances
- nodes have ledger sheets
- mempool has basket
- miners have dice
- block envelopes are ready

### Step 1: Wallets Create Transactions — 2 minutes

Wallets fill transaction cards and sign them using their private-key envelope/stamp.

Rules:

- Sender must pay amount + fee.
- Wallets may create more than one transaction, but risky double-spends may be rejected.
- Encourage varied fees so the mempool has something to sort.

### Step 2: Nodes Validate Transactions — 2 minutes

Nodes check:

1. Is the transaction complete?
2. Does the signature match the sender?
3. Does sender have enough balance for amount + fee?
4. Has this same balance already been committed to another pending transaction?

Valid transactions go to the mempool. Invalid transactions are returned face-up with a reason.

### Step 3: Mempool Sorts by Fee — 1 minute

Mempool manager places valid transactions in order:

`3 BTC fee → 2 BTC fee → 1 BTC fee → 0 BTC fee`

Then announces:

> “Block space is limited. The next miner can include up to 4 transactions. Highest fees are first.”

### Step 4: Miners Mine — 1–3 minutes

Miners roll 3 dice repeatedly.

Recommended pacing:

- Round 1: Low difficulty, at least one 6.
- Round 2: Medium difficulty, at least two 6s.
- Round 3: High difficulty demo, three 6s. Time cap at 45 seconds; if no one wins, difficulty adjusts down.
- Round 4+: Choose difficulty based on room energy.

When a miner wins, they shout: **“Block found!”**

Winning miner builds a block:

- up to 4 highest-fee mempool transactions
- one coinbase/reward transaction: `NEW BTC → Miner, 6 BTC`

If the mempool is empty, miner builds an empty block with only the reward.

### Step 5: Nodes Validate the Block — 2 minutes

Nodes check:

1. Did the miner meet the dice difficulty?
2. Are all transactions from the mempool?
3. Are signatures valid?
4. Are balances still sufficient in block order?
5. Is the block reward correct?
6. Are fees paid to the miner correctly?

If valid: attach block to chain and update ledgers.  
If invalid: discard block, return transactions to mempool if still valid, mine again.

### Step 6: Update Balances — 2 minutes

For each transaction in the accepted block:

- subtract amount + fee from sender
- add amount to receiver
- add fee to winning miner
- add 6 BTC block reward to winning miner

Unconfirmed transactions remain in the mempool.

---

## Difficulty Adjustment Script

After every 2 rounds, lead facilitator asks:

> “Were blocks coming too fast or too slow?”

Then says:

- “Too fast? The network raises difficulty.”
- “Too slow? The network lowers difficulty.”
- “The goal is predictable block timing, not easy winning.”

For the live demo:

| Difficulty | Dice rule | Use case |
|---|---|---|
| Low | At least one 6 on 3 dice | First round, fast success |
| Medium | At least two 6s on 3 dice | Main live setting |
| High | Three 6s on 3 dice | Short demonstration only |
| High, cumulative | Collect three 6s across multiple rolls | If you want high difficulty but still finish |

---

## Seeded Teachable Moments

Give each table captain four optional “incident cards.” Use 1–2 only.

1. **Insufficient Funds**  
   Wallet A tries to send 9 BTC with a 3 BTC fee while only holding 10 BTC.

2. **Bad Signature**  
   Wallet C transaction has Wallet B’s signature mark.

3. **Low Fee Delay**  
   Wallet D sends a valid 0-fee transaction. It stays in the mempool while higher-fee transactions confirm.

4. **Double Spend Attempt**  
   Wallet B creates two transactions spending the same balance. Nodes must catch or block validation must reject the second.

5. **Empty Block**  
   If a miner wins before transactions arrive, they may mine an empty block and still receive the reward.

---

## 30-Minute Run of Show

| Time | Activity |
|---:|---|
| 0:00–0:05 | Explain roles and table setup |
| 0:05–0:11 | Round 1: easy block, simple successful transactions |
| 0:11–0:18 | Round 2: fee market and medium difficulty |
| 0:18–0:23 | Round 3: invalid transaction/double-spend + block validation |
| 0:23–0:27 | Difficulty adjustment demo / empty block if useful |
| 0:27–0:30 | Debrief: wallet vs node vs miner vs blockchain |

## 45-Minute Run of Show

| Time | Activity |
|---:|---|
| 0:00–0:06 | Explain roles and self-custody prop |
| 0:06–0:13 | Round 1: valid transactions, low difficulty |
| 0:13–0:21 | Round 2: fee competition, medium difficulty |
| 0:21–0:29 | Round 3: bad signature / insufficient funds |
| 0:29–0:36 | Round 4: double-spend and block validation |
| 0:36–0:41 | Difficulty adjustment and empty block demo |
| 0:41–0:45 | Debrief and table report-outs |

---

## Debrief Questions

Ask the room:

1. Who created transactions?
2. Who decided whether a transaction was valid?
3. Did miners get to change the rules?
4. Why did high-fee transactions confirm first?
5. What happened to transactions that did not fit in the block?
6. Why might a miner mine an empty block?
7. What did the blockchain represent at your table?
8. What would happen if one node lied but the rest rejected the block?
9. How is this different from a bank updating a private ledger?
10. What was the private key in this demo, and why did it matter?

---

## Print Pack Checklist

For 8 tables, print:

- 8 table signs
- 80 role cards
- 32 wallet balance cards
- 320 transaction cards minimum; 400 preferred
- 32 invalid/incident cards
- 16 node validation checklists
- 16 node ledger sheets
- 8 public table ledgers
- 8 mempool fee sorting strips
- 48 block labels/envelopes
- 16 miner reward sheets/cards
- 8 debrief cards

