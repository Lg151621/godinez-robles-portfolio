# Work on this project remotely

## Start on another computer

1. Extract `godinez-robles-portfolio.zip`.
2. Open the extracted `godinez-robles-portfolio` folder in your editor.
3. Use Node.js 22 LTS and npm, then run:

```sh
npm ci
npm run dev
```

Visit http://127.0.0.1:3000. No Base44 account, API keys, environment file, or database is required.

## Cloud workspace or remote server

Upload the extracted folder or commit it to your own Git repository and clone it in the remote workspace. Install dependencies with `npm ci`.

For an editor with port forwarding, run `npm run dev` and forward port 3000 to your local browser. Keep that forwarded port private while developing.

If your cloud workspace requires the server to listen on every interface, use:

```sh
npx next dev --hostname 0.0.0.0 --port 3000
```

Open port 3000 using the workspace's preview URL. This development server is for development, not production hosting.

## Main files to edit

- `src/data/site.ts`: founder names, navigation, and contact email.
- `src/data/projects.ts`: replace the clearly labeled sample concepts with real projects and live URLs.
- `src/app/globals.css`: design tokens, typography, layout, and responsive rules.
- `src/components/`: one component for each page section.
- `src/app/layout.tsx`: metadata and indexing settings.
- `public/images/`: bundled original image assets.

## Validate and build

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

To run the optional browser suite on a fresh machine:

```sh
npx playwright install --with-deps chromium
npm run test:e2e
```

See `README.md` for content setup and current limitations. The ZIP includes the source, configuration, lockfile, image assets, tests, and documentation. Dependencies, generated build output, test reports, and machine-specific files are intentionally excluded; `npm ci` restores dependencies from the lockfile.
