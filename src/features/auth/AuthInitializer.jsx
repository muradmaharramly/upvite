import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSupabaseClient } from '../../lib/supabaseClient'
import { fetchCurrentUser, setUser } from './authSlice'

function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
    const supabase = getSupabaseClient()
    if (!supabase) {
      return
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user || null))
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  return null
}

export default AuthInitializer

