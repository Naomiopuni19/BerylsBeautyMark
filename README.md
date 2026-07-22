# Beryl's Beauty Mark

A Vite plus React project for the salon website: booking with a daily
capacity limit per service, a shop with live stock, product detail pages,
a rotating hero banner, customer photo reviews that need admin approval,
an admin dashboard, and a customer portal.

## Running it

    npm install
    cp .env.example .env

Fill in your Supabase URL and anon key in `.env`, then:

    npm run dev

## Setting up the database

Run `database/schema.sql` in the Supabase SQL editor, top to bottom.
It creates every table, the `salon-media` storage bucket, the capacity
and stock triggers, and row level security.

## Still placeholder

- No real Supabase auth yet, `AuthContext.jsx` uses a mock signed in user
- No live payment integration on booking or checkout
- `/admin` and `/account` are not route guarded yet