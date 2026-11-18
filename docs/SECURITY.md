# Security — what we publish vs what we don’t

COOKER’s public GitHub is for **appearance, clarity, and verification**. It is not a dump of the production app.

## Safe to publish

| Item | Why |
| --- | --- |
| Fee recipient address | Anyone attaching a coin needs it |
| Split tables (80/20, 50/30/20) | Protocol truth |
| Product URLs & socials | Discovery |
| Fee math (`protocol/splits.ts`) | Canonical split logic |
| Read-only RPC probes | Let people verify attach status without trust |
| High-level flow diagrams | Understanding |

## Never publish

| Item | Why |
| --- | --- |
| Treasury / keeper private keys | Direct fund theft |
| Webhook signing secrets | Spoofed events → bad automation |
| Supabase / DB service keys | Data breach + write access |
| Admin API tokens / routes | Privilege escalation |
| Internal spend / claim runbooks with live credentials | Operational compromise |
| `.env` files | Usually contain all of the above |

## How to think about `protocol/`

- `splits.ts` — math only. Cannot move SOL.
- `check-attach.ts` — public RPC reads. Cannot claim or swap.
- `protocol.ts` — public constants (treasury, site, splits).

If a PR adds signing, key loading, webhook handlers, or “run the cook” scripts that require secrets, **reject it** for this repo.

## Reporting

If you find a vulnerability that affects funds or user safety, contact the team via [X @UseCooker](https://x.com/usecooker) — do not open a public issue with exploit detail.
