# E-Commerce — Next.js 15 + Supabase + COD

Full-stack e-commerce platform. MVC architecture, App Router, TypeScript, Tailwind v4.

## Stack
- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Database**: Supabase (PostgreSQL + RLS + Auth)
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **State**: Zustand (cart + UI)
- **Forms**: React Hook Form + Zod
- **Payment**: Cash on Delivery (Stripe/Easypaisa/JazzCash — ready to add)

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npx supabase db push               # run migrations (or paste SQL manually)
npm run dev
```

## Supabase setup
1. Create project at supabase.com
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_payment_method.sql`
4. Run `supabase/migrations/003_seed_data.sql` (optional sample data)
5. Generate types: `npm run supabase:types`
6. Enable Email Auth in Supabase Dashboard → Auth → Providers

## Project structure

```
src/
├── app/           # Pages (App Router)
│   ├── (auth)/    # Login, Register, OAuth callback
│   ├── (shop)/    # Storefront, Products, Cart, Checkout
│   ├── account/   # Orders, Wishlist, Profile
│   └── admin/     # Dashboard, Products, Orders, Users
├── components/    # UI components
├── lib/
│   ├── actions/   # Server Actions (mutations)
│   ├── queries/   # DB read functions
│   ├── supabase/  # Client, server, admin, middleware
│   └── validations/ # Zod schemas
├── store/         # Zustand stores
├── types/         # TypeScript types
└── hooks/         # Custom React hooks
```

## Chunks completed
- ✅ Chunk 1 — Foundation, config, types, Supabase clients, middleware, layout
- ✅ Chunk 2 — Product listing, PDP, FilterSidebar, Pagination, Search, CartDrawer
- ✅ Chunk 3 — Auth (login/register), Cart page, Checkout (COD), Success page
- ✅ Chunk 4 — Account (orders, wishlist, profile), Admin dashboard
- ✅ Chunk 5 — Reviews, Wishlist toggle on PDP, ISR caching, error/not-found pages, seed data

## Payment gateways (future)
The checkout flow is payment-agnostic. To add a gateway:
1. Add provider SDK
2. Create a server action in `lib/actions/order.actions.ts`
3. Add a payment tile in `CheckoutClient.tsx`
4. Handle webhook in `app/api/stripe/webhook/route.ts` (or new route)