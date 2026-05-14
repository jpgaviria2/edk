# Fedi Sats Market — Interactive Room Game

A live in-app trading game for the History of Money / EDK environment where participants already have:

- an app identity profile
- an in-app wallet with sats
- a room/session code shared by the facilitator
- a starting budget of **100 sats** for market purchases

## Learning Goal

Let learners feel the difference between:

1. **Earning** sats by producing value
2. **Spending** sats to solve real needs
3. **Saving / cold storage** as delayed consumption and self-custody
4. **Market matching** versus barter friction
5. **Price discovery** when every person has different goods, services, and urgency

The game should be social, fast, and mostly one-tap. The app should create the structure; humans create the negotiation.

---

## Recommended Game Name

**Sats Market**

Alternate names:

- Proof of Trade
- Market Match
- Spend, Earn, Save
- Fedi Flea Market

---

## Core Loop

Each player starts with:

- **100 sats spendable balance**
- **1 seller card**: a good, service, or skill they can sell
- **3 need cards**: things they want to buy this round
- **Cold storage vault**: starts at 0 sats

Each round:

1. The app randomly pairs players in the same room.
2. Each player sees the other player's profile and sell offer.
3. Both players choose one:
   - **Buy** from the other player
   - **Negotiate** a different price
   - **Skip**
   - **Send sats to cold storage**
4. If a buy happens, sats move wallet-to-wallet.
5. If no buy happens, both players record a missed opportunity / mismatch.
6. After 4–6 pairings, the app shows what each player earned, spent, saved, and still needs.

---

## Best Interaction Method

### Use structured peer-to-peer offers, not open chat-first trading

The app should avoid long freeform chat because live classrooms/events move fast. Use a structured trade card:

```text
JP is selling: Fix your bike tire
Price: 35 sats
Category: Service
Useful for: Transportation need
Buttons: Buy 35 sats · Counter · Skip · Save to cold storage
```

Why this is best:

- Fast enough for a room of 40–100 people
- Works with existing wallets
- Teaches price discovery without requiring a facilitator to adjudicate every trade
- Keeps UX safe: every payment has a clear item, counterparty, and amount
- Easy to audit in a debrief screen

### Payment flow

Preferred implementation:

1. Seller creates an in-app offer with price in sats.
2. Buyer taps **Buy**.
3. App shows confirmation: `Send 35 sats to Maria for “Logo design”?`
4. Buyer confirms.
5. Wallet sends sats instantly.
6. Both players receive a trade receipt.

If the app wallet supports internal transfers, use that first for speed and reliability. If it uses Lightning invoices, generate the invoice behind the scenes so the buyer does not manually paste/pay invoices during gameplay.

### Counter offers

Keep countering simple:

- Buyer can choose preset buttons: `-10 sats`, `-25%`, `Custom`
- Seller receives: `Accept · Reject · Counter once`
- Limit to one counter per pairing to keep rounds moving.

---

## Room / Pairing Model

### Facilitator creates a room

Room settings:

- Room name
- Starting sats: default 100
- Number of rounds: default 6
- Round timer: default 90 seconds
- Cold storage enabled: yes/no
- Shock events enabled: yes/no
- Skill/good deck: default or custom

Players join with room code or QR.

### Pairing algorithm

For each round:

- Randomly shuffle active players
- Pair players who have not traded together recently
- Avoid repeat pairings until necessary
- If odd player count, make one 3-person market table or assign a “market booth” bot

Pairing result:

```json
{
  "round": 3,
  "pairingId": "room123-r3-p7",
  "players": ["alice", "bob"],
  "expiresAt": "..."
}
```

---

## Player Assets

### Spendable sats

Used for buying goods/services during the game.

### Earned sats

Sats received from other players.

### Cold storage sats

A player can move sats into cold storage instead of spending them.

Game effect:

- Cold storage sats cannot be spent for the rest of the game or until a facilitator-defined unlock.
- They are protected from selected “custodial risk” or “impulse spending” events.
- They count heavily in the final score if basic needs were also met.

This teaches that saving is powerful, but over-saving can cause missed trade opportunities.

---

## Goods / Skills Deck

Every player gets one sellable thing. Examples:

### Goods

- Coffee beans — 20 sats
- Fresh bread — 25 sats
- Water bottle — 15 sats
- Notebook — 10 sats
- Bike tube — 35 sats
- Phone charger — 40 sats
- First-aid kit — 45 sats

### Services / Skills

- Fix a flat tire — 35 sats
- Tutor math for 10 minutes — 30 sats
- Design a poster — 40 sats
- Translate a message — 25 sats
- Carry supplies — 15 sats
- Repair a zipper — 30 sats
- Take a profile photo — 20 sats

### Digital / Knowledge goods

- Map to safe route — 20 sats
- Password hygiene lesson — 30 sats
- Event announcement design — 25 sats
- Lightning wallet setup help — 35 sats

---

## Need Cards

Each player has hidden or visible needs. Visible needs make trading easier; hidden needs create more price discovery.

Examples:

