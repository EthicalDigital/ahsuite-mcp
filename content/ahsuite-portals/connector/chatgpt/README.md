# Ahsuite ChatGPT app: submission kit

Drafted Oct 27, 2026. This folder has everything needed to submit the Ahsuite
connector to the ChatGPT app directory:

- `chatgpt-app-submission.json`: the file you upload in OpenAI's submission
  form. It fills in App Info, the tool labels for all 71 tools, and the test
  cases (5 that should use Ahsuite, 3 that should not).
- This README: your steps, copy for every form field, and a message for the
  developer.

**Sources.** OpenAI's docs site (developers.openai.com) was blocked from the
machine that wrote this, so the rules come from OpenAI's own checklist on
GitHub:
[openai/plugins, `chatgpt-app-submission/SKILL.md`](https://github.com/openai/plugins/blob/main/plugins/openai-developers/skills/chatgpt-app-submission/SKILL.md)
(commit `0722921`, Oct 8, 2026, read Oct 27, 2026), plus the
`build-chatgpt-app` skill in the same repo. Steps marked **(unverified)** come
from web search summaries of
[Plugin guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)
and [Upload and submit your plugin](https://developers.openai.com/plugins/deploy/submission),
not from reading those pages. Open them once before you submit.

**What was checked live.** The connector was connected to the reviewer account
(portals Kettle & Crag Outfitters, Saguaro Coffee Roasters, Northwind Yoga
Studio, plus the "Claude MCP Reviewer" portal). Only list_* and get_* tools
were called. The expected outputs for test cases 1 to 3 are what those calls
returned on Oct 27. Test cases 4 and 5 create data, so they were **not run**;
their expected outputs come from the tool descriptions, not from our Claude
test notes (those files were not available to me, see "Not available" below).

## Part A. Your steps, in order

### 1. Verify the OpenAI organization as Ahsuite

1. Sign in at [platform.openai.com](https://platform.openai.com) as an
   **Owner** of the organization that should own the app. Only Owners can
   submit, unless an Owner gives you the "Apps Management Write" permission
   **(unverified)**.
2. Go to **Settings → Organization → General** and start verification. Verify
   your identity and that you act for Ahsuite (the business). Use the legal
   business name exactly as it appears on your documents **(unverified: exact
   menu names)**.
3. Wait for it to say Verified. You can't submit before that.

### 2. Test in ChatGPT developer mode with the reviewer account

1. In ChatGPT: **Settings → Apps & Connectors → Advanced settings**, turn on
   **Developer mode**.
2. Create a new app: name `Ahsuite`, MCP server URL
   `https://ahsuite.com/api/mcp`, authentication **OAuth**.
3. When the Ahsuite sign-in page opens, sign in with the **reviewer account**
   (not your main account). Approve access.
4. Start a new chat, turn on the Ahsuite app, and run the prompts below. Take a
   screenshot of each finished answer. **Don't put the prompt text inside the
   image**; OpenAI may overlay prompts itself **(unverified)**. Image size
   guidance from search results is 1 to 4 images, 706 px wide at 2x
   **(unverified)**.

   Screenshot these four:

   1. *"Across my client portals, which tasks are still waiting on the client,
      and which of them are overdue?"* (shows the cross-portal view; 8 tasks)
   2. *"Give me a phase-by-phase status of the Kettle & Crag website redesign
      project."* (shows depth on one client)
   3. *"Log today's call with Kettle & Crag in their work journal: we agreed to
      start launch prep next week. Then add two internal tasks for my team:
      "Prep the launch checklist" due next Friday, and "Book the launch
      shoot"."* (shows a safe write)
   4. *"Create a clean client portal for Juniper Lane Bakery (contact: Sam
      Rivera, sam@juniperlane.example.com) with a welcome page, an internal
      task to get the homepage design signed off by Friday, and a request for
      their logo files."* (shows the main "build it for me" flow)

5. Also run the 3 "should not trigger" prompts from the JSON and check
   ChatGPT answers without calling Ahsuite.
6. **Clean up after test 3 and 4**, in the Ahsuite app: delete the two test
   tasks, the journal entry and the Juniper Lane Bakery portal. The reviewer
   will run the same prompts, and duplicates make the expected outputs wrong.
   Leave everything else in the reviewer account exactly as it is; test cases
   1 to 3 depend on it.
7. Note: test case 1 says "all 8 are overdue". That stays true for any date
   after Oct 20, 2026, because the demo due dates are fixed. If anyone edits
   those tasks, update the JSON.

### 3. Before you submit: the developer's fixes

Send the developer message in Part C. Submission is blocked until **every tool
sets all three labels explicitly** (OpenAI treats a missing label as a
blocker), and until the domain token is live. When the developer says it's
deployed, refresh the app in ChatGPT developer mode so it reloads the tools,
and re-run the four screenshot prompts.

### 4. Submit

1. Go to the app submission page in the OpenAI Platform dashboard
   (platform.openai.com, Apps section) and start a new submission. Search
   results say the current flow submits apps as "plugins" and you pick the
   **With MCP** option **(unverified)**.
2. Upload `chatgpt-app-submission.json` where the form offers an import. It
   fills App Info, the tool labels and the test cases. Check each field after
   import.
3. Fill in the rest with the copy in Part B.
4. Do the domain verification step (Part C, item 2) when the form asks.
5. Submit for review. Watch the status in the dashboard. Publish only after it
   is approved.

## Part B. Form fields, ready to paste

| Field | Copy |
|---|---|
| App name | `Ahsuite` |
| Subtitle (30 max) | `Manage your client portals` (26 characters) |
| Category | `BUSINESS` (alternatives: `PRODUCTIVITY`, `COLLABORATION`) |
| MCP server URL | `https://ahsuite.com/api/mcp` |
| Authentication | OAuth (users sign in with their own Ahsuite account) |
| Website / docs | `https://ahsuite.com/ai` |
| Privacy policy | `https://ahsuite.com/privacy` |
| Terms of service | `https://ahsuite.com/terms` |
| Support contact | `support@ahsuite.com` |
| Logo | `logo-400.png` from the repo root (check OpenAI's size rule) |
| Reviewer login: email | `[REVIEWER EMAIL]` (the Claude reviewer account; see the note below) |
| Reviewer login: password | `[PASTE PASSWORD HERE, never save it in a file]` |

**URLs (unverified).** ahsuite.com was blocked from the machine that wrote
this, so I couldn't open the privacy, terms or docs pages. Open each once and
check it loads.

**Reviewer email.** This repo is public, so I left the address out of this
file on purpose. It's in your morning summary and in
`claude-directory-submission.md`. The account must sign in without MFA or
email/SMS codes **(unverified requirement, but common)**.

**Description** (same text as in the JSON; adapted from the public README
because the Claude listing text was not available to me):

> Ahsuite is client portal software for agencies, freelancers and service
> businesses. Connect your Ahsuite account to ask what's open, due or waiting
> on a client across your portals, and to read tasks, pages, files,
> conversations, projects, invoices and work journals. When you ask, it can
> also create portals and pages, create and assign tasks, add file requests,
> set up projects, write journal entries, reply to client conversations and
> create invoices. Tools that email your clients, such as assigning a task to
> the client or creating an invoice, say so. No tool takes or returns a
> password.

**Reviewer notes** (paste into any "instructions for reviewers" box):

> Sign in with the test account above. It holds three made-up client portals
> (Kettle & Crag Outfitters, Saguaro Coffee Roasters, Northwind Yoga Studio)
> with tasks, files, a project, invoices and a work journal. All client
> contacts use example.com addresses, so emails sent during testing go
> nowhere. Test cases 1 to 3 only read data. Test cases 4 and 5 create a
> journal entry, tasks and a new portal; please run them once.

**Release notes** (if asked): `First release of the Ahsuite app for ChatGPT.`

**Example prompts** (if the form asks for 3 to 5): use the four screenshot
prompts above.

**Data handling answers** (if asked): The app reads and changes data only in
the user's own Ahsuite account, after they sign in with OAuth. No tool takes
or returns a password. Ahsuite's privacy policy has a section on AI
assistants. Not intended for children. **(Check these against
https://ahsuite.com/privacy before pasting; I did not read the policy.)**

## Part C. Message for the developer

Copy everything between the lines.

---

Hi! We're submitting the Ahsuite MCP connector to the ChatGPT app directory.
Two things are needed on the server before we can submit.

**1. Set all three tool labels on every tool**

ChatGPT requires `readOnlyHint`, `destructiveHint` and `openWorldHint` on
**every** tool, set explicitly to `true` or `false`. A missing label blocks
the submission, even where MCP has a default. Please set them to the values in
the table below (they are also in
`content/ahsuite-portals/connector/chatgpt/chatgpt-app-submission.json`).

What each label means for OpenAI's review:

- `readOnlyHint: true` only if the tool only reads. Anything that creates,
  updates, sends or logs is `false`.
- `destructiveHint: true` if the tool can delete, overwrite or clear existing
  data, revoke access, make an irreversible change (like marking an invoice
  paid), or send a message or email that can't be unsent. Purely additive
  tools are `false`.
- `openWorldHint: true` if the tool can reach outside Ahsuite. Our rule: it is
  `true` when the tool can email or notify people outside the agency's
  account (client users). Changes that stay inside Ahsuite are `false`, and so
  are team-only notifications.

**Probably missing today:** I couldn't see the server's current annotations
(`annotations.json` and the live `tools/list` weren't visible to me). Claude's
directory needed `readOnlyHint`/`destructiveHint` but never `openWorldHint`,
so **`openWorldHint` is probably missing on all 71 tools**. Please check, and
add it everywhere.

**Labels that may differ from what we set for Claude** (please check against
`annotations.json`):

- Every `update_*` tool and `move_file` are `destructiveHint: true` here,
  because they replace or clear existing values. If any are `false` today,
  change them.
- `assign_task`, `create_task`, `create_contact`, `create_password`,
  `create_invoice`, `reply_to_conversation`, `update_file`,
  `add_task_comment`, `add_file_comment` and `update_task` are
  `destructiveHint: true` because they can send an email or notice that
  can't be unsent.
- `generate_portal_share_link` is `destructiveHint: true` (the old link stops
  working).
- `mark_notifications_read`, `move_question` and `add_file_version` are
  `false`/`false` (nothing is lost).

**Questions only you can answer** (each changes a label; marked in the
table):

1. Comments on tasks and files, and marking a client-created task done: is the
   client **emailed**, or only notified inside the portal? If portal only, set
   `openWorldHint` and `destructiveHint` to `false` on `add_task_comment` and
   `add_file_comment`, and `openWorldHint` to `false` on `update_task`.
2. Do any of these email the client: `create_portal` (invite to the primary
   contact?), `create_conversation` with `share_with_client=1`, `create_file`
   with a file request, `create_page` with file requests or questions,
   `add_file_version` on an approved file, `mark_invoice_paid` (receipt?),
   `update_page` with `draft=0`? If yes, that tool needs `openWorldHint: true`
   (and `destructiveHint: true`).
3. `update_portal_sidebar` contradicts itself: the tool description says
   sending `links` **replaces** the whole custom-links list, but the `links`
   field says existing tabs are **kept**. Which is right? Please fix the wrong
   one. OpenAI checks that descriptions match behavior.

Also, nice to have (not a blocker): add an `outputSchema` to each tool so
ChatGPT reads results more reliably
(https://modelcontextprotocol.io/specification/draft/server/tools#tool). I
couldn't see whether any tool has one today.

**Per-tool labels**

| Tool | readOnlyHint | destructiveHint | openWorldHint | Note |
|---|---|---|---|---|
| `add_checklist_items` | false | false | false |  |
| `add_file_comment` | false | true | true | **May email clients.** Unverified: is the client notified by email or only in the portal? If portal only, openWorldHint and destructiveHint can be false. |
| `add_file_labels` | false | false | false |  |
| `add_file_version` | false | false | false | Unverified: when an approved file goes back to approval required, is the client emailed? If yes, openWorldHint should be true. |
| `add_invoice_item` | false | false | false |  |
| `add_journal_log` | false | false | false |  |
| `add_project_phase` | false | false | false |  |
| `add_project_resources` | false | false | false |  |
| `add_project_tasks` | false | false | false |  |
| `add_tab` | false | false | false |  |
| `add_task_comment` | false | true | true | **May email clients.** Unverified: is the client notified by email or only in the portal? If portal only, openWorldHint and destructiveHint can be false. |
| `add_task_labels` | false | false | false |  |
| `assign_task` | false | true | true | **Emails clients.** |
| `create_contact` | false | true | true | **Emails clients.** |
| `create_conversation` | false | false | false | Unverified: does creating a client-shared thread (without a message) email the client? If yes, openWorldHint should be true. |
| `create_file` | false | false | false | Unverified: does a new file request email the client? If yes, openWorldHint should be true. |
| `create_invoice` | false | true | true | **Emails clients.** |
| `create_journal` | false | false | false |  |
| `create_page` | false | false | false | Unverified: does a page with file requests or form questions email the client? If yes, openWorldHint should be true. |
| `create_password` | false | true | true | **Emails clients.** |
| `create_portal` | false | false | false | Unverified: does creating a portal email the primary contact an invitation? If yes, openWorldHint and destructiveHint should be true. |
| `create_project` | false | false | false |  |
| `create_task` | false | true | true | **Emails clients.** |
| `delete_question` | false | true | false |  |
| `generate_portal_share_link` | false | true | false | Borderline openWorldHint: the link is a password-less public URL. Under our rule (only email/messages to outside people count) it stays false. |
| `get_conversation` | true | false | false |  |
| `get_file` | true | false | false |  |
| `get_invoice` | true | false | false |  |
| `get_journal` | true | false | false |  |
| `get_page` | true | false | false |  |
| `get_portal` | true | false | false |  |
| `get_portal_share_link` | true | false | false |  |
| `get_project` | true | false | false |  |
| `get_task` | true | false | false |  |
| `list_contacts` | true | false | false |  |
| `list_conversations` | true | false | false |  |
| `list_files` | true | false | false |  |
| `list_invoices` | true | false | false |  |
| `list_journals` | true | false | false |  |
| `list_notifications` | true | false | false |  |
| `list_pages` | true | false | false |  |
| `list_passwords` | true | false | false |  |
| `list_portals` | true | false | false |  |
| `list_projects` | true | false | false |  |
| `list_tasks` | true | false | false |  |
| `list_timezones` | true | false | false |  |
| `mark_invoice_paid` | false | true | false | Unverified: does marking paid email the client a receipt? If yes, openWorldHint should be true. |
| `mark_notifications_read` | false | false | false |  |
| `move_file` | false | true | false |  |
| `move_question` | false | false | false |  |
| `remove_invoice_adjustment` | false | true | false |  |
| `remove_invoice_item` | false | true | false |  |
| `reply_to_conversation` | false | true | true | **Emails clients.** |
| `update_account_manager` | false | true | false |  |
| `update_checklist_item` | false | true | false |  |
| `update_client_user_defaults` | false | true | false |  |
| `update_conversation` | false | true | false |  |
| `update_email_notifications` | false | true | false |  |
| `update_file` | false | true | true | **Emails clients.** |
| `update_invoice` | false | true | false |  |
| `update_invoice_item` | false | true | false |  |
| `update_journal` | false | true | false |  |
| `update_page` | false | true | false | Check: publishing a page (draft=0) makes it visible to the client; confirm no email is sent. |
| `update_portal_branding` | false | true | false |  |
| `update_portal_preferences` | false | true | false | Borderline openWorldHint: files_no_login=1 lets anyone with a file link open it without logging in. Under our rule it stays false. |
| `update_portal_sidebar` | false | true | false | Description conflict: the tool says links REPLACES the whole list, the links field says existing tabs are kept. Fix whichever is wrong. |
| `update_portal_variables` | false | true | false |  |
| `update_project` | false | true | false |  |
| `update_project_phase` | false | true | false |  |
| `update_question` | false | true | false |  |
| `update_task` | false | true | true | **May email clients.** Unverified: is the client notified by email when a task they created is marked done? If portal only, openWorldHint can be false. |

Two borderline calls, both kept `openWorldHint: false` under our rule:
`generate_portal_share_link` (makes a password-less public URL) and
`update_portal_preferences` (its `files_no_login` option lets anyone with a
file link open it). Tell me if you'd rather mark them `true`.

**2. Domain verification for ahsuite.com**

During submission OpenAI gives us a token. Please serve it at:

`https://ahsuite.com/.well-known/openai-apps-challenge`

- Plain text only (`Content-Type: text/plain`): just the exact token, no
  JSON, no extra spaces or lines, no HTML.
- HTTP 200, no redirect, no login, reachable from the public internet.
- It must be at the **root** of ahsuite.com, even though our MCP server is at
  `/api/mcp`. OpenAI uses the host and ignores the path.
- Keep it up until the app is approved (and after, in case they re-check).

I'll send you the token when the form shows it. Please tell me when the
labels and the challenge path are live, and I'll re-test.

Thanks!

---

## Review checks (from OpenAI's checklist)

These come from reading the tool descriptions and input fields, not the
server code (the code isn't in this repo).

- **Sensitive data in inputs.** None found. `create_password` takes a login
  name, address and username but never a password, and `list_passwords`
  never returns one. `update_portal_preferences` can switch two-step login and
  "file access without login"; its description already says to change these
  only when the user asks. Keep that wording.
- **Tool data use.** `get_portal_share_link` returns a password-less link that
  opens the client portal, and `get_file` / `get_task` / `get_page` return
  short-lived download links. That's expected, but mention it if a reviewer
  asks. `list_contacts` returns client email addresses.
- **Tool naming.** `update_portal_sidebar` has the conflicting description
  above. `create_file` doesn't upload files (only links, file requests and
  folders); its description says so, which is fine.
- **CSP / widgets.** The connector has no widgets, so there is no CSP to check
  **(unverified: assumes the server sends no UI resources)**.
- **outputSchema.** Couldn't check; see the nice-to-have above.

## How the labels were decided

- **Read-only (21 tools):** the 12 `list_*` and 9 `get_*` tools. I called
  them on the reviewer account and confirmed two edge cases: `get_conversation`
  did not clear a thread's unread flag, and `list_notifications` did not mark
  notifications read.
- **Writes (50 tools):** labeled from each tool's own description (what it
  creates, replaces, deletes or sends). Nothing was called.
- **Emails to people outside the account:** a tool gets
  `openWorldHint: true` when its description says it emails or notifies
  client users. Confirmed by the description: `assign_task`, `create_task`
  (with `assign_to_client=1`), `create_contact` (with the invite option),
  `create_password` (with `request`), `create_invoice` (always),
  `reply_to_conversation` (shared threads), `update_file` (turning on client
  approval). Notifies clients but email not confirmed: `add_task_comment`,
  `add_file_comment`, `update_task` (done on a client-created task). I marked
  these `true` to be safe; the developer can confirm.

## Not available while drafting

The repo this ran in (`EthicalDigital/ahsuite-mcp`) doesn't have
`docs/ahsuite-growth.md`, `claude-directory-submission.md`,
`content/ahsuite-site/github-kit/`, `docs/ahsuite-passwords.md` or
`annotations.json`. I couldn't reach the repo that holds them. So:

- The current annotations are **unknown**; the "probably missing" notes above
  are a guess based on Claude's directory rules.
- Test cases 4 and 5 are **not** checked against our Claude test notes.
- The description is adapted from the public README, not the Claude listing.

Check these three against those files before you submit.
