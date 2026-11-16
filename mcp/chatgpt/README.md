# The ChatGPT plugin

OpenAI's plugin directory takes a ZIP: platform.openai.com/plugins → *Upload new or existing plugin* →
*With MCP*. This folder is the source of that ZIP; build it, never hand-edit one.

```sh
node scripts/plugins/chatgpt-zip.mjs            # writes dist/chatgpt/ahsuite-chatgpt-<version>.zip
node scripts/plugins/chatgpt-zip.mjs --check    # validate only (CI runs this)
node scripts/plugins/chatgpt-zip.mjs --strict   # also fail if the demo video URL is missing
```

`ahsuite/` holds:
- **`plugin.json`**: the manifest, shipped as written. Under `extensions["com.openai"]` it carries:
  - the listing (`interface`);
  - the review packet (`review`): 5 positive and 3 negative test cases, `commerce` and
    `demo_recording_url`;
  - the release notes (`publication`).

  The upload form fills itself from it.
- **`mcp.json`**: the server.
- **`build.json`**: what gets copied in:
  - the Claude plugin's skills from `plugins/ahsuite/skills`, each with `skill-addendum.md` appended;
  - the logo `logo-400.png`;
  - `composer-icon.png`.

The build generates `.mcp.json` and `.codex-plugin/plugin.json` for older clients.

Version 1.0.1 (submitted 2026-10-30) came back "Changes required". Version 1.0.2 (submitted 2026-11-16,
in review) is the fix: the ChatGPT
copy of the skills and the listing no longer mention the password vault, because the server leaves
`create_password` and `list_passwords` out of the tools it offers ChatGPT. `build.json` `replace` makes
that edit (the Claude plugin keeps its wording) and `forbid` fails the build if a mention comes back.

**To release a change:**
1. Edit the files here and bump `version` in `plugin.json`.
2. Run the build and upload the new ZIP to the same plugin.
3. Every change to the listing, skills or MCP config goes back through review.

**What review taught us:**
- Expected answers name exact records, counts, amounts and dates from the reviewer account, never
  "today" or "next Friday".
- Negative cases are prompts that must *not* call the plugin (general advice, drafting text in the chat,
  general research), not requests to refuse.
- A write case says the assistant may show its plan and ask first, and tells the reviewer to reply
  "Yes, go ahead."
- Anything that touches credentials gets held for manual review and read as "solicits sensitive personal
  data", even when the password never passes through ChatGPT. Keep the password vault out of ChatGPT.
- `openWorldHint` is `true` for any tool that can expose data outside the account, not only tools that
  email someone: `update_portal_preferences` (file access without login) was flagged for `false`.
- OpenAI wants a one-line justification for every hint. Have them ready when you resubmit.
- The submit form has no reviewer-login field. Put the reviewer account in *Additional Submission
  Context* (private to the review), with a note on what changed since the last version.
- OpenAI's uploader rejects `interface.screenshots` in the manifest, even an empty list. The build now
  fails on it.
- Rejection details arrive by email to the org owner; the dashboard only says "Changes required". To see
  the automated findings, *Revise submission* to make a draft, then *Reconnect* and *Rescan* on the MCPs
  tab.
