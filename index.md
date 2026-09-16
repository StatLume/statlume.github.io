# StatLume

**Realtime stats on your Windows desktop.**

StatLume is a Windows desktop widget that displays near-real-time YouTube Studio statistics directly on the user's device.

## What StatLume does

- Displays recent channel view activity in a compact desktop widget.
- Shows short-term realtime trends, including minute- and hour-based views where available from the authenticated YouTube Studio session.
- Shows top-performing videos for the selected realtime period.
- Keeps the user's YouTube Studio session and statistics on the local Windows device.
- Does not require a StatLume account or a StatLume-operated backend server.

## Authentication and data flow

Users sign in to YouTube Studio through an embedded browser window. Authentication is handled by Google/YouTube inside that browser session.

StatLume does not receive or store the user's Google or YouTube password. The application uses the authenticated local browser session to display statistics available to that user.

StatLume does not operate a remote backend that receives the user's YouTube Studio session, channel analytics, or authentication data.

## Documentation

- [Privacy Policy](/privacy/)
- [Terms of Use](/terms/)
- [Support](/support/)

## Important notice

StatLume is an independent application and is not affiliated with, endorsed by, sponsored by, or officially connected with Google LLC or YouTube.

The application relies on interfaces used by YouTube Studio. These interfaces may change, become unavailable, or behave differently at any time. Such changes may temporarily or permanently affect application functionality.
