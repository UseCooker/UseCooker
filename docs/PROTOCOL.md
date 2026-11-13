# COOKER protocol

Short definitions. For the narrative README, start at the root.

## Actors

| Name | Role |
| --- | --- |
| **Coin** | A Pump.fun mint (bonding curve, then PumpSwap after migration). |
| **Creator fee** | Trading fee share reserved for the coin’s creator / fee config. |
| **COOKER treasury** | Public fee recipient that receives routed creator fees. |
| **Claim** | On-chain collection of accrued creator fees into the treasury. |
| **Cook** | Spending a claim: buybacks, LP deepen, COOKER buy — then burns / LP lock. |

## Phases

### Pre-migration (`pre-migrate`)

Coin is still on the Pump bonding curve.

| Leg | % | Action |
| ---: | ---: | --- |
| Coin | 80 | Buy on curve → burn |
| LP | 0 | — |
| COOKER | 20 | Buy COOKER → burn |

### Post-migration (`migrated`)

Coin has graduated to the AMM.

| Leg | % | Action |
| ---: | ---: | --- |
| Coin | 50 | Buy on pool → burn |
| LP | 30 | Deposit liquidity → burn LP tokens (lock) |
| COOKER | 20 | Buy COOKER → burn |

## Invariants

1. **One claim = 100% of that coin’s creator fee** for the claim window. No silent skim before the split.
2. **COOKER’s 20% is inside the split**, not stacked after it.
3. **Bought coin and COOKER are burned.** LP tokens from the deepen leg are burned so liquidity cannot be withdrawn by COOKER.
4. **Claims are public.** Visibility on explorers and charts is intentional.
5. **Cashback and holder-reward Pump modes cannot route** — those fee designs do not pay a recipient COOKER can claim.

## Opt-in

Existing coins attach by pointing Pump fee-share / creator fee recipient at:

```
CookXaMAvFhXzAP4gRL43VgSn4e3pFapUki31NSQgu3t
```

Launches through usecooker.xyz set routing from creation.

## What this doc is not

This is not a smart-contract ABI dump and not an ops runbook. Execution details (keepers, RPC providers, internal workers) stay private. The economics and public addresses above are the contract with the audience.
