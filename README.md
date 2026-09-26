# Crochet Catalogue

A static React catalogue site with a private `/admin` panel. No checkout — each
product has "Order on WhatsApp" and "DM on Instagram" buttons instead.

## 1. Set up Supabase (free)

1. Create a project at supabase.com.
2. Go to **SQL Editor > New query**, paste in everything from `supabase/schema.sql`, and run it.
3. Go to **Storage**, create a new bucket named exactly `product-images`, and mark it **Public**.
4. Go to **Authentication > Users > Add user**, and create one user with your mom's
   email and a password. This is the only login the admin page will accept.
5. Go to **Project Settings > API** and copy the **Project URL** and **anon public key**.

## 2. Configure the app

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=          # from Supabase Project Settings > API
VITE_SUPABASE_ANON_KEY=     # from Supabase Project Settings > API
VITE_WHATSAPP_NUMBER=       # e.g. 9199XXXXXXX, no + or spaces
VITE_INSTAGRAM_HANDLE=      # e.g. yourshophandle
VITE_SHOP_NAME=             # shown as the site title
```

## 3. Run it locally

```
npm install
npm run dev
```

Visit `http://localhost:5173` for the catalogue, `http://localhost:5173/admin` for the admin panel.

## 4. Deploy for free (Cloudflare Pages)

1. Push this project to a GitHub repo.
2. Go to Cloudflare Pages > Create a project > connect your repo.
3. Build command: `npm run build`, output directory: `dist`.
4. Under **Environment variables**, add the same four `VITE_...` variables from your `.env`.
5. Deploy. You'll get a free `*.pages.dev` URL. Every push to `main` auto-deploys.

## 5. Keep Supabase from pausing (free tier pauses after 7 idle days)

This repo includes `.github/workflows/keep-alive.yml`, which pings Supabase every 3 days.
To activate it:

1. In your GitHub repo, go to **Settings > Secrets and variables > Actions**.
2. Add two repository secrets: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (same values as your `.env`).
3. That's it — GitHub runs the ping automatically. Nothing else to maintain.

## How your mom uses it

She goes to `yoursite.pages.dev/admin`, logs in once with the email/password you set up
in step 1.4, and can add, edit, or delete products from there — no code, no spreadsheet,
no file editing. Changes show up on the public site immediately (no rebuild needed,
since the site fetches live data from Supabase on every page load).
