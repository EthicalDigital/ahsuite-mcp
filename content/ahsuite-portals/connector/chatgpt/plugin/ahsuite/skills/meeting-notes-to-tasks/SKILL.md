---
name: meeting-notes-to-tasks
description: Turn meeting notes or a call summary into Ahsuite tasks plus a work journal entry. Use when the user pastes meeting notes, a transcript or call summary, or asks to log a client call and create the action items.
---

# Meeting notes to tasks and a journal entry

## 1. Read the notes

The notes can be pasted in the chat, or live on a portal page: then use
`list_pages` and `get_page` to read them.

Pull out:

- **Decisions** made
- **Action items**: what, who owns it (agency team or client), due date if
  one was said
- Anything **waiting on the client**

Resolve dates like "next Friday" to `YYYY-MM-DD` from today's date. If a due
date or owner is unclear, leave it blank and say so; don't guess.

## 2. Find the portal and journal

1. `list_portals` with `search` for the client's name. If more than one
   matches, ask which.
2. `list_journals` for that portal. If there's one journal, use it. If there
   are several, pick the one that fits the work, or ask. If there are none,
   offer to create one with `create_journal`.
3. If the work belongs to a project, `list_projects` and `get_project` to see
   its phases.

## 3. Show the plan

Show:

- The journal entry text (under 2000 characters): date, who attended,
  decisions, action items. Plain text.
- The tasks, one line each: name, owner, due date, and **whether it goes to
  the client**. Client-owned tasks are created with `assign_to_client: 1`,
  which emails the client, so list them separately and ask about them
  specifically.
- Where tasks go in the project, if any.

Wait for the user's yes. Let them edit or drop items.

## 4. Create

1. `add_journal_log` once with the agreed entry.
2. `create_task` once per task. Add checklist items with the `checklist`
   field if the notes have sub-steps. A successful call means the task
   exists; never retry it.
3. If agreed, `add_project_tasks` with the new task IDs and the phase.
4. For a team owner, `assign_task` with `assign_to: team_member` and their
   email, only if the user gave the email.

Finish with links or names of what was created and anything left out.

## Complete collection

For every list call used by this workflow, follow all pages using the tool's
`page` and `limit` parameters and returned pagination information. If no
pagination information is returned, continue until a page is shorter than
the requested limit. Traverse nested file folders recursively. If an error
or access limit prevents complete collection, identify the missing scope
and label the result partial; never report an incomplete scan as complete.
