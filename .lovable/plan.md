
# Full System Sweep — Affilyt

I audited the codebase, routes, sidebars, DB schema, and edge functions. Below are concrete fixes and additions aligned with the project scope (3-tier affiliate program, seller plan, Korapay payments in GHS, Ghana/Nigeria/USA/London).

## 1. Critical Bugs to Fix

- **`DashboardSidebar.tsx`** imports `BookOpen` (used in `learnerLinks`) but it's not in the lucide import list → runtime crash for learner dashboard. Same for duplicate `Inventory` entries in vendor sidebar (`products` and `storefront` both labeled "Inventory").
- **Korapay verify edge function** silently swallows order-insert errors. Add proper error response + retry logging to `activity_events`.
- **`profiles` RLS** — "Profiles viewable by everyone" exposes `phone`, `momo_number`, `skrill_email`, `tax_regions`. Restrict sensitive columns to owner/admin via a public view.
- **`lessons`, `quizzes`, `quiz_questions`, `quiz_attempts`** have RLS enabled but **zero policies** → currently unreachable. Add proper policies.
- **`commission_overrides`** missing admin SELECT policy.

## 2. Missing Backend Pieces (scope-aligned)

- **`withdrawal_settings`** per user (preferred method, min payout threshold) — referenced in UI but no table.
- **`seller_analytics_daily`** materialized snapshot for fast seller dashboard charts (currently each page recomputes).
- **`product_clicks_daily`** rollup for affiliate Top Products / EPC.
- **Trigger**: auto-update `products.epc` and `conversion_rate` when a new order/click lands.
- **Trigger**: on `withdrawals` insert, validate available balance (sum completed commissions − prior approved withdrawals) to prevent overdraw.
- **`announcements`** table (lighter than broadcasts) for in-app banner shown to affiliates/sellers.

## 3. New Edge Functions

- **`process-broadcast`** — drains `broadcasts` queue, sends via Resend (Lovable email). Adds `RESEND_API_KEY` secret.
- **`recompute-product-stats`** — nightly cron to update EPC, conversion_rate, refund_rate.
- **`generate-tax-doc`** — server-side PDF generation for `tax_documents` (replaces client-side mock).
- **`korapay-webhook`** — receive Korapay webhook events for charge.success / refund / chargeback (currently only client-initiated verify).

## 4. UX/Feature Additions per Dashboard

**Admin**
- Sidebar items defined but pages missing: `Tiers`, `Activity`, `Analytics`, `Moderation`, `Broadcast`, `Refunds`, `AuditLog`, `Coupons`, `Health` aren't routed in `AdminDashboard.tsx`. Wire them up.
- Add Seller Subscriptions management page (renewals, $50/year plan status).

**Affiliate**
- **Deep-link generator** for product collections (multi-product cart link).
- **Earnings projection widget** based on 30d trend.
- **Withdrawal balance card** with min-payout indicator (currently no min enforced).

**Seller**
- **Sales heatmap** (hour-of-day × day-of-week) — high value, low effort with existing `orders`.
- **Affiliate invitation** flow (seller invites specific affiliates to promote their product).
- **Refund request UI** for sellers to flag orders.

**Learner**
- Fix learner sidebar crash, then add **Certificate generator** on course completion.

## 5. Cross-cutting

- **In-app notifications bell** in `DashboardLayout` header (table exists, no UI surface).
- **GHS/USD currency toggle** in profile settings — Ghana is the primary market, exchange rate currently hardcoded.
- **Mobile bottom nav** for dashboards (current mobile UX is drawer-only).
- **Help center / FAQ** page (route exists in nav? add to footer).

## Phasing

```text
Phase A (this turn): Critical bug fixes + RLS hardening + wire missing admin routes
Phase B: New backend (tables, triggers, edge functions)
Phase C: Dashboard feature additions (heatmap, projections, notifications bell, etc.)
Phase D: Tax PDF + Korapay webhook + broadcast sender
```

## What I'll do if approved

Execute **Phase A** immediately (it's all bug/security fixes, no new features). Then check in before B–D so you can prioritize.
