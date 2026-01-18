import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSupabaseClient } from '../../lib/supabaseClient'
import { createSlugForName } from '../../utils/slug'

const initialState = {
  templateSlug: 'classic',
  manual: {
    firstName: '',
    lastName: '',
    text: '',
    eventDate: '',
    eventLocation: '',
  },
  bulk: {
    text: '',
    eventDate: '',
    eventLocation: '',
  },
  recipients: [],
  status: 'idle',
  error: null,
  itemsByInvitationId: {},
  batches: [],
}

export const createInvitationBatch = createAsyncThunk(
  'invitations/createInvitationBatch',
  async ({ recipients, templateSlug }, { getState, rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const state = getState()
    const user = state.auth.user
    if (!user) {
      return rejectWithValue('You need to be signed in to save invitations')
    }
    const { text, eventDate, eventLocation } = state.invitations.bulk
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert({
        user_id: user.id,
        template_slug: templateSlug,
        text_content: text,
        event_date: eventDate,
        event_location: eventLocation,
      })
      .select()
      .single()
    if (invitationError) {
      return rejectWithValue(invitationError.message)
    }
    const itemsPayload = recipients.map((recipient) => ({
      invitation_id: invitation.id,
      first_name: recipient.firstName,
      last_name: recipient.lastName,
      slug: createSlugForName(recipient.firstName, recipient.lastName),
    }))
    const { data: items, error: itemsError } = await supabase
      .from('invitation_items')
      .insert(itemsPayload)
      .select()
    if (itemsError) {
      return rejectWithValue(itemsError.message)
    }
    return { invitation, items }
  },
)

export const fetchInvitationBatches = createAsyncThunk(
  'invitations/fetchInvitationBatches',
  async (_, { getState, rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const state = getState()
    const user = state.auth.user
    if (!user) {
      return rejectWithValue('You need to be signed in to load invitations')
    }
    const { data, error } = await supabase
      .from('invitations')
      .select(
        'id, user_id, template_slug, text_content, event_date, event_location, created_at, invitation_items (id, first_name, last_name, slug)',
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) {
      return rejectWithValue(error.message)
    }
    const batches = (data || []).map((invitation) => ({
      invitation: {
        id: invitation.id,
        user_id: invitation.user_id,
        template_slug: invitation.template_slug,
        text_content: invitation.text_content,
        event_date: invitation.event_date,
        event_location: invitation.event_location,
        created_at: invitation.created_at,
      },
      items: invitation.invitation_items || [],
    }))
    return batches
  },
)

export const deleteInvitationBatch = createAsyncThunk(
  'invitations/deleteInvitationBatch',
  async (invitationId, { getState, rejectWithValue }) => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return rejectWithValue('Supabase is not configured')
    }
    const state = getState()
    const user = state.auth.user
    if (!user) {
      return rejectWithValue('You need to be signed in to delete invitations')
    }
    const { error: itemsError } = await supabase
      .from('invitation_items')
      .delete()
      .eq('invitation_id', invitationId)
    if (itemsError) {
      return rejectWithValue(itemsError.message)
    }
    const { error: invitationError } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId)
      .eq('user_id', user.id)
    if (invitationError) {
      return rejectWithValue(invitationError.message)
    }
    return invitationId
  },
)

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    setTemplateSlug(state, action) {
      state.templateSlug = action.payload
    },
    updateManualField(state, action) {
      const { field, value } = action.payload
      state.manual[field] = value
    },
    updateBulkField(state, action) {
      const { field, value } = action.payload
      state.bulk[field] = value
    },
    setRecipients(state, action) {
      state.recipients = action.payload
    },
    resetRecipients(state) {
      state.recipients = []
    },
    clearInvitationError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvitationBatch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createInvitationBatch.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { invitation, items } = action.payload
        state.itemsByInvitationId[invitation.id] = items
        state.batches.push({ invitation, items })
      })
      .addCase(createInvitationBatch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to create invitations'
      })
      .addCase(fetchInvitationBatches.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchInvitationBatches.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.batches = action.payload
        state.itemsByInvitationId = {}
        action.payload.forEach((batch) => {
          state.itemsByInvitationId[batch.invitation.id] = batch.items
        })
      })
      .addCase(fetchInvitationBatches.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load invitations'
      })
      .addCase(deleteInvitationBatch.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteInvitationBatch.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const id = action.payload
        state.batches = state.batches.filter((batch) => batch.invitation.id !== id)
        delete state.itemsByInvitationId[id]
      })
      .addCase(deleteInvitationBatch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to delete invitation'
      })
  },
})

export const {
  setTemplateSlug,
  updateManualField,
  updateBulkField,
  setRecipients,
  resetRecipients,
  clearInvitationError,
} = invitationsSlice.actions

export default invitationsSlice.reducer
