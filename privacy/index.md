[Home](/) · [Privacy](/privacy/) · [Terms](/terms/) · [Support](/support/)

# Privacy Policy for StatLume

Last updated: September 16, 2026

StatLume is a Windows desktop application that displays YouTube Studio statistics directly on the user's device.

## 1. Data collection

During normal application use, StatLume does not operate a developer-controlled backend for YouTube Studio analytics or authentication data and does not send the user's YouTube Studio statistics, Google credentials, YouTube credentials, browser session data, or authentication cookies to the developer.

The developer does not sell, rent, or use this information for advertising, profiling, analytics, or marketing.

A separate support form is available on the StatLume website. Information voluntarily submitted through that form is processed as described in Section 9.

## 2. YouTube Studio sign-in

Users sign in to YouTube Studio through an embedded Chromium browser window.

Authentication is performed by Google and YouTube within that browser session.

StatLume does not receive or store the user's Google or YouTube password.

## 3. Local browser session

When the user signs in to YouTube Studio, the embedded Chromium browser maintains its authentication session locally on the user's Windows device. This browser session may include cookies and related browser data required by YouTube to keep the user signed in.

StatLume does not copy YouTube authentication cookies or authorization credentials into its own application settings, does not send them to the developer, and does not use them to perform separate authenticated HTTP requests outside the embedded browser session.

## 4. Local application data

StatLume may store a limited local cache required for the user interface and normal application operation, such as:

- channel name or channel identifier;
- subscriber count;
- channel avatar or locally cached avatar data;
- video titles or identifiers;
- the most recent statistics snapshot or other short-lived cached realtime data;
- application preferences and display settings.

This information is stored locally on the user's device and is not transmitted to the developer through normal application use.

## 5. How local data is used

The local browser session is used to allow YouTube Studio to remain authenticated inside the embedded browser.

Statistics displayed by StatLume are obtained from responses produced by the authenticated YouTube Studio page and are processed locally on the user's device for display in the widget.

Local cached data is used only to support the user interface, preserve settings, and provide continuity when recent information is temporarily unavailable.

The developer does not receive the user's YouTube Studio analytics or session information through normal application use.

## 6. Third-party services

StatLume interacts with Google and YouTube services when the user signs in and while the authenticated YouTube Studio page retrieves information.

Use of Google and YouTube services is also subject to their respective terms and privacy policies.

The StatLume support form uses Cloudflare Workers to receive support submissions and GitHub to store support tickets in a private repository accessible only to authorized maintainers.

## 7. Disconnecting YouTube Studio

StatLume provides a way to disconnect the local YouTube Studio session.

Disconnecting clears session information managed through the embedded browser to the extent supported by the installed version. Users may also remove remaining local application data through Windows application settings or by uninstalling StatLume.

## 8. Data sharing

StatLume does not sell or share the user's personal data with advertisers, data brokers, or marketing companies.

Because StatLume does not operate a developer-controlled backend for normal application analytics or authentication, the developer does not receive the user's local YouTube Studio session or channel statistics through normal application use.

Support submissions are transmitted only for the purpose of handling the user's support request and may be processed by Cloudflare and GitHub as service providers involved in that workflow.

## 9. Support form data

If a user submits the support form at [https://statlume.github.io/support/](https://statlume.github.io/support/), StatLume may process information the user chooses to provide, including:

- support category and ticket title;
- StatLume version;
- Windows version;
- problem description;
- steps to reproduce;
- optional reply email address;
- any other information voluntarily entered into the form.

The support form sends this information to a Cloudflare Worker, which creates a support ticket in a private GitHub repository controlled by StatLume. Support tickets are not publicly visible.

Support information is used only to investigate, respond to, and resolve support requests and to improve StatLume based on reported problems.

Users should not submit passwords, authentication cookies, session tokens, API keys, or other account credentials through the support form.

Support tickets may be retained for as long as reasonably necessary to resolve the request, maintain support history, prevent duplicate investigations, and improve the application. They may be deleted when they are no longer needed.

## 10. Security

StatLume is designed so that YouTube authentication and session information remains on the user's local device.

Support requests are sent over HTTPS and stored in a private GitHub repository. Access is limited to authorized maintainers of the StatLume support repository.

Users are responsible for maintaining the security of their Windows account and device and for avoiding submission of sensitive credentials in support requests.

## 11. Children's privacy

StatLume is not designed to knowingly collect personal information from children.

The developer does not operate a server that collects user profile or YouTube Studio session data through normal application use. The support form should only be used to provide information necessary to request assistance.

## 12. Changes to this Privacy Policy

This Privacy Policy may be updated if StatLume's functionality, support workflow, or data handling changes.

The current version will be published at the Privacy Policy URL associated with StatLume.

## 13. Contact

For privacy questions or support, use the [StatLume support page](/support/).
