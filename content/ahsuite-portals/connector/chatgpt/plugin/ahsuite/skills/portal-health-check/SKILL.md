---
name: portal-health-check
description: Check an Ahsuite client portal for loose ends and setup gaps and suggest fixes. Use when the user asks for a portal audit, health check or review, wants to know what's missing or stale in a client's portal, or is tidying portals before a launch or renewal.
---

# Portal health check

Read-only. Report what you find and suggest fixes; change nothing unless the
user then asks for a specific fix.

## 1. Read the portal

1. `list_portals` with `search` to find it (or every portal, if the user asks
   for all).
2. `get_portal`: contact info, timezone, language, sidebar, account manager
   card, client user defaults, email notification settings, branding,
   variables.
3. `list_contacts`: who's active, who's still `invited`, who declined.
4. `list_tasks`: open tasks, their owners and due dates.
5. `list_files` (and inside each folder with `folder_id`): requests not yet
   uploaded, files waiting for approval.
6. `list_pages`: pages still in draft.
7. `list_conversations`: threads with unread replies.
8. `list_invoices`: unpaid and overdue invoices.
9. `list_passwords`: saved logins whose password is still `needed` or
   `requested`. Never ask for or show a password.
10. `list_projects` and `get_project`: open tasks not placed in any phase.

## 2. Score it

Report in three groups, most important first:

- **Fix now**: overdue client tasks, overdue invoices, unread client replies,
  file requests the client hasn't answered for over a week.
- **Tidy up**: open tasks with no due date or no owner, pages left in draft,
  invited contacts who never joined, logins with no password, project tasks
  outside any phase.
- **Setup**: wrong or missing timezone, account manager card hidden, sidebar
  showing tools the portal doesn't use, summary email turned off.

For each finding give one line: what, where, and the fix (naming the tool
that would do it, for example `update_task` to add a due date).

Two settings are reported but never changed on your own: two-step login and
file access without login (in `get_portal` preferences). Mention their state
only.

## 3. Offer fixes

Ask which fixes to make. Before any fix that emails the client (assigning to
the client, sending a reply, turning on file approval) or removes something,
show exactly what will happen and get a yes.

## Complete collection

For every list call used by this workflow, follow all pages using the tool's
`page` and `limit` parameters and returned pagination information. If no
pagination information is returned, continue until a page is shorter than
the requested limit. Traverse nested file folders recursively. If an error
or access limit prevents complete collection, identify the missing scope
and label the result partial; never report an incomplete scan as complete.
