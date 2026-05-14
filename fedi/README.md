# Sats Market for Fedi

Production test mini app route for `historyofmoney.me/fedi`.

## What it does

- Runs as a normal static website inside Fedi's Mini Apps browser.
- Uses Fedi-injected `window.nostr` to identify users and sign room events.
- Uses a Nostr relay for room presence, online player lists, trade requests, accepted invoices, paid receipts, and moderator crisis events.
- Uses Fedi-injected `window.webln` for real Lightning invoices and payments.
- No simulated ledger on this route: settlement requires Fedi/WebLN.

## Two-wallet test flow

1. Open `https://historyofmoney.me/fedi` inside Fedi wallet A.
2. Join the same room and choose what Wallet A sells.
3. Open `https://historyofmoney.me/fedi` inside Fedi wallet B.
4. Join the same room and choose what Wallet B sells.
5. Tap **Show me a trade** or click an online player.
6. Buyer sends a trade request.
7. Seller receives a request notification and taps **Accept + create invoice**.
8. Buyer receives the invoice notification and taps **Pay invoice**.
9. Fedi shows real approval screens for invoice creation/payment.
10. Moderator can publish crisis events from the configured moderator Nostr pubkey.

## APIs used

- `window.webln.enable()`
- `window.webln.getInfo()`
- `window.webln.makeInvoice({ amount, defaultMemo })`
- `window.webln.sendPayment(invoice)`
- `window.nostr.getPublicKey()` optional
- `window.nostr.signEvent(event)` optional

Sensitive actions are always user-approved by Fedi.
