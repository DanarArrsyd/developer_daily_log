# CLAUDE.md

## Project Overview

Project name: `developer-daily-log`

This repository is a lightweight GitHub automation project designed to maintain a structured developer activity journal and GitHub profile statistics automatically.

The repository should NOT modify or touch any of my existing software projects.

The purpose of this project is to:

1. Maintain a daily developer activity log.
2. Automatically collect selected GitHub account statistics.
3. Generate a clean and professional README dashboard.
4. Maintain one meaningful automated repository update per day.
5. Keep the repository useful and presentable as a small GitHub Actions / GitHub API automation project.
6. Avoid creating meaningless spam commits or fake code changes.

The project should remain simple, transparent, maintainable, and understandable by another developer reviewing the repository.

---

# Core Concept

The expected workflow is:

GitHub Actions
→ runs once per day
→ fetches GitHub account data
→ processes developer statistics
→ updates structured data
→ updates the daily developer log
→ regenerates README dashboard
→ creates one commit
→ pushes to the default branch

No VPS, external server, local machine, cron service, or continuously running application should be required.

Everything should run using GitHub Actions and GitHub's APIs.

---

# Primary Goals

The implementation should prioritize:

- Reliability
- Simplicity
- Clean repository structure
- Readable generated output
- Minimal dependencies
- Secure token handling
- GitHub Actions compatibility
- Professional appearance
- Maintainable code

Avoid unnecessary frameworks or overengineering.

---

# Repository Structure

Target structure:

```text
developer-daily-log/
├── README.md
├── DAILY_LOG.md
├── stats.json
├── scripts/
│   └── update.js
├── .github/
│   └── workflows/
│       └── daily-update.yml
├── .gitignore
└── CLAUDE.md
```

Prefer using a small JavaScript/Node.js script for data processing instead of placing all logic inside a large Bash script.

GitHub Actions runners already provide Node.js, so the project should preferably avoid third-party runtime dependencies unless genuinely necessary.

If possible, use only Node.js built-in APIs.

---

# Workflow Requirements

Create:

`.github/workflows/daily-update.yml`

The workflow must support:

## Scheduled execution

Run once every day.

Preferred schedule:

07:17 Asia/Jakarta.

Use the GitHub Actions timezone feature if supported:

```yaml
schedule:
  - cron: "17 7 * * *"
    timezone: "Asia/Jakarta"
```

Also include:

```yaml
workflow_dispatch:
```

so the workflow can be manually triggered for testing.

---

# Permissions

Use minimum required permissions.

Expected:

```yaml
permissions:
  contents: write
```

Do not add unnecessary repository permissions.

---

# Authentication

Use the automatically provided GitHub token:

```text
${{ github.token }}
```

or:

```text
${{ secrets.GITHUB_TOKEN }}
```

Do not require a Personal Access Token unless GitHub API functionality genuinely requires it.

Never hardcode credentials.

---

# GitHub Account

The workflow should automatically use the repository owner as the target GitHub account whenever possible.

Preferred:

```text
${{ github.repository_owner }}
```

Avoid requiring the username to be manually duplicated across multiple files.

---

# GitHub Statistics

Collect useful public account statistics.

Minimum metrics:

- GitHub username
- Public repository count
- Followers
- Following
- Account creation date
- Last updated date

If practical, also collect:

- Recently updated repositories
- Number of non-fork public repositories
- Primary programming languages from recent repositories
- Repository stars received
- Repository forks received

Do not make excessive GitHub API requests.

Keep the API logic efficient and within normal GitHub API rate limits.

---

# stats.json

Generate and maintain:

`stats.json`

Example structure:

```json
{
  "username": "example",
  "last_updated": "2026-08-30T07:17:00+07:00",
  "public_repositories": 18,
  "non_fork_repositories": 15,
  "followers": 12,
  "following": 21,
  "total_stars": 8,
  "total_forks": 3,
  "recent_repositories": [
    {
      "name": "example-project",
      "language": "JavaScript",
      "updated_at": "2026-08-29T12:30:00Z"
    }
  ]
}
```

