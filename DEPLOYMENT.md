# MATH.OS Deployment

## Storage

The app is local-first today. User data persists in browser storage through Zustand.

To connect hosted storage:

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The Supabase client is defined in `src/lib/supabase.ts`.

## Railway

Railway can host the Next.js app and server API routes.

Use the included `railway.json`. Set the same Supabase variables in Railway. Add `OPENROUTER_API_KEY` if server-side AI calls are added.

Health check:

`/api/health`

## Netlify

Netlify supports modern Next.js apps through its OpenNext adapter without adding a pinned plugin dependency.

Use the included `netlify.toml`.

Build settings:

```bash
npm run build
```

Publish directory:

```bash
.next
```

Recommended Netlify environment variables:

- `NODE_VERSION=22`
- `NETLIFY_NEXT_SKEW_PROTECTION=true`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY` if server-side AI routes are added

Netlify deploy flow:

1. Push this project to GitHub/GitLab/Bitbucket.
2. Create a new Netlify site from that repo.
3. Netlify will read `netlify.toml`.
4. Add the environment variables above.
5. Deploy.

## Local

```bash
npm install --legacy-peer-deps
npm run dev
```
