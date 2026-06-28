# Techneyo Solutions Portfolio

A Vite, React, TypeScript, shadcn-ui, and Tailwind CSS website for Techneyo Solutions IT services.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Copy the Supabase Cloud env template and fill in your project values:

```sh
cp .env.example .env.local
```

The frontend reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Keep service-role keys and admin seed passwords out of `VITE_` variables because Vite exposes them to the browser.

For this Supabase Cloud project, the database host is `db.asqwddohpubsblhuspci.supabase.co` on port `5432`, database `postgres`, user `postgres`. Put your real database password only in `.env.local`:

```sh
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.asqwddohpubsblhuspci.supabase.co:5432/postgres
```

Create the database tables by running [supabase/schema.sql](/Users/nitesh/WebstormProjects/rickyriccs/techneyo-portfolio/supabase/schema.sql) in the Supabase SQL Editor. For the default admin, create `admin@techneyo.com` in Supabase Auth, then run the admin profile insert shown at the bottom of that schema file.

Or run the migration and seed SQL from the terminal after `.env.local` has the real `DATABASE_URL`:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/schema.sql
```

## Admin Panel

Admin login route:

```text
/admin/login
```

Protected admin routes:

```text
/admin/dashboard
/admin/enquiries
/admin/services
/admin/offers
/admin/packages
/admin/tools
/admin/logs
/admin/settings
```

To log in, create the admin user in Supabase Auth, then add a matching active row in `public.admin_profiles`. The schema file includes the SQL snippet for linking `admin@techneyo.com` after the Auth user exists.

For production builds, add these GitHub Actions secrets so Vite can bake the Supabase browser config into the static bundle deployed to Hostinger:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Do not expose `DATABASE_URL` in the frontend build.

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Scripts

- `npm run dev` starts the local Vite development server.
- `npm run build` creates a production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint.
- `npm run test` runs the Vitest test suite.
