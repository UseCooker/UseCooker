/**
 * COOKER — public fee-split math
 *
 * Pure functions. No network. No keys.
 * Shows how a claimed SOL amount becomes the three cook legs.
 *
 *   npx tsx protocol/splits.ts
 *   npx tsx protocol/splits.ts 2.5 migrated
 */

export type Phase = "pre-migrate" | "migrated"

/** Fixed protocol splits (percent of one claim). */
export const SPLITS = {
  "pre-migrate": { coinBuyback: 80, lp: 0, cooker: 20 },
  migrated: { coinBuyback: 50, lp: 30, cooker: 20 },
} as const

export type SplitLegs = {
  coin: bigint
  lp: bigint
  cooker: bigint
  total: bigint
  phase: Phase
}

const LAMPORTS_PER_SOL = 1_000_000_000n

/** Split claimed lamports into buyback / LP / COOKER legs. */
export function splitClaim(lamports: bigint, phase: Phase): SplitLegs {
  if (lamports < 0n) throw new Error("lamports must be >= 0")
  const s = SPLITS[phase]
  const coin = (lamports * BigInt(s.coinBuyback)) / 100n
  const lp = (lamports * BigInt(s.lp)) / 100n
  const cooker = lamports - coin - lp // remainder absorbs integer dust
  return { coin, lp, cooker, total: lamports, phase }
}

export function lamportsToSol(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL
  const frac = lamports % LAMPORTS_PER_SOL
  return `${whole}.${frac.toString().padStart(9, "0")}`
}

export function formatLegs(legs: SplitLegs): string {
  const rows = [
    ["phase", legs.phase],
    ["total", `${lamportsToSol(legs.total)} SOL`],
    ["coin buyback", `${lamportsToSol(legs.coin)} SOL`],
    ["LP deepen", `${lamportsToSol(legs.lp)} SOL`],
    ["COOKER", `${lamportsToSol(legs.cooker)} SOL`],
  ] as const
  return rows.map(([k, v]) => `  ${k.padEnd(14)} ${v}`).join("\n")
}

/** Demo: claim → legs for both phases. */
function main() {
  const args = process.argv.slice(2)
  const sol = args[0] ? Number(args[0]) : 1
  const phase = (args[1] as Phase | undefined) ?? "pre-migrate"

  if (!Number.isFinite(sol) || sol < 0) {
    console.error("Usage: npx tsx protocol/splits.ts [sol] [pre-migrate|migrated]")
    process.exit(1)
  }
  if (phase !== "pre-migrate" && phase !== "migrated") {
    console.error('Phase must be "pre-migrate" or "migrated"')
    process.exit(1)
  }

  const lamports = BigInt(Math.round(sol * Number(LAMPORTS_PER_SOL)))
  const legs = splitClaim(lamports, phase)

  console.log("\nCOOKER claim split\n")
  console.log(formatLegs(legs))
  console.log("\nBoth phases for the same claim:\n")
  for (const p of ["pre-migrate", "migrated"] as const) {
    console.log(formatLegs(splitClaim(lamports, p)))
    console.log("")
  }
}

main()
