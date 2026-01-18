import { useState, useEffect } from 'react'

export const useSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggle = () => {
    setIsExpanded((prev) => !prev)
  }

  const expand = () => {
    setIsExpanded(true)
  }

  const collapse = () => {
    setIsExpanded(false)
  }

  // Salvar estado no localStorage para persistência
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded')
    if (saved !== null) {
      setIsExpanded(saved === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', String(isExpanded))
  }, [isExpanded])

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  }
}
