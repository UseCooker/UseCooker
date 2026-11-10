/**
 * COOKER — read-only attach check (public RPC)
 *
 * Tells you, at a high level, whether a Pump mint can / does feed COOKER.
 * Does NOT claim fees, sign txs, or touch private keys.
 *
 *   npm install
 *   npx tsx protocol/check-attach.ts <MINT>
 *
 * Optional:
 *   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com npx tsx protocol/check-attach.ts <MINT>
 */

import { Connection, PublicKey } from "@solana/web3.js"

const DEFAULT_TREASURY = "CookVpYzGqmvgufucVEyExZnPY5hULRHYE5qtcQAD8DH"

/** Public fee recipient — set `COOKER_FEE_RECIPIENT` when testing another wallet. */
export function cookerTreasuryAddress() {
  const fromEnv =
    process.env.NEXT_PUBLIC_COOKER_FEE_RECIPIENT?.trim() ||
    process.env.COOKER_FEE_RECIPIENT?.trim()
  return new PublicKey(fromEnv || DEFAULT_TREASURY)
}

/** @deprecated Use {@link cookerTreasuryAddress} */
export const COOKER_TREASURY = cookerTreasuryAddress()

export type AttachVerdict =
  | "attached"
  | "not-attached"
  | "cashback"
  | "holder-reward"
  | "unknown"

export function describeAttach(verdict: AttachVerdict): string {
  switch (verdict) {
    case "attached":
      return "Attached to COOKER. Claims on this mint feed the public split."
    case "not-attached":
      return "Not attached. Point creator fee shares at the COOKER treasury to opt in."
    case "cashback":
      return "Cashback coin — fees stay with traders. COOKER cannot cook it."
    case "holder-reward":
      return "Holder-reward coin — fees pay holders, not a fee recipient."
    default:
      return "Could not classify. Inspect the mint on Pump / explorers."
  }
}

/**
 * Heuristic account probe.
 *
 * Full share-config decoding needs the Pump SDK layouts. This script only
 * checks that the mint exists and prints the public COOKER treasury so you
 * can compare fee config in a wallet / explorer UI.
 *
 * Treat an "attached" verdict from this script as informational — confirm on
 * usecooker.xyz or by reading the Pump fee-sharing account with the official SDK.
 */
export async function probeMint(
  connection: Connection,
  mintStr: string
): Promise<{ mint: PublicKey; exists: boolean; treasury: string }> {
  let mint: PublicKey
  try {
    mint = new PublicKey(mintStr)
  } catch {
    throw new Error(`Invalid Solana address: ${mintStr}`)
  }

  const info = await connection.getAccountInfo(mint, "confirmed")
  return {
    mint,
    exists: info !== null,
    treasury: COOKER_TREASURY.toBase58(),
  }
}

async function main() {
  const mintArg = process.argv[2]
  if (!mintArg) {
    console.error("Usage: npx tsx protocol/check-attach.ts <MINT>")
    process.exit(1)
  }

  const rpc =
    process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com"
  const connection = new Connection(rpc, "confirmed")

  console.log("\nCOOKER attach probe (read-only)\n")
  console.log(`  rpc       ${rpc}`)
  console.log(`  treasury  ${COOKER_TREASURY.toBase58()}`)

  try {
    const result = await probeMint(connection, mintArg)
    console.log(`  mint      ${result.mint.toBase58()}`)
    console.log(`  on-chain  ${result.exists ? "yes" : "no account found"}`)
    console.log("")
    console.log("Next steps:")
    console.log("  1. Open https://usecooker.xyz and search the mint")
    console.log("  2. Or compare Pump fee-share shareholders to the treasury above")
    console.log("  3. Cashback / holder-reward coins cannot attach — see docs/FAQ.md")
    console.log("")
    console.log(describeAttach("unknown"))
  } catch (err) {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}

main()
