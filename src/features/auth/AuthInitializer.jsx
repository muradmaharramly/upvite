import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './authSlice'

function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('upvite_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) {
          dispatch(setUser(parsed))
          return
        }
      }
    } catch {
      window.localStorage.removeItem('upvite_user')
    }
    dispatch(setUser(null))
  }, [dispatch])

  return null
}

export default AuthInitializer
