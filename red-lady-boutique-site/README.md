# The Red Lady Boutique — how to put this online

This folder is a real, working website: a storefront (homepage, product pages, a
shopping bag) plus an owner's admin page — backed by a real database, not just
a mockup. Follow the steps below in order and in about 15–20 minutes it will
be live at its own address on the internet, for free, with nothing to install
on your own computer.

You will create three free accounts along the way. That's normal — every real
website needs somewhere to live (that's Vercel) and somewhere to store its data
(that's Neon). GitHub is just the shelf the code sits on in between.

---

## Step 1 — Put this code on GitHub (5 minutes)

GitHub is just a place to store code online — think of it as the folder Vercel
will read from in Step 3.

1. Go to **github.com** and sign up for a free account if you don't have one.
2. Once logged in, click the **+** in the top-right corner → **New repository**.
3. Name it `red-lady-boutique`. Leave everything else as-is. Click **Create repository**.
4. On the next page, click the link that says **uploading an existing file**.
5. Unzip the file you downloaded from this conversation. Drag the **whole
   folder's contents** (not the zip itself — the files and folders inside it)
   into the browser window.
6. Scroll down and click **Commit changes**.

That's it — your code now lives on GitHub.

---

## Step 2 — Create a free database (5 minutes)

1. Go to **neon.com** (Neon — a free hosted Postgres database) and sign up.
   Signing up with your GitHub account is the fastest option.
2. Click **Create a project**. Give it any name (e.g. "red lady boutique") and
   click **Create**.
3. On the project page, find the box labeled **Connection string**. Click the
   copy icon next to it. It looks like `postgresql://neondb_owner:...`.
4. Paste it somewhere safe for a moment (a Notes app is fine) — you'll need it
   in the next step.

---

## Step 3 — Deploy the site (5 minutes)

1. Go to **vercel.com** and sign up — choose **Continue with GitHub** so it
   connects to the account from Step 1.
2. Click **Add New…** → **Project**.
3. Find `red-lady-boutique` in the list and click **Import**.
4. Before clicking Deploy, open **Environment Variables** and add one:
   - **Name:** `DATABASE_URL`
   - **Value:** paste the connection string you copied from Neon in Step 2.
5. Click **Deploy**. A progress screen appears — this takes a minute or two.
   It's building the site *and* setting up the database tables automatically.
6. When it finishes, click **Visit**. Your site is live, at an address like
   `https://red-lady-boutique-yourname.vercel.app`.

---

## Step 4 — Load in the demo products (30 seconds)

The site is live but empty — there's nothing in the database yet. Fix that by
visiting one link, once:

```
https://YOUR-SITE-ADDRESS.vercel.app/api/seed
```

(swap in your actual address from Step 3). You'll see a short message
confirming products were added. Now go back to the homepage — the New
Arrivals and Best Sellers you saw in the earlier demo are there for real.

---

## What's actually real here

- The homepage, product pages, and admin page all read from **your real
  database** — not sample data baked into the code.
- On a product page, picking a color and size, and clicking **Add to Bag**,
  checks real stock in the database before it's added.
- On the **Admin Demo** page (linked in the header), the stock **+ / −**
  buttons and the homepage pin switch write to the real database. Refresh
  the page — your change is still there. Open the site on your phone —
  it's there too. That's the difference between this and the earlier
  click-through preview: this one actually remembers things, for everyone
  who visits.

## What's still a placeholder, on purpose

- **Checkout** shows a message rather than taking a real payment — wiring up
  Stripe is a well-defined next step once you're ready for it.
- **Product photography** is a soft color gradient with a simple line drawing,
  not real photos — swap those in whenever you have real product shots.
- **Sign-in** doesn't exist yet, so the admin page is reachable by anyone who
  has the link. Fine for showing a client; add a login before this handles
  real customers.
- The "Daily Revenue" and "Total Orders" numbers on the admin page are sample
  figures — the "Low Stock" and "Out of Stock" counts next to them, though,
  are computed live from your real inventory.

## If something goes wrong

Vercel shows a build log on-screen if a deploy fails — copy whatever error
message it shows and send it over, and it can be fixed and redeployed in
minutes. The most common cause is `DATABASE_URL` being pasted with an extra
space or missing character — worth double-checking first.

## Making a change later

Edit a file directly on GitHub (open it, click the pencil icon, save) and
Vercel automatically rebuilds and updates the live site within a minute or
two — no re-uploading needed.
