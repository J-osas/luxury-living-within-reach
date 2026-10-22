# Facts-Finder

Mobile-first preview of the Facts-Finder game. Accounts, progress, ratings, and voice notes are stored in Supabase. The colour mode stays in the browser. Questions stay in the app. There is no live multiplayer.

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the two Supabase values before creating an account. Until those values exist, sign-up cannot create a real account.

On a wide screen the game sits in a centred phone column. On a phone it fills the screen.

The design brief is in `docs/DESIGN-SPEC.md`. The `@tweakcn` registry is registered for the shadcn MCP and is not applied as the theme. Colours and type follow the Facts-Finder artboards, with a light and a dark mode.

## Accounts

Passwords are hashed by Supabase Auth. They are not stored in the browser. Each player can read and update only their own profile and progress. Emails are not shown to other players. You read them in the Supabase dashboard.

1. Create a free Supabase project.
2. Open the SQL editor, paste `supabase/schema.sql`, and run it.
3. Open Authentication → Sign In / Providers → Email and turn off Confirm email, so Create account signs the player in immediately.
4. Open Project Settings → API. Copy the project URL and the anon public key.
5. Locally, put them in `facts-finder/.env.local`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

6. On Vercel, add those same two environment variables, then redeploy.
7. Never put the service_role key in the app or in a public environment variable. Emails are under Authentication → Users. Notes are under Table Editor → feedback. Voice files are under Storage → feedback-audio.

Sign up asks for a first name, last name, email, and password. The username is made from the first name. Home greets the player by their first name. On Profile they can change the username, then the next change waits three months. They can also pick a portrait and a colour for their avatar.

## How to share

This is a website that fills the phone screen. People do not download it from an app store yet. They open a link.

1. Create a free Vercel account with the GitHub login for `J-osas/luxury-living-within-reach`.
2. Import that repo. Set the root directory to `facts-finder`, the build command to `npm run build`, and the output folder to `dist`.
3. Deploy. Vercel gives an `https://` address.
4. Send that address to friends, family, and group chats.
5. On a phone, open the link, then use the browser Share menu and Add to Home Screen. It then opens like an app.
6. Each person taps Get started and creates an account with their email. Their progress stays with that account.
7. After they clear 2 levels, the game asks them to rate it. They can also open Send feedback, type, record a voice note, and send it. You read the rating, the note, and the voice file in Supabase.
