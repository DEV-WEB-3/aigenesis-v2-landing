/**
 * Phase 6.5 — Genesis logo version switch.
 *
 * USE_GENESIS_LOGO_V1=true  → restore pre-rebrand stardust (backup in /backup/genesis-logo-v1/)
 * default / USE_GENESIS_LOGO_V2=true → premium signature rebrand (v2)
 */
function readEnvFlag(name: string): boolean {
  const direct = process.env[name]
  const pub = process.env[`NEXT_PUBLIC_${name}`]
  const v = direct ?? pub
  return v === 'true' || v === '1'
}

export const USE_GENESIS_LOGO_V1 = readEnvFlag('USE_GENESIS_LOGO_V1')

/** Active when V1 flag is off (default). Explicit V2 flag is optional. */
export const USE_GENESIS_LOGO_V2 = !USE_GENESIS_LOGO_V1 || readEnvFlag('USE_GENESIS_LOGO_V2')

export const ACTIVE_GENESIS_LOGO_VERSION = USE_GENESIS_LOGO_V1 ? ('v1' as const) : ('v2' as const)