- Food
- Water
- Transport
- Shelter
- Communication
- Health
- Education
- Tools
- Reputation
- Savings

A purchase counts as “useful” if the seller's category satisfies one of the buyer's needs.

---

## Scoring

Final score should reward balanced economic behavior:

```text
Score = useful needs met
      + sats earned
      + sats saved in cold storage
      - failed/missed trade penalties
      - unmet urgent need penalties
```

Suggested scoring:

- Useful need met: +20
- Non-need purchase: +5
- Every 10 sats earned: +5
- Every 10 sats in cold storage: +8
- Failed pairing / no trade: -3
- Urgent need unmet: -15
- Ran out of spendable sats: -5

The key is not “richest wins.” Best outcome is **productive, liquid, and prepared**.

---

## Event Cards

Optional facilitator-controlled or automatic shocks:

### Impulse spending

“Flash sale! Anyone with more than 50 spendable sats is tempted to buy a status item.”

Choice:

- Buy status badge for 25 sats: +reputation, -sats
- Skip: no effect

### Custodial freeze

“Hosted wallet provider has a temporary outage.”

Effect:

- Spendable balance cannot move for one round
- Cold storage balance is unaffected

Use carefully if the real app wallet is custodial; frame it as a general custody lesson, not a claim about the app.

### Scarcity shock

“Water becomes scarce.”

Effect:

- Water category prices rise +20 sats for one round

### Reputation boost

“People liked your service.”

Effect:

- Seller may increase price by 10 sats next round

---

## Debrief Questions

- Who earned more sats than they started with? How?
- Who spent all 100 sats but solved important needs?
- Who saved to cold storage too early and missed useful trades?
- Who kept sats liquid and found better opportunities later?
- Did sats make trade easier than barter?
- What did identity/reputation change about trust?
- What is the tradeoff between convenience wallet balance and cold storage?

---

## MVP Feature Set

Build first:

1. Room creation / join code
2. Player profile pulled from app identity
3. Starting 100 sats game balance
4. Random pairings by round
5. Seller card assignment
6. Buy / skip / cold storage actions
7. Simple in-app sats transfer
8. Trade receipt log
9. Final debrief scoreboard

Do later:

- Counter offers
- Custom facilitator decks
- Shock events
- Reputation score
- Multi-room tournament mode
- Nostr/Fedi activity feed recap

---

## Implementation Notes

### Data entities

```ts
type GameRoom = {
  id: string
  code: string
  facilitatorId: string
  status: 'lobby' | 'active' | 'debrief' | 'closed'
  startingSats: number
  currentRound: number
  roundSeconds: number
}

type GamePlayer = {
  id: string
  roomId: string
  profileId: string
  displayName: string
  avatarUrl?: string
  spendableSats: number
  earnedSats: number
  coldStorageSats: number
  sellerCardId: string
  needCardIds: string[]
}

type TradeOffer = {
  id: string
  roomId: string
  round: number
  sellerId: string
  buyerId: string
  itemName: string
  category: string
  priceSats: number
  status: 'pending' | 'accepted' | 'skipped' | 'expired'
}
```

### Wallet safety

If using real sats:

- Keep amounts tiny: 100 sats starting balance is right.
- Every transfer needs explicit buyer confirmation.
- Add a facilitator “demo mode” where balances are simulated if funding is not ready.
- Make cold storage a game mechanic first; only connect to real withdrawal/cold storage after the educational UX is proven.

### Recommended MVP stance

Use **real identity + simulated game ledger** for the first prototype, then enable real sats transfers once the game is fun and the flow is stable.

Reason: it avoids failed Lightning/payment UX breaking the lesson during live events. Once tested, switch the `transferSats()` adapter from simulated ledger to real wallet transfer.

---

## Suggested First Prototype

A single web route inside the EDK/Fedi app:

```text
/sats-market
```

Screens:

1. Lobby
2. Seller/needs setup
3. Pairing round
4. Trade confirmation
5. Round summary
6. Final debrief

Primary CTA copy:

```text
Trade with sats. Earn by helping others. Decide what to spend, what to save, and what to protect.
```

---

## Solo Two-Wallet Test Mode

For JP's first Fedi-app test, the prototype includes a **solo two-wallet mode**:

- `JP Primary` acts as the buyer wallet/profile.
- `JP Test Wallet` acts as the seller wallet/profile.
- The tester can swap buyer/seller direction at any time.
- Buys require a confirmation step before sats move.
- By default, sats move only in the local game ledger.
- If the host app injects `window.FediSatsMarketAdapter.transferSats()`, the same confirmation flow can call a real app transfer adapter.

Expected adapter shape:

```js
window.FediSatsMarketAdapter = {
  async transferSats({ fromProfileId, toProfileId, amountSats, memo }) {
    // Create invoice/internal transfer, show wallet confirmation, return receipt metadata.
    return { id: 'wallet-receipt-id', mode: 'real-wallet' };
  }
};
```

Safety default: no real transfer happens unless the adapter exists. This lets the game be tested safely inside a WebView/Fedi environment before production wallet wiring.
