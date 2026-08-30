// Fetch GitHub stats, update stats.json / DAILY_LOG.md / README.md.
// Node.js built-ins only, no deps.

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TIMEZONE = "Asia/Jakarta";
const API_VERSION = "2022-11-28";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function githubRequest(endpoint) {
  const token = requireEnv("GITHUB_TOKEN");
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": API_VERSION,
      "User-Agent": "developer-daily-log",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${endpoint} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchAllRepos(username) {
  const repos = [];
  let pageNum = 1;
  for (;;) {
    const page = await githubRequest(
      `/users/${username}/repos?per_page=100&page=${pageNum}&sort=updated`
    );
    repos.push(...page);
    if (page.length < 100) break;
    pageNum += 1;
  }
  return repos;
}

// Jakarta-local date as YYYY-MM-DD, independent of runner's UTC clock.
function jakartaDateString(date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date); // en-CA gives YYYY-MM-DD
}

function jakartaDateTimeString(date) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return formatter.format(date).replace(" ", "T") + "+07:00";
}

function humanDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function buildStats(username, user, repos) {
  const nonForkRepos = repos.filter((r) => !r.fork);
  const totalStars = nonForkRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = nonForkRepos.reduce((sum, r) => sum + r.forks_count, 0);

  const recentRepos = nonForkRepos
    .filter((r) => !r.archived)
    .filter((r) => r.name !== "developer-daily-log")
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      language: r.language || null,
      updated_at: r.updated_at,
    }));

  const languages = [
    ...new Set(recentRepos.map((r) => r.language).filter(Boolean)),
  ];

  return {
    username,
    last_updated: jakartaDateTimeString(new Date()),
    public_repositories: user.public_repos,
    non_fork_repositories: nonForkRepos.length,
    followers: user.followers,
    following: user.following,
    total_stars: totalStars,
    total_forks: totalForks,
    languages,
    recent_repositories: recentRepos,
  };
}

function updateDailyLog(stats, todayStr) {
  const filePath = path.join(ROOT, "DAILY_LOG.md");
  const header = "# Developer Daily Log\n\nAutomated daily snapshots of my GitHub development activity.\n";

  let body = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : header;
  if (!body.startsWith(header)) body = header + "\n" + body;

  const entriesText = body.slice(header.length).trim();
  const entries = entriesText.length
    ? entriesText.split(/\n---\n/).map((e) => e.trim()).filter(Boolean)
    : [];

  const newEntry = [
    `## ${todayStr}`,
    "",
    `- Public repositories: ${stats.public_repositories}`,
    `- Non-fork repositories: ${stats.non_fork_repositories}`,
    `- Followers: ${stats.followers}`,
    `- Following: ${stats.following}`,
    `- Total repository stars: ${stats.total_stars}`,
    `- Status: Active`,
    `- Snapshot generated automatically.`,
  ].join("\n");

  const filtered = entries.filter((e) => !e.startsWith(`## ${todayStr}`));
  filtered.unshift(newEntry);

  const finalBody = header + "\n" + filtered.join("\n\n---\n\n") + "\n";
  fs.writeFileSync(filePath, finalBody);
  return filtered.length;
}

function updateReadme(stats, snapshotCount, todayStr) {
  const filePath = path.join(ROOT, "README.md");
  const startMarker = "<!-- DASHBOARD:START -->";
  const endMarker = "<!-- DASHBOARD:END -->";

  const recentRows = stats.recent_repositories.length
    ? stats.recent_repositories
        .map(
          (r) =>
            `| ${r.name} | ${r.language || "-"} | ${humanDate(
              jakartaDateString(new Date(r.updated_at))
            )} |`
        )
        .join("\n")
    : "| _no recent repositories_ | | |";

  const languageList = stats.languages.length
    ? stats.languages.map((l) => `- ${l}`).join("\n")
    : "- _no data yet_";

  const dashboard = [
    startMarker,
    "## Developer Snapshot",
    "",
    "| Metric | Value |",
    "|---|---:|",
    `| Public Repositories | ${stats.public_repositories} |`,
    `| Non-Fork Repositories | ${stats.non_fork_repositories} |`,
    `| Followers | ${stats.followers} |`,
    `| Repository Stars | ${stats.total_stars} |`,
    `| Daily Snapshots | ${snapshotCount} |`,
    `| Last Updated | ${humanDate(todayStr)} |`,
    "",
    "## Recent Projects",
    "",
    "| Repository | Language | Last Updated |",
    "|---|---|---|",
    recentRows,
    "",
    "## Development Languages",
    "",
    languageList,
    endMarker,
  ].join("\n");

  const staticIntro = [
    "# Developer Daily Log",
    "",
    "Automated GitHub developer journal and activity dashboard.",
    "",
  ].join("\n");

  const staticOutro = [
    "",
    "## About This Repository",
    "",
    "This repository automatically records selected GitHub development statistics and maintains a daily development journal using GitHub Actions and the GitHub API.",
    "",
    "The automation runs once per day without requiring an external server.",
    "",
    "See [SETUP.md](./SETUP.md) for commit identity configuration.",
    "",
  ].join("\n");

  let existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const startIdx = existing.indexOf(startMarker);
  const endIdx = existing.indexOf(endMarker);

  let finalContent;
  if (startIdx !== -1 && endIdx !== -1) {
    finalContent =
      existing.slice(0, startIdx) + dashboard + existing.slice(endIdx + endMarker.length);
  } else {
    finalContent = staticIntro + dashboard + "\n" + staticOutro;
  }

  fs.writeFileSync(filePath, finalContent);
}

async function main() {
  const username = requireEnv("GITHUB_REPOSITORY_OWNER");
  const today = new Date();
  const todayStr = jakartaDateString(today);

  const user = await githubRequest(`/users/${username}`);
  const repos = await fetchAllRepos(username);

  const stats = buildStats(username, user, repos);

  fs.writeFileSync(
    path.join(ROOT, "stats.json"),
    JSON.stringify(stats, null, 2) + "\n"
  );

  const snapshotCount = updateDailyLog(stats, todayStr);
  updateReadme(stats, snapshotCount, todayStr);

  console.log(`Updated snapshot for ${todayStr} (${username}).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
