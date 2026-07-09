import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '../Chatbot'
import ScrollToTop from '../ScrollToTop'
import AccessibilityWidget from '../AccessibilityWidget'
import AlertBanner from '../AlertBanner'

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    </div>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <AlertBanner />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Chatbot />
      <ScrollToTop />
      <AccessibilityWidget />
    </div>
  )
}
