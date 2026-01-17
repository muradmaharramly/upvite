import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  isSidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload === 'dark' ? 'dark' : 'light'
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    closeSidebar(state) {
      state.isSidebarOpen = false
    },
  },
})

export const { setTheme, toggleTheme, toggleSidebar, closeSidebar } = uiSlice.actions

export default uiSlice.reducer

