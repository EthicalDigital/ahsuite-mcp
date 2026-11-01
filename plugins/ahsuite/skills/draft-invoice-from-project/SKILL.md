---
name: draft-invoice-from-project
description: Draft an Ahsuite invoice from a project's scope and past billing, and create it only after the user confirms. Use when the user asks to invoice or bill a client, draft an invoice for a project or retainer, or work out what to charge this month.
---

# Draft an invoice from a project

Creating an invoice always emails the client an "action required" notice, and
it can't be unsent. So this skill drafts in the chat and creates nothing until
the user says yes to the exact draft.

## 1. Gather

1. `list_portals` with `search` for the client.
2. `list_projects`, then `get_project` for the project being billed: its
   description often states the fee, payment terms and what's been done.
3. `list_invoices` to see what's already been billed, and `get_invoice` on
   the most recent ones to copy their line-item style, currency and notes.
   Check you're not about to bill the same thing twice.
4. Optional: `get_journal` for logged hours if the user bills by time.

## 2. Draft

Build the draft from what you found **and what the user tells you**:

- Line items: name, description, quantity, price per unit, any add or
  subtract adjustments.
- Invoice date and due date (`YYYY-MM-DD`), currency (USD or GBP), notes.

Never invent a price, quantity, discount or date. If the project says "fixed
fee, half paid at kickoff", you may suggest the second half, but show
where the number came from and ask the user to confirm it. If anything is
missing, ask.

Show the draft as a table with the total, and say: "Creating this invoice
emails it to the client. Create it now?"

## 3. Create, only after yes

1. `create_invoice` once with the confirmed items, dates, currency and notes.
   Leave `invoice_number` out unless the user gave one.
2. `get_invoice` on the new invoice and show the result.

To fix a mistake on an unpaid invoice afterwards, use `update_invoice` (header),
`add_invoice_item` or `update_invoice_item`. Removing an item or adjustment
(`remove_invoice_item`, `remove_invoice_adjustment`) can't be undone; confirm
first. Never call `mark_invoice_paid` unless the user says the client paid.
