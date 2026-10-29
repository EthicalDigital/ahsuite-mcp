---
name: onboard-client-portal
description: Set up a new client in Ahsuite. Use when the user signs a new client, asks to create or set up a client portal, or wants a welcome page, kickoff tasks, file requests or a project for a new client.
---

# Onboard a new client portal

Build a ready-to-use client portal with the Ahsuite connector, in one pass,
without surprising the client with emails.

## 1. Gather what you need

Before any create call, make sure you have:

- **Client company name** (the portal name) and the **primary contact's
  email**. The contact's name is optional. Never invent an email address.
- **Template or clean?** If the user hasn't said, ask whether to apply their
  default portal template (blueprint) or create a clean portal. Clean means
  `apply_template: 0`.
- **Welcome page content.** Page blocks can only be set when the page is
  created, so if the user hasn't described the page, ask which blocks they
  want (text, video, embed, form questions, file requests) first.
- **Kickoff tasks, file requests, project.** Use what the user listed. If
  they listed nothing, offer a short default set (a welcome page, a request for
  logo and brand files, one kickoff task) and wait for a yes.

## 2. Show the plan, then build

Show the plan as a short list: portal, pages, tasks (and who each is for),
file requests, project, extra contacts. Say plainly which steps will email the
client (see "Emails" below). Build only after the user agrees.

Then call, in this order:

1. `create_portal` once. A successful call means the portal exists; never
   retry it. Keep the `portal_id` it returns.
2. `create_page` once per page, with the blocks agreed above. Form questions
   and file requests can go on the page itself.
3. `create_task` once per task. Tasks are internal by default. Set
   `assign_to_client: 1` only for tasks the user said are for the client.
   Resolve dates like "Friday" to `YYYY-MM-DD` from today's date.
4. `create_file` for each item in the Files section: exactly one of a link, a
   file request or a folder per call. If it's unclear which one the user
   means, ask.
5. If the user wants a project: `create_project`, then `add_project_phase`
   for each phase, then `add_project_tasks` to place the tasks.
6. Extra client users: `create_contact` for each. Ask whether to send the
   invite email; the default is to add them silently.
7. Timezone or language: `list_timezones`, then `update_portal_preferences`.
   Never touch the security settings (two-step login, file access without
   login) unless the user asks.

## Emails

These steps email the client, so confirm each one first:

- `create_task` with `assign_to_client: 1`, and `assign_task` to the client
- `create_contact` with `send_client_email_notify: 1`
- `create_password` with `request` (asks the client to add a login's password)
- `update_file` turning on `require_client_approval`

## 3. Finish

Reply with what was created, grouped by type, and the next step for the user
(for example "upload the logo in the Ahsuite app"; uploads can't be done
through the connector). Offer the portal's Preview & Share link with
`get_portal_share_link`. Never call `generate_portal_share_link` when a link
already exists without asking: it breaks the old link.

## Rules

- Never ask for, accept or store a password. To save a login, use
  `create_password` with name, address and username only.
- Don't hard-code IDs. Get every ID from the tool that created or listed it.
- If a call fails, report the error and what was already created. Don't
  repeat create calls that succeeded.

## Complete collection

For every list call used by this workflow, follow all pages using the tool's
`page` and `limit` parameters and returned pagination information. If no
pagination information is returned, continue until a page is shorter than
the requested limit. Traverse nested file folders recursively. If an error
or access limit prevents complete collection, identify the missing scope
and label the result partial; never report an incomplete scan as complete.
