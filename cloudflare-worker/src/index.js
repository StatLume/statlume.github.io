const ALLOWED_ORIGIN = "https://statlume.github.io";
const GITHUB_REPO = "StatLume/statlume-support";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin)
  });
}

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, origin);
    }

    if (origin && origin !== ALLOWED_ORIGIN) {
      return json({ error: "Origin not allowed." }, 403, origin);
    }

    if (!env.GITHUB_TOKEN) {
      return json({ error: "Support service is not configured." }, 503, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400, origin);
    }

    // Honeypot field. Normal users never see or fill this.
    if (clean(payload.website, 200)) {
      return json({ ok: true }, 200, origin);
    }

    const category = clean(payload.category, 40) || "Other";
    const title = clean(payload.title, 120);
    const version = clean(payload.version, 40) || "Not provided";
    const windows = clean(payload.windows, 80) || "Not provided";
    const description = clean(payload.description, 6000);
    const steps = clean(payload.steps, 4000) || "Not provided";
    const email = clean(payload.email, 200) || "Not provided";

    if (!title || !description) {
      return json({ error: "Title and description are required." }, 400, origin);
    }

    const issueTitle = `[${category}] ${title}`;
    const issueBody = [
      "## Support request",
      "",
      `**Category:** ${category}`,
      `**StatLume version:** ${version}`,
      `**Windows version:** ${windows}`,
      `**Reply email:** ${email}`,
      "",
      "## Description",
      "",
      description,
      "",
      "## Steps to reproduce",
      "",
      steps,
      "",
      "---",
      "Submitted through https://statlume.github.io/support/"
    ].join("\n");

    const githubResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "StatLume-Support-Worker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody })
    });

    if (!githubResponse.ok) {
      const detail = await githubResponse.text();
      console.error("GitHub issue creation failed:", githubResponse.status, detail);
      return json({ error: "Unable to create support ticket." }, 502, origin);
    }

    const issue = await githubResponse.json();
    return json({
      ok: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url
    }, 201, origin);
  }
};
