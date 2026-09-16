# StatLume Support Worker

This Cloudflare Worker accepts support form submissions from `https://statlume.github.io/support/` and creates GitHub Issues in `StatLume/statlume.github.io`.

## 1. Create a fine-grained GitHub token

Create a fine-grained personal access token in GitHub with access limited to the `StatLume/statlume.github.io` repository.

Repository permission required:

- Issues: Read and write

Do not commit this token to the repository.

## 2. Deploy the Worker

Install Wrangler and authenticate with Cloudflare:

```bash
npm install -g wrangler
wrangler login
```

From this directory, store the GitHub token as a Cloudflare secret:

```bash
wrangler secret put GITHUB_TOKEN
```

Paste the GitHub token when prompted.

Then deploy:

```bash
wrangler deploy
```

Cloudflare will return a URL similar to:

```text
https://statlume-support.<your-subdomain>.workers.dev
```

## 3. Connect the website form

Edit `/support/index.html` and replace:

```js
const SUPPORT_ENDPOINT = "https://statlume-support.YOUR_SUBDOMAIN.workers.dev";
```

with the real Worker URL returned by Cloudflare.

Commit the change. Once GitHub Pages redeploys, the support form will create GitHub Issues without sending the user to GitHub.

## Security notes

- The GitHub token is stored only as a Cloudflare Worker secret.
- Never place the GitHub token in JavaScript served by GitHub Pages.
- The Worker accepts browser requests only from `https://statlume.github.io`.
- The form includes a honeypot field for basic bot filtering.
- For stronger anti-spam protection, Cloudflare Turnstile can be added later.
