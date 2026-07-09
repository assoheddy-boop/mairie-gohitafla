import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

const HomePage = lazy(() => import('./pages/HomePage'))
const MairiePage = lazy(() => import('./pages/MairiePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const DemarchesPage = lazy(() => import('./pages/DemarchesPage'))
const ActualitesPage = lazy(() => import('./pages/ActualitesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const DemandeDocumentPage = lazy(() => import('./pages/DemandeDocumentPage'))
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'))
const PatrimoinePage = lazy(() => import('./pages/PatrimoinePage'))
const SuiviDemandePage = lazy(() => import('./pages/SuiviDemandePage'))
const AgendaPage = lazy(() => import('./pages/AgendaPage'))
const GaleriePage = lazy(() => import('./pages/GaleriePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/la-mairie" element={<MairiePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/demarches" element={<DemarchesPage />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demande-document/:type" element={<DemandeDocumentPage />} />
          <Route path="/patrimoine" element={<PatrimoinePage />} />
          <Route path="/suivi" element={<SuiviDemandePage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/galerie" element={<GaleriePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/agent" element={<AgentDashboard />} />
      </Routes>
    </Suspense>
  )
}

export default App
