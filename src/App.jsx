import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'
import ManualBuilderPage from './pages/ManualBuilderPage'
import BulkBuilderPage from './pages/BulkBuilderPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import InvitePublicPage from './pages/InvitePublicPage'
import AuthInitializer from './features/auth/AuthInitializer'
import ThemeInitializer from './features/ui/ThemeInitializer'

function App() {
  return (
    <>
      <AuthInitializer />
      <ThemeInitializer />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="builder" element={<BuilderPage />} />
          <Route path="builder/manual" element={<ManualBuilderPage />} />
          <Route path="builder/bulk" element={<BulkBuilderPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
        <Route path="/invite/:templateSlug/:slug" element={<InvitePublicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
