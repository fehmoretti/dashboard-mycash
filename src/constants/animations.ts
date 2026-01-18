// Constantes de animação e transição do sistema

// Durações (em milissegundos)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  MEDIUM: 400,
  SLOW: 600,
  VERY_SLOW: 800,
  EXTRA_SLOW: 1000,
} as const

// Delays entre itens em listas/grids (stagger)
export const ANIMATION_STAGGER = {
  CARD: 50,
  GRID: 80,
  DONUT: 100,
} as const

// Easing functions
export const ANIMATION_EASING = {
  EASE_IN_OUT: 'ease-in-out',
  EASE_OUT: 'ease-out',
  EASE_IN: 'ease-in',
} as const

// Configurações de transição padrão
export const TRANSITIONS = {
  BUTTON: `${ANIMATION_DURATION.FAST}ms ${ANIMATION_EASING.EASE_IN_OUT}`,
  CARD: `${ANIMATION_DURATION.SLOW - 250}ms ${ANIMATION_EASING.EASE_OUT}`,
  AVATAR: `${ANIMATION_DURATION.FAST}ms ${ANIMATION_EASING.EASE_IN_OUT}`,
  INPUT: `${ANIMATION_DURATION.FAST}ms ${ANIMATION_EASING.EASE_OUT}`,
  MODAL: `${ANIMATION_DURATION.SLOW - 250}ms ${ANIMATION_EASING.EASE_OUT}`,
} as const
