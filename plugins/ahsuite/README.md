# Ahsuite

Ready-made agency workflows for [Ahsuite](https://ahsuite.com) client portals.
The plugin connects Claude to your Ahsuite account and adds six skills that
know how to run common agency jobs with the Ahsuite tools.

## Skills

| Skill | What it does |
|---|---|
| `onboard-client-portal` | Sets up a new client: portal, welcome page, kickoff tasks, file requests and an optional project. |
| `waiting-on-clients-digest` | A weekly round-up of what's waiting on clients across your portals: overdue tasks, files to approve or upload, unpaid invoices. Read-only. |
| `chase-overdue-client-tasks` | Drafts friendly nudges for late client tasks and posts only the ones you approve. |
| `meeting-notes-to-tasks` | Turns meeting notes into tasks and a work journal entry. |
| `draft-invoice-from-project` | Drafts an invoice from a project's scope and past invoices, and creates it only after you confirm. |
| `portal-health-check` | Checks one portal for loose ends and setup gaps and suggests fixes. Read-only. |

## Use it

1. Install the plugin, then connect the **Ahsuite** connector from the
   plugin's Connectors tab (or run `/mcp` in Claude Code) and sign in to
   Ahsuite. You need an Ahsuite account.
2. Ask in your own words, for example:
   - "What's waiting on clients this week?"
   - "Set up a portal for Juniper Lane Bakery, contact sam@juniperlane.example.com."
   - "Here are my notes from today's call with Kettle & Crag. Make the tasks
     and log it."
   - "Chase the overdue client tasks."

Claude asks before any step that emails your client (assigning a task to the
client, replying in a client conversation, creating an invoice) and before
anything that can't be undone.

## Data

The plugin has no code of its own. It uses one connector, the Ahsuite MCP
server at `https://ahsuite.com/api/mcp`, which you sign in to with OAuth.
Claude reads and changes data only in the Ahsuite account you sign in with,
and only when you ask. The plugin sends nothing anywhere else and stores
nothing. No tool takes or returns a password. See the
[Ahsuite privacy policy](https://ahsuite.com/privacy).

## Support

Email [support@ahsuite.com](mailto:support@ahsuite.com) or see
[ahsuite.com/ai](https://ahsuite.com/ai).
