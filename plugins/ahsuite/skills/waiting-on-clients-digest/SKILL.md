---
name: waiting-on-clients-digest
description: Weekly digest of everything waiting on clients across Ahsuite portals. Use when the user asks what's waiting on clients, what's blocked, what's overdue, for a weekly client status, or a Monday or Friday round-up across portals.
---

# What's waiting on clients: weekly digest

Read-only. This skill never creates, sends or changes anything.

## 1. Collect

1. `list_portals` with `limit: 100`. Keep paging (`page: 2`, ...) until you
   have every portal. If the user named some portals or a search term, use
   `search` and stop there.
2. For each portal:
   - `list_tasks` (`limit: 100`). A task is **waiting on the client** when
     `assign_to_client` is 1 (its assignee is the client or a named client
     user) and its status is not `done` or `canceled`.
   - `list_files` (`limit: 100`). Items with status
     `client_approval_required` wait on a client approval; `request_file` is a
     file the client still has to upload. Folders can hold more: when a
     folder exists, also call `list_files` with its `folder_id`.
   - `list_invoices`. An invoice with status `due` and a due date before today
     is overdue.
   - `list_conversations`. `new_message: 1` means a thread has unread replies.
     That usually waits on the team, so list it in its own section.
3. With many portals this is a lot of calls. Tell the user how many portals
   you're checking. Over 30, offer to start with the most recent 30, or a
   search, before going on.

Compare every due date with today's date. Don't guess dates.

## 2. Write the digest

Start with one line of totals: "N items waiting on clients in M portals, K
overdue."

Then one section per portal that has anything, most overdue first:

- **Overdue**: item, who it's with, due date, days late
- **Due this week**
- **Waiting, no due date**
- **Files to approve or upload**
- **Unpaid invoices**: number, amount, due date

End with a short "Needs your reply" list from the unread conversations, and a
list of portals with nothing waiting (names only).

Show statuses in plain words ("Ready for Work", "In Progress",
"Requested", "Client Approval Required").

## 3. Offer next steps

Offer, don't do: chase the overdue tasks (the chase-overdue-client-tasks
skill), or open any one item with `get_task`, `get_file` or `get_invoice`.
Don't mark notifications read or change any task.
