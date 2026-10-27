# Publishing the Ahsuite Claude plugin

Draft, Oct 27, 2026. Growth Plan task: "Publish a Claude plugin with ready-made
workflows" (due Oct 30). Based on
[Submit your plugin](https://claude.com/docs/plugins/submit),
[Plugin structure and testing](https://claude.com/docs/plugins/build) and the
[pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist),
read Oct 27, 2026.

## What's here

`ahsuite/` is the plugin folder:

- `.claude-plugin/plugin.json`: the manifest. `name` is `ahsuite`; it's
  permanent once released, so don't change it later.
- `.mcp.json`: the Ahsuite connector, `https://ahsuite.com/api/mcp`. Users
  sign in with OAuth, so there's no key or secret in the file. Same URL as our
  directory connector, so people with both see one set of tools.
- `skills/`: six workflow skills. They only describe how to use the existing
  tools; no IDs or customer data.
- `README.md` (the directory shows it as the listing description) and
  `LICENSE` (MIT).

`claude plugin validate ./ahsuite` passes (Claude Code 2.1.311). One warning
is left: **no icon** (see step 1).

## Steps

1. **Add an icon.** A square PNG, 512 to 2048 px, under 2 MB, at
   `ahsuite/.claude-plugin/icon.png`. `logo-400.png` is too small (400 px).
   The icon is taken **only once**, the first time the plugin is saved or
   submitted in the portal, so add it before step 5.
2. **Move the folder into the public repo**
   [github.com/EthicalDigital/ahsuite-mcp](https://github.com/EthicalDigital/ahsuite-mcp)
   as `plugins/ahsuite/`. Don't put it at the repo root: the root `README.md`
   is the connector's README, and the plugin needs its own. A subfolder is
   fine because the plugin has no scripts or hooks.
3. **Validate locally:** from `plugins/`, run `claude plugin validate ./ahsuite`.
4. **Test it:**
   - Claude Code: `claude --plugin-dir ./plugins/ahsuite`, run `/mcp` to sign
     in, then try each skill (for example "what's waiting on clients this
     week?").
   - claude.ai: zip the `ahsuite` folder, then **Customize → Plugins → Add →
     Upload plugin**. Connect Ahsuite from the plugin's Connectors tab and
     try the same prompts.
   - Use the reviewer account for anything that creates data.
5. **Submit** at [claude.ai/directory/manage](https://claude.ai/directory/manage)
   (Pro/Max: your own account; Team/Enterprise: an Owner). Use the same Claude
   organization that owns the Ahsuite connector listing.
   1. Connect GitHub for that organization (the portal checks you can push to
      the repo).
   2. **Submit new → Plugin bundle**.
   3. Source: repository `EthicalDigital/ahsuite-mcp`, plugin path
      `plugins/ahsuite`, branch `main` (or leave empty for the default
      branch).
   4. Select **Validate**. Fix anything marked Blocking, push, re-validate.
   5. Check the listing details (from `plugin.json` and the README).
   6. Data handling: reads/stores personal data only through the Ahsuite
      connector; sends nothing to other services; keeps nothing itself; not
      for under-18s.
   7. Compliance: contact email `support@ahsuite.com`, tick all four
      acknowledgements.
   8. Keep **GitHub push webhook** and select **Submit for review**. (Setting
      up the webhook needs admin access to the repo.)
6. **After approval,** select **Publish** on the plugin's page. For later
   releases, raise `version` in `plugin.json` and merge to `main`.

## Optional

To let Claude Code users install with one command, add a marketplace file at
`.claude-plugin/marketplace.json` in the repo root that lists `plugins/ahsuite`,
then add the install line the validator suggests to the plugin README:
`/plugin install ahsuite --marketplace EthicalDigital/ahsuite-mcp`.
See [Create a marketplace](https://code.claude.com/docs/en/plugins/create-marketplace).
