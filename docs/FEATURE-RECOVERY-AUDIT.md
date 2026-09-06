# BookMyMetal feature recovery audit

## Visual baseline

`next-marketplace-hostinger` is the approved v0 Next.js marketplace UI. Its components remain the presentation layer and are not replaced by legacy HTML.

## Reusable production-oriented backend

The following implementations are on `develop` and remain the backend source of truth while the Next marketplace is introduced:

| Capability | Files on `develop` | Integration status |
| --- | --- | --- |
| Unified email/mobile OTP, password reset and rate limits | `api/otp.php`, `api/otp-helpers.php`, `api/user-schema.php` | Reused through the existing `/account/` route |
| Email/password sessions | `api/auth.php`, `api/session.php`, `api/require-auth.php` | Reused through the existing `/account/` route |
| Google/Facebook OAuth | `api/oauth.php`, `api/oauth-callback.php`, `api/oauth-helpers.php`, `api/oauth-status.php` | Reused through the existing `/account/` route; credentials remain server-only |
| One-account buyer/seller capability | `api/user-schema.php`, `api/seller-activate.php` | Reused through `/seller/` activation/onboarding |
| Seller videos and moderation | `api/seller-product.php`, `api/seller-products.php`, `api/admin-products.php`, `api/marketplace-products.php` | Existing seller workspace remains the integration target |
| RFQ creation and inboxes | `api/rfq.php`, `api/buyer-rfqs.php`, `api/seller-rfqs.php`, `api/seller-enquiries.php` | Reused through `/rfq/` |
| Orders | `api/orders.php` | Backend exists; UI/payment connection remains incomplete |
| Search/product experience | `search/index.html`, `product/index.html`, `assets/marketplace-data.js` | Reused through the existing `/search/` and `/product/` routes |

## Historical prototypes intentionally not promoted

`buyer-flow-v2` has Next `app/cart` and `app/checkout` pages, but they store cart and order state in `localStorage` and do not use the production order API. They are not integrated as production checkout functionality. `product-flow-v13` contains a static product-detail prototype; it is retained as reference only.

## Current v0 bridge

The approved v0 UI now routes sign-in, seller activation, RFQ learning, and search into the existing BookMyMetal flows on `www.bookmymetal.com`. This keeps the new presentation intact while retaining server-side sessions, OTP security, OAuth secrets, and MySQL logic in their existing PHP runtime.
