# Facts-Finder

Mobile-first preview of the Facts-Finder game. Progress stays in the browser. There is no server, live multiplayer, or real sign-in provider.

```bash
npm install
npm run dev
```

On a wide screen the game sits in a centred phone column. On a phone it fills the screen.

The design brief is in `docs/DESIGN-SPEC.md`. The `@tweakcn` registry is registered for the shadcn MCP and is not applied as the theme. Colours and type follow the Facts-Finder artboards, with a light and a dark mode.

## How to share

This is a website that fills the phone screen. People do not download it from an app store yet. They open a link.

1. Create a free Vercel account with the GitHub login for `J-osas/luxury-living-within-reach`.
2. Import that repo. Set the root directory to `facts-finder`, the build command to `npm run build`, and the output folder to `dist`.
3. Deploy. Vercel gives an `https://` address.
4. Send that address to friends, family, and group chats.
5. On a phone, open the link, then use the browser Share menu and Add to Home Screen. It then opens like an app.
6. Each person taps Get started and creates an account on their own phone. Their progress stays on that phone.
7. They open Send feedback, type, record if they want, and share it to you.
