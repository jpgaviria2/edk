# Sats Market for Fedi

Production test mini app route for `historyofmoney.me/fedi`.

## What it does

- Runs as a normal static website inside Fedi's Mini Apps browser.
- Uses Fedi-injected `window.webln` for real Lightning invoices and payments.
- Uses optional `window.nostr` identity/signing for profile display and signed receipts.
- No simulated ledger on this route: invoice creation and payment buttons require Fedi/WebLN.

## Two-wallet test flow

1. Open `https://historyofmoney.me/fedi` inside Fedi wallet A.
2. On **Sell / create invoice**, choose an item and amount.
3. Tap **Create real Fedi invoice** and approve invoice creation in Fedi.
4. Copy/share the invoice.
5. Open `https://historyofmoney.me/fedi` inside Fedi wallet B.
6. On **Buy / pay invoice**, paste the invoice.
7. Tap **Pay with Fedi wallet** and approve the payment in Fedi.
8. Check receipts on each device.

## APIs used

- `window.webln.enable()`
- `window.webln.getInfo()`
- `window.webln.makeInvoice({ amount, defaultMemo })`
- `window.webln.sendPayment(invoice)`
- `window.nostr.getPublicKey()` optional
- `window.nostr.signEvent(event)` optional

Sensitive actions are always user-approved by Fedi.
