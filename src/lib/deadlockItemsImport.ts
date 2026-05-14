import type { Item, ItemTier, ItemType } from '../types'

export const DEADLOCK_ASSETS_ITEMS_URL =
  'https://assets.deadlock-api.com/v2/items'

interface AssetsItemPayload {
  id: number
  class_name: string
  name: string
  shopable?: boolean
  type?: string
  item_slot_type?: string
  item_tier?: number
  cost?: number
  image?: string
  shop_image?: string
  shop_image_webp?: string
}

const SLOT_TO_TYPE: Record<string, ItemType> = {
  weapon: 'Disparo',
  vitality: 'Vida',
  spirit: 'Espiritual',
}

function clampTier(gameTier: number | undefined): ItemTier {
  const t = gameTier ?? 1
  if (t <= 1) return 1
  if (t === 2) return 2
  if (t === 3) return 3
  return 4
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export function assetPayloadToItem(row: AssetsItemPayload): Item {
  const slot = row.item_slot_type ?? ''
  const type = SLOT_TO_TYPE[slot] ?? 'Espiritual'
  const tierRaw = row.item_tier ?? 1
  const tier = clampTier(tierRaw)

  const image = row.shop_image?.trim() || row.image?.trim() || ''
  const descriptionImage =
    row.shop_image_webp &&
    row.shop_image_webp !== row.shop_image &&
    row.shop_image_webp.trim()
      ? row.shop_image_webp.trim()
      : undefined

  const tierNote =
    tierRaw !== tier ? `tier tienda ${tierRaw}→${tier}` : `tier tienda ${tierRaw}`

  return {
    id: `dm-item-${row.id}`,
    name: row.name.trim() || row.class_name,
    image,
    soulCost: typeof row.cost === 'number' ? row.cost : 0,
    type,
    tier,
    descriptionImage,
    notes: `Deadlock Assets API · ${row.class_name} · ${tierNote}`,
  }
}

/** Ítems comprables en tienda (~172): weapon / vitality / spirit. */
export async function buildShopItemsFromAssetsApi(): Promise<Item[]> {
  const rows = await fetchJson<AssetsItemPayload[]>(DEADLOCK_ASSETS_ITEMS_URL)
  const shop = rows.filter(
    (r) =>
      r.shopable === true &&
      r.type === 'upgrade' &&
      typeof r.id === 'number' &&
      r.name?.trim(),
  )

  const items = shop.map(assetPayloadToItem).filter((it) => it.image.length > 0)

  items.sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
  )

  return items
}
