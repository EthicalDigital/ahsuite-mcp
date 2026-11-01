---
name: chase-overdue-client-tasks
description: Draft friendly nudges for overdue client tasks in Ahsuite and send only the ones the user approves. Use when the user wants to chase, nudge, remind or follow up with clients about late approvals, uploads or other tasks.
---

# Chase overdue client tasks

Draft first, send only after an explicit yes. Every send notifies the client
and can't be taken back.

## 1. Find what's overdue

1. `list_portals` (page through all of them), or `search` when the user named
   a client.
2. `list_tasks` for each portal. Keep tasks where `assign_to_client` is 1, the
   status is not `done` or `canceled`, and the due date is before today.
3. For each one, `get_task` to read the description, checklist and the newest
   comments. If someone already nudged in the last few days, say so and
   suggest skipping it.
4. If the portal has a client-shared conversation about the same thing
   (`list_conversations`, then `get_conversation`), read it too.

## 2. Draft the nudges

For each task, write a short message (2 to 4 sentences):

- Name the task and what's needed, in plain words.
- Say the original due date, without blame.
- Offer help or a quick way to finish ("reply with the file here", "a quick
  yes is enough").
- Propose a new date only if the user gave one.

Group several overdue tasks for the same client into one message when that's
kinder than several pings.

Show every draft in a numbered list with the client, the task and where it
would be posted:

- on the task, with `add_task_comment` (the client is notified when the task
  is shared with them), or
- in an existing client-shared conversation, with `reply_to_conversation`
  (the client is notified and usually emailed).

## 3. Ask, then send

Ask which drafts to send, and let the user edit them. Then post exactly the
approved ones, each once. Never send a draft the user didn't approve, and
never send in bulk on a general "go ahead" without the list in front of them.

Don't change due dates, assignees or statuses unless the user asks. If they
ask to push a date, use `update_task` with `due_date`. If they want to tag
chased tasks, use `add_task_labels` (for example a "Nudged" label).

Finish with what was sent and what was skipped.
