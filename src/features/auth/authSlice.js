import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSupabaseClient } from '../../lib/supabaseClient'

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
}

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const { data, error } = await supabase.rpc('sign_in_profile', {
      p_email: email,
      p_password: password,
    })
    if (error) {
      return rejectWithValue(error.message)
    }
    if (!data) {
      return rejectWithValue('Invalid email or password')
    }
    const user = { id: data.id, email: data.email }
    window.localStorage.setItem('upvite_user', JSON.stringify(user))
    return { user }
  },
)

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const { data, error } = await supabase.rpc('sign_up_profile', {
      p_email: email,
      p_password: password,
    })
    if (error) {
      return rejectWithValue(error.message)
    }
    const user = { id: data.id, email: data.email }
    window.localStorage.setItem('upvite_user', JSON.stringify(user))
    return { user }
  },
)

export const signOut = createAsyncThunk('auth/signOut', async () => {
  window.localStorage.removeItem('upvite_user')
  return
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.initialized = true
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to sign in'
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signUpWithEmail.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to sign up'
      })
      .addCase(signOut.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'succeeded'
        state.user = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to sign out'
      })
  },
})

export const { setUser, clearAuthError } = authSlice.actions

export default authSlice.reducer
