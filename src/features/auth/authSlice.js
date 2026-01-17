import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSupabaseClient } from '../../lib/supabaseClient'

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
}

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return { user: null }
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    return { user: null }
  }
  return { user }
})

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return rejectWithValue(error.message)
    }
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
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password })
    if (error) {
      return rejectWithValue(error.message)
    }
    return { user }
  },
)

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  const supabase = getSupabaseClient()
  if (!supabase) {
    return
  }
  const { error } = await supabase.auth.signOut()
  if (error) {
    return rejectWithValue(error.message)
  }
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
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'failed'
        state.user = null
        state.initialized = true
      })
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
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
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

