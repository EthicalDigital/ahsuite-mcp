<p align="center"><img src="logo-400.png" alt="Ahsuite" width="200"></p>

# Ahsuite MCP connector

Run your agency's client portals from Claude and other AI assistants.

[Ahsuite](https://ahsuite.com) is client portal software for agencies,
freelancers and service businesses. Each client gets a branded portal with
pages, tasks, files, conversations, invoices and work journals. The Ahsuite
connector is a hosted [MCP](https://modelcontextprotocol.io) server that lets an
AI assistant work in your Ahsuite account when you ask it to.

- **Server URL:** `https://ahsuite.com/api/mcp` (Streamable HTTP)
- **Sign-in:** OAuth with your own Ahsuite account
- **MCP Registry:** `com.ahsuite/mcp`
- **Docs:** [ahsuite.com/ai](https://ahsuite.com/ai) and the
  [API and MCP reference](https://ahsuite.com/api-docs)

This repository holds documentation only. The connector is a hosted service, so
there is nothing to install or run.

## What you can ask for

- Create client portals, and build pages with text, embeds, video, form
  questions, file requests and tabs
- Create, assign and comment on tasks, with checklists, labels and due dates
- Set up projects with phases and resources
- Add folders, links and file requests, and comment on or label files
- Start and reply to client conversations
- Write work journal entries
- Create and edit invoices, and mark them paid
- Add client contacts
- Save logins to the password vault without the password ever entering the
  chat
- Set portal branding, sidebar, variables and notification settings
- Make a portal's Preview & Share link
- Find out what's open, what's due and what's waiting on a client in any portal

Still done in the Ahsuite app: uploading files and logos, and deleting portals,
pages, tasks or files.

## Example prompts

> Create a clean client portal for Juniper Lane Bakery (contact: Sam Rivera,
> sam@juniperlane.example.com) with a welcome page, a sign-off task for the
> homepage design due Friday, and a request for their logo files.

> Across my client portals, which tasks are still waiting on the client, and
> which of them are overdue?

> Log today's call with Kettle & Crag in their work journal, then create a task
> for each action item: approve the new logo by Oct 20, send product photos,
> and book the launch shoot.

> Rename this client's sidebar tools to "Tasks & approvals" and "Files &
> assets", and turn on portal search.

See a portal built entirely through the connector:
[Kettle & Crag Outfitters demo](https://ahsuite.com/account/portal/m72lOKBr5m5)
(a made-up business).

## Connect

You need an Ahsuite account. The assistant only sees the account you sign in
with, and only after you approve the connection.

### Claude

Open [ahsuite.com/ai](https://ahsuite.com/ai) and click **Add Ahsuite to
Claude**. Or, in Claude, go to **Settings → Connectors → Add custom
connector** and enter `https://ahsuite.com/api/mcp`. Then click **Connect**,
sign in to Ahsuite and approve access.

### Claude Code

```sh
claude mcp add --transport http ahsuite https://ahsuite.com/api/mcp
```

Then run `/mcp` in Claude Code and sign in.

### Cursor

Add to `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "ahsuite": {
      "url": "https://ahsuite.com/api/mcp"
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "ahsuite": {
      "type": "http",
      "url": "https://ahsuite.com/api/mcp"
    }
  }
}
```

### Cline

In Cline's MCP settings (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "ahsuite": {
      "type": "streamableHttp",
      "url": "https://ahsuite.com/api/mcp"
    }
  }
}
```

### Other MCP clients

Any client that supports remote MCP servers with OAuth sign-in can use
`https://ahsuite.com/api/mcp`. The connector is tested in Claude.

## Your data

- You sign in with your own Ahsuite account and approve the connection. The
  assistant sees only that account.
- No tool takes or returns a password. The password for a saved login is typed
  in Ahsuite itself, by you or your client, or generated there.
- You can disconnect at any time from your AI app's connector settings.
- What you type in a chat is handled by your AI provider under its own terms.
  Ahsuite's [privacy policy](https://ahsuite.com/privacy) covers your Ahsuite
  data, including the section on AI assistants and this connector.

## Support

Email [support@ahsuite.com](mailto:support@ahsuite.com) or visit the
[Help Center](https://docs.ahsuite.com/en/).
