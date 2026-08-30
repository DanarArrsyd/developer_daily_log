# Setup

## Commit identity (required for proper attribution)

By default the workflow commits as `github-actions[bot]`. To attribute commits
to your own GitHub account, set two repository variables:

1. Repo Settings → Secrets and variables → Actions → **Variables** tab.
2. Add:
   - `GIT_USER_NAME` — your GitHub username or display name.
   - `GIT_USER_EMAIL` — your GitHub-provided noreply email, e.g.
     `123456789+username@users.noreply.github.com` (find it in
     Settings → Emails → "Keep my email address private").

Without these, commits still work but show as `github-actions[bot]`.

## Manual run

Go to Actions → Daily Update → Run workflow.

## Schedule

Runs daily at 07:17 Asia/Jakarta via cron in
`.github/workflows/daily-update.yml`.
