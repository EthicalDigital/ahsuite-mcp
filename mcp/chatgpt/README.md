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

Version 1.0.1 is the build submitted on 2026-10-30 (in review). Rebuilding it from here gives the same 12
files byte for byte.

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