Keep the JSON deterministic and human-readable using indentation.

---

# DAILY_LOG.md

Maintain a chronological developer journal.

Newest entries must appear first.

Example:

```markdown
# Developer Daily Log

Automated daily snapshots of my GitHub development activity.

## 2026-08-30

- Public repositories: 18
- Non-fork repositories: 15
- Followers: 12
- Following: 21
- Total repository stars: 8
- Status: Active
- Snapshot generated automatically.

---

## 2026-08-29

...
```

Do not duplicate an entry if the workflow is manually executed more than once on the same date.

If today's entry already exists, update or replace that entry instead of adding another identical date.

This requirement is important.

---

# README Dashboard

`README.md` should be automatically generated or automatically update a dedicated generated section.

The README must look like a legitimate small developer automation project.

Avoid excessive badges, emojis, animations, fake statistics, or visual clutter.

Preferred appearance:

```markdown
# Developer Daily Log

Automated GitHub developer journal and activity dashboard.

## Developer Snapshot

| Metric | Value |
|---|---:|
| Public Repositories | 18 |
| Non-Fork Repositories | 15 |
| Followers | 12 |
| Repository Stars | 8 |
| Daily Snapshots | 121 |
| Last Updated | 30 August 2026 |

## Recent Projects

| Repository | Language | Last Updated |
|---|---|---|
| project-one | JavaScript | 29 Aug 2026 |
| project-two | PHP | 27 Aug 2026 |
| project-three | TypeScript | 25 Aug 2026 |

## Development Languages

- JavaScript
- TypeScript
- PHP
- HTML
- CSS

## About This Repository

This repository automatically records selected GitHub development statistics and maintains a daily development journal using GitHub Actions and the GitHub API.

The automation runs once per day without requiring an external server.
```

Keep the README professional and concise.

---

# Recent Repositories

When displaying recent repositories:

- Exclude this `developer-daily-log` repository when practical.
- Prefer non-fork repositories.
- Sort by `updated_at`.
- Display approximately 5 recent repositories.
- Do not display archived repositories if they are clearly no longer active.
- Do not fail the workflow if fewer than five repositories exist.

---

# Programming Languages

Language information should represent actual repository data.

Do not invent percentages.

For the initial version, a simple list of languages found across recent repositories is sufficient.

If percentages are implemented, they must be based on actual API data.

Avoid making dozens of GitHub API requests just to calculate language percentages.

---

# Daily Snapshot Count

The README should display the number of daily entries currently stored in `DAILY_LOG.md`.

Example:

```text
Daily Snapshots: 121
```

Calculate this programmatically.

Do not maintain the number manually.

---

# Commit Behavior

The automation should produce no more than one meaningful commit per daily run.

Preferred commit format:

```text
chore: update developer snapshot 2026-08-30
```

or:

```text
docs: update developer log 2026-08-30
```

If the generated files contain no changes:

DO NOT create an empty commit.

The workflow should exit successfully.

---

# Commit Identity

The commit needs to be attributable to my GitHub account.

Do NOT automatically use:

```text
github-actions[bot]
```

as the commit author if it prevents proper attribution to my GitHub account.

Provide a clearly documented configuration section where I can enter:

```text
GIT_USER_NAME
GIT_USER_EMAIL
```

Prefer using my GitHub-provided noreply email.

Example:

```text
123456789+username@users.noreply.github.com
```

Do not hardcode an example as my real identity.

Clearly explain in the README or setup instructions where the values should be changed.

---

# Timezone

Primary timezone:

```text
Asia/Jakarta
```

All human-readable dates should preferably use Asia/Jakarta.

Be careful with UTC timestamps returned by the GitHub API.

Use JavaScript's date/time handling carefully.

The daily log date should represent the date in Asia/Jakarta, not accidentally the previous UTC date.

---

# Recommended Implementation

Prefer:

```text
Node.js
```

with a script:

```text
scripts/update.js
```

Responsibilities of `update.js`:

