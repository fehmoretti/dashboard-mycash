import { useEffect, useState } from 'react'

/**
 * Hook para animar contagem de um valor numérico
 * @param targetValue - Valor final a ser alcançado
 * @param duration - Duração da animação em milissegundos (padrão: 800ms)
 * @returns Valor atual durante a animação
 */
export const useCountAnimation = (targetValue: number, duration: number = 800): number => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (targetValue === 0) {
      setDisplayValue(0)
      return
    }

    const startValue = displayValue
    const difference = targetValue - startValue
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      const currentValue = startValue + difference * easeOut
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetValue)
      }
    }

    const animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [targetValue, duration])

  return Math.round(displayValue * 100) / 100 // Arredonda para 2 casas decimais
}
