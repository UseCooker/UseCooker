/**
 * Public protocol constants — mirror of what the product exposes.
 * Safe to import, fork, or display in third-party tools.
 */

export const PROTOCOL = {
  name: "COOKER",
  handle: "@UseCooker",
  siteOrigin: "https://usecooker.xyz",
  socials: {
    x: "https://x.com/usecooker",
    github: "https://github.com/UseCooker/UseCooker",
  },
  /** On-chain fee recipient. Publish freely. */
  feeRecipient: "CookVpYzGqmvgufucVEyExZnPY5hULRHYE5qtcQAD8DH",
} as const

export const FEE_SPLITS = {
  preMigrate: [
    { label: "Coin buyback", value: 80, hint: "Bought on the chart, then burned" },
    { label: "COOKER", value: 20, hint: "Bought and burned" },
  ],
  postMigrate: [
    { label: "Coin buyback", value: 50, hint: "Bought on the chart, then burned" },
    { label: "LP deepen", value: 30, hint: "Deposited and LP burned to lock" },
    { label: "COOKER", value: 20, hint: "Bought and burned" },
  ],
} as const

/** Coin page URL written into token metadata when none is supplied. */
export function coinPageUrl(mint: string) {
  return `${PROTOCOL.siteOrigin}/coin/${mint}`
}

export function shortAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 1) return address
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}