1. Determine current date in Asia/Jakarta.
2. Determine repository owner.
3. Fetch GitHub user profile.
4. Fetch repositories.
5. Calculate required statistics.
6. Select recently updated projects.
7. Build `stats.json`.
8. Update today's DAILY_LOG entry.
9. Count daily snapshots.
10. Generate README.
11. Write changed files to disk.

The GitHub Actions workflow should primarily:

1. checkout
2. setup Node if necessary
3. execute script
4. configure git
5. commit changed files
6. push

Keep business logic out of YAML whenever possible.

---

# Error Handling

The script should fail clearly when:

- GitHub API authentication fails
- GitHub API returns a non-success response
- Required environment variables are unavailable
- Generated output cannot be written

Use clear error messages.

Do not silently swallow serious errors.

However:

- No file changes should not be treated as an error.
- Missing optional repository metadata should not crash the entire script.

---

# GitHub API

Use GitHub REST API.

Preferred endpoints may include:

```text
GET /users/{username}
GET /users/{username}/repos
```

or authenticated equivalents where appropriate.

Use pagination if repository count exceeds a single API response.

If using repository-owner public data, keep implementation simple.

Include appropriate headers such as:

```text
Accept: application/vnd.github+json
Authorization: Bearer <token>
X-GitHub-Api-Version
```

Never print the GitHub token to workflow logs.

---

# Idempotency

The system MUST be idempotent.

Running the workflow multiple times on the same day should not create duplicate daily log entries.

Example:

First run:

```markdown
## 2026-08-30
...
```

Second run on the same date:

Replace/update the existing `2026-08-30` section.

Do not produce:

```markdown
## 2026-08-30
...

## 2026-08-30
...
```

---

# Security

Do not:

- expose tokens
- print secrets
- store Personal Access Tokens in repository files
- use unsafe shell interpolation unnecessarily
- execute downloaded scripts
- introduce third-party Actions without a clear reason

Prefer official GitHub Actions.

---

# Scope

This repository is specifically for:

- GitHub statistics
- automated development journaling
- developer profile activity
- GitHub Actions experimentation
- GitHub API automation

It is NOT:

- a production application
- a portfolio website
- a social media bot
- an AI agent
- a fake code generator
- a tool that modifies other repositories
- a tool that generates random meaningless commits

Do not expand the scope unless explicitly requested.

---

# Quality Standard

Generated code should be:

- clean
- commented only where useful
- consistent
- easy to understand
- free from unnecessary abstraction
- easy to modify later

Avoid generating huge files or complex class structures for a project this small.

---

# Initial Deliverable

When implementing the project from this CLAUDE.md, create a complete working initial version containing:

```text
README.md
DAILY_LOG.md
stats.json
scripts/update.js
.github/workflows/daily-update.yml
.gitignore
```

The project should work after I provide the required commit identity configuration.

Also provide clear setup instructions.

---

# Verification Checklist

Before considering implementation complete, verify:

- [ ] GitHub Actions YAML is syntactically valid.
- [ ] Workflow supports manual execution.
- [ ] Workflow supports daily schedule.
- [ ] Timezone is Asia/Jakarta.
- [ ] GitHub API data is fetched correctly.
- [ ] Token is never exposed.
- [ ] `stats.json` is valid JSON.
- [ ] README generation works.
- [ ] DAILY_LOG generation works.
- [ ] Same-day workflow reruns do not duplicate logs.
- [ ] Recent repositories are sorted correctly.
- [ ] Fork repositories are excluded where required.
- [ ] The automation repository itself is excluded from recent projects where possible.
- [ ] No empty commits are generated.
- [ ] Git identity configuration is clearly documented.
- [ ] Only one automated commit is normally created per day.
- [ ] Existing unrelated repositories are never modified.
- [ ] The project can run entirely on GitHub infrastructure.

---

# Development Philosophy

When modifying this project, prioritize meaningful automation over artificial activity.

The purpose is to maintain a transparent developer activity journal and demonstrate basic GitHub Actions / API automation.

Do not optimize the project around generating the largest possible number of GitHub contributions.

One useful, deterministic update per day is enough.

When requirements are ambiguous, prefer the simplest implementation that preserves reliability and maintainability.