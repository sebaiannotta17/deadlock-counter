import type { CounterPriority, PurchaseTiming } from '../types'

/**
 * Catálogo base “community list” (enemigo → ítems sugeridos).
 * `itemName` debe coincidir con el nombre en assets.deadlock-api.com tras aliases
 * (p. ej. “Silence Glyph” → Silence Wave).
 */
export interface CounterBaseRow {
  enemyHeroId: string
  itemName: string
  priority: CounterPriority
  timing: PurchaseTiming
  explanation?: string
}

/** Normaliza sinónimos de la lista comunitaria → nombre canónico en la API. */
export const COUNTER_ITEM_ALIASES: Record<string, string> = {
  'debuff remover': 'Debuff Reducer',
  'superior stamina': 'Extra Stamina',
  'silence glyph': 'Silence Wave',
  'silencing glyph': 'Silence Wave',
  'rebuff remover': 'Debuff Reducer',
  'soul shredder bullets': 'Spirit Shredder Bullets',
  curse: 'Cursed Relic',
  'improved spirit armor': 'Improved Spirit',
}

export const counterListBase: CounterBaseRow[] = [
  // Abrams
  { enemyHeroId: 'dm-6', itemName: 'Decay', priority: 'media', timing: 'mid' },
  { enemyHeroId: 'dm-6', itemName: 'Healbane', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-6',
    itemName: 'Toxic Bullets',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-6',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-6',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
    explanation:
      'Facilita encadenar tras su embestida (parry / responder al shoulder charge).',
  },

  // Bebop
  {
    enemyHeroId: 'dm-15',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-15',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista comunitaria: “Debuff Remover” (no existe en API → Reducer).',
  },
  {
    enemyHeroId: 'dm-15',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },
  { enemyHeroId: 'dm-15', itemName: 'Warp Stone', priority: 'media', timing: 'mid' },

  // Dynamo
  {
    enemyHeroId: 'dm-11',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-11',
    itemName: 'Unstoppable',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-11',
    itemName: 'Rescue Beam',
    priority: 'media',
    timing: 'mid',
    explanation: 'Útil para salvar aliados atrapados en su ult (pull).',
  },

  // Grey Talon
  {
    enemyHeroId: 'dm-17',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-17',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-17',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },

  // Haze
  {
    enemyHeroId: 'dm-13',
    itemName: 'Metal Skin',
    priority: 'media',
    timing: 'mid',
  },
  { enemyHeroId: 'dm-13', itemName: 'Warp Stone', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-13',
    itemName: 'Return Fire',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-13',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
    explanation: 'Prioridad temprana en la lista comunitaria.',
  },

  // Infernus
  {
    enemyHeroId: 'dm-1',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-1',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-1',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },

  // Ivy
  {
    enemyHeroId: 'dm-20',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Superior Stamina” (no existe en API → Extra Stamina).',
  },
  { enemyHeroId: 'dm-20', itemName: 'Warp Stone', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-20',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
    explanation: 'Glyph de silencio en la lista comunitaria.',
  },
  {
    enemyHeroId: 'dm-20',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },

  // Kelvin
  {
    enemyHeroId: 'dm-12',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Superior Stamina”.',
  },
  {
    enemyHeroId: 'dm-12',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-12',
    itemName: 'Enduring Speed',
    priority: 'media',
    timing: 'mid',
  },

  // Lady Geist
  {
    enemyHeroId: 'dm-4',
    itemName: 'Silencer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-4',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-4',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-4',
    itemName: 'Cursed Relic',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Curse”.',
  },

  // Lash
  {
    enemyHeroId: 'dm-31',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-31',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-31',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-31',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },

  // McGinnis — lista corta (antes del bloque Mirage en el paste original)
  {
    enemyHeroId: 'dm-8',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Superior Stamina”.',
  },

  // Mirage
  {
    enemyHeroId: 'dm-52',
    itemName: 'Improved Spirit',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “improved Spirit Armor”.',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Toxic Bullets',
    priority: 'media',
    timing: 'mid',
  },
  { enemyHeroId: 'dm-52', itemName: 'Healbane', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Inhibitor',
    priority: 'baja',
    timing: 'late',
    explanation: 'Si hay muchas almas / valor situacional.',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “sin escape”.',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Silencer',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “sin escape”.',
  },
  {
    enemyHeroId: 'dm-52',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “sin escape”.',
  },

  // Mo & Krill (sin “Paradox” como ítem; es otro héroe)
  {
    enemyHeroId: 'dm-18',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-18',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-18',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  { enemyHeroId: 'dm-18', itemName: 'Warp Stone', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-18',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-18',
    itemName: 'Extra Stamina',
    priority: 'baja',
    timing: 'mid',
    explanation: 'Opcional en la lista comunitaria (“?”).',
  },

  // Paradox — sugerencias de ítems genéricos (la fila venía con dudas)
  {
    enemyHeroId: 'dm-10',
    itemName: 'Reactive Barrier',
    priority: 'media',
    timing: 'mid',
    explanation: 'Sugerencia base; ajustar según matchup.',
  },
  {
    enemyHeroId: 'dm-10',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista comunitaria mencionaba “Debuff Remover”.',
  },
  {
    enemyHeroId: 'dm-10',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
    explanation: 'Opcional (“?” en la lista).',
  },
  {
    enemyHeroId: 'dm-10',
    itemName: 'Extra Stamina',
    priority: 'baja',
    timing: 'mid',
    explanation: 'Opcional (“?” en la lista).',
  },

  // Pocket
  {
    enemyHeroId: 'dm-50',
    itemName: 'Silencer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-50',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-50',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-50',
    itemName: 'Spirit Shredder Bullets',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-50',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },

  // Seven
  {
    enemyHeroId: 'dm-2',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-2',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },

  // Shiv
  {
    enemyHeroId: 'dm-19',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  { enemyHeroId: 'dm-19', itemName: 'Decay', priority: 'media', timing: 'mid' },
  { enemyHeroId: 'dm-19', itemName: 'Healbane', priority: 'media', timing: 'mid' },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Toxic Bullets',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Silencer',
    priority: 'baja',
    timing: 'late',
    explanation: 'Lista: enfocado a ventana de ult.',
  },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Silence Wave',
    priority: 'baja',
    timing: 'late',
    explanation: 'Lista: enfocado a ventana de ult.',
  },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Ethereal Shift',
    priority: 'baja',
    timing: 'late',
    explanation: 'Lista: enfocado a ventana de ult.',
  },
  {
    enemyHeroId: 'dm-19',
    itemName: 'Restorative Locket',
    priority: 'baja',
    timing: 'late',
    explanation: 'Lista: enfocado a ventana de ult.',
  },

  // Vindicta
  {
    enemyHeroId: 'dm-3',
    itemName: 'Knockdown',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-3',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-3',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-3',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },

  // Viscous
  {
    enemyHeroId: 'dm-35',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-35',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
  },

  // Warden
  {
    enemyHeroId: 'dm-25',
    itemName: 'Extra Stamina',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Extra Stamina”.',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Stamina Mastery',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Superior Stamina” (sinónimo comunitario → Stamina Mastery).',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Debuff Reducer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Cursed Relic',
    priority: 'baja',
    timing: 'late',
    explanation: 'Lista: “Curse” / ult.',
  },
  {
    enemyHeroId: 'dm-25',
    itemName: 'Unstoppable',
    priority: 'media',
    timing: 'mid',
  },

  // Wraith
  {
    enemyHeroId: 'dm-7',
    itemName: 'Slowing Hex',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-7',
    itemName: 'Metal Skin',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-7',
    itemName: 'Return Fire',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-7',
    itemName: 'Extra Stamina',
    priority: 'baja',
    timing: 'mid',
    explanation: 'Opcional (“?”) en la lista.',
  },
  {
    enemyHeroId: 'dm-7',
    itemName: 'Reactive Barrier',
    priority: 'alta',
    timing: 'early',
  },
  {
    enemyHeroId: 'dm-7',
    itemName: 'Ethereal Shift',
    priority: 'media',
    timing: 'mid',
  },

  // Yamato
  {
    enemyHeroId: 'dm-27',
    itemName: 'Silencer',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-27',
    itemName: 'Silence Wave',
    priority: 'media',
    timing: 'mid',
  },
  {
    enemyHeroId: 'dm-27',
    itemName: 'Cursed Relic',
    priority: 'media',
    timing: 'mid',
    explanation: 'Lista: “Curse”.',
  },
]
