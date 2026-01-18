import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function ThemeInitializer() {
  const theme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

export default ThemeInitializer

