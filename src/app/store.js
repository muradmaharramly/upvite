import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/ui/uiSlice'
import authReducer from '../features/auth/authSlice'
import invitationsReducer from '../features/invitations/invitationsSlice'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    invitations: invitationsReducer,
  },
})

export default store


