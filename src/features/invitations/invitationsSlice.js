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
