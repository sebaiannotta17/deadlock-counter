import type {
  CounterRecommendation,
  Hero,
  Item,
} from '../types'

const img = (label: string, bg: string, fg: string) =>
  `https://placehold.co/256x256/${bg}/${fg}?text=${encodeURIComponent(label)}`

/** Los héroes reales se cargan al iniciar desde deadlock-metadata + Assets API (ids dm-*). */
export const seedHeroes: Hero[] = []

export const seedItems: Item[] = [
  {
    id: 'item-reactive',
    name: 'Reactive Barrier',
    image: img('RB', '0f766e', '99f6e4'),
    soulCost: 800,
    type: 'Vida',
    tier: 1,
    descriptionImage: img('RB+', '134e4a', 'ccfbf1'),
    description: 'Mitigación cuando te conectan burst o daño rápido.',
  },
  {
    id: 'item-extra',
    name: 'Extra Regen',
    image: img('REG', '14532d', 'bbf7d0'),
    soulCost: 600,
    type: 'Vida',
    tier: 1,
    description: 'Sosten en línea contra presión prolongada.',
  },
  {
    id: 'item-silence',
    name: 'Silence Glyph',
    image: img('SG', '3730a3', 'c4b5fd'),
    soulCost: 1200,
    type: 'Espiritual',
    tier: 2,
    descriptionImage: img('SG+', '312e81', 'ddd6fe'),
    description: 'Corta casts y combos mágicos.',
  },
  {
    id: 'item-bullet',
    name: 'Armor Piercing',
    image: img('AP', '075985', 'bae6fd'),
    soulCost: 1400,
    type: 'Disparo',
    tier: 2,
    description: 'Mejor contra objetivos acorazados o tanques.',
  },
  {
    id: 'item-spirit-armor',
    name: 'Spirit Armor',
    image: img('SA', '581c87', 'e9d5ff'),
    soulCost: 2200,
    type: 'Espiritual',
    tier: 3,
    description: 'Reduce impacto del daño mágico en ventanas largas.',
  },
  {
    id: 'item-debuff',
    name: 'Slowing Hex',
    image: img('SH', '831843', 'fbcfe8'),
    soulCost: 1000,
    type: 'Espiritual',
    tier: 2,
    description: 'Pega contra móviles que dependen de reposicionarse.',
  },
]

/** Enemigos de ejemplo enlazados a ids de juego (deadlock-metadata base.json). */
export const seedRecommendations: CounterRecommendation[] = [
  {
    id: 'rec-1',
    enemyHeroId: 'dm-63',
    itemId: 'item-reactive',
    priority: 'alta',
    timing: 'early',
    explanation:
      'Reduce el impacto de su ráfaga inicial y te deja negociar mejor los intercambios.',
  },
  {
    id: 'rec-2',
    enemyHeroId: 'dm-63',
    itemId: 'item-silence',
    priority: 'media',
    timing: 'mid',
    explanation: 'Rompe su cadencia de habilidades en ventanas clave.',
  },
  {
    id: 'rec-3',
    enemyHeroId: 'dm-63',
    itemId: 'item-extra',
    priority: 'media',
    timing: 'early',
    explanation: 'Contrarresta el desgaste por presión mágica constante.',
  },
  {
    id: 'rec-4',
    enemyHeroId: 'dm-15',
    itemId: 'item-reactive',
    priority: 'alta',
    timing: 'early',
    explanation:
      'Mitiga el burst cuando salta sobre ti o tu carry en línea.',
  },
  {
    id: 'rec-5',
    enemyHeroId: 'dm-15',
    itemId: 'item-debuff',
    priority: 'media',
    timing: 'mid',
    explanation:
      'Limita su capacidad de encajar y salir después del engage.',
  },
  {
    id: 'rec-6',
    enemyHeroId: 'dm-15',
    itemId: 'item-bullet',
    priority: 'baja',
    timing: 'late',
    explanation: 'Útil si pivotas a daño para convertir tras parar su engage.',
  },
  {
    id: 'rec-7',
    enemyHeroId: 'dm-6',
    itemId: 'item-bullet',
    priority: 'alta',
    timing: 'mid',
    explanation: 'Penetración y daño enfrentan mejor su perfil tanque.',
  },
  {
    id: 'rec-8',
    enemyHeroId: 'dm-6',
    itemId: 'item-spirit-armor',
    priority: 'media',
    timing: 'late',
    explanation: 'Si su amenaza viene acompañada de daño mágico del equipo.',
  },
]
