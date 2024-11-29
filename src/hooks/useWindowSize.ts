import { useEffect, useState } from 'react'

interface WindowSize {
  width?: number
  height?: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({})

  useEffect(() => {
    const updateWindowSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [])

  return windowSize
}
