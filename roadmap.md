# Affilyt Platform Roadmap

## Phase 1 — Security Hardening (do first)
- Restrict `profiles` PII (phone, payment identifiers) to owner + admin only
- Tighten `resources` and inactive `contests` RLS visibility
- Lock `system_settings` to superadmin reads only
- Revoke broad execute permissions on the two flagged database functions
- Add checkout rate limiting on payment initialization
- Enforce admin 2FA (TOTP) for superadmin accounts

## Phase 2 — Dependency & Stability Upgrades
- Upgrade React Router (security advisories)
- Upgrade Recharts / lodash (advisories)
- Upgrade Supabase JS / ws (advisories)
- Remove mistaken `vit` 0.1.3 package; keep real Vitest
- Re-run dependency scan until clean

## Phase 3 — Buyer Experience
- Buyer accounts with purchase history page
- Order receipts + transactional email (welcome, purchase, payout, status changes)
- Download/access page for purchased digital products
- Buyer support/contact thread per order

## Phase 4 — Affiliate & Seller Tooling
- Affiliate earnings CSV export
- Require product images before admin approval
- Payout status notifications (email + in-app)
- Seller product performance digest

## Phase 5 — Growth & Polish
- Public marketplace SEO metadata per product
- Referral leaderboard prizes automation
- Platform announcement scheduling
- Final full security re-scan + penetration checklist
