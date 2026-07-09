import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, FileText, Phone } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="relative mb-8">
          <span className="text-[150px] md:text-[200px] font-heading font-bold text-primary-50 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-accent-500 rounded-full flex items-center justify-center shadow-xl">
              <Search size={40} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-primary-500 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
          Vérifiez l'adresse ou utilisez les liens ci-dessous.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link to="/" className="btn-primary">
            <Home size={18} className="mr-2" />
            Retour à l'accueil
          </Link>
          <Link to="/services" className="btn-outline">
            <FileText size={18} className="mr-2" />
            Services en ligne
          </Link>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-3 font-semibold">Vous cherchez peut-être :</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Acte de naissance', href: '/demande-document/acte-naissance' },
              { label: 'Contact', href: '/contact' },
              { label: 'Démarches', href: '/demarches' },
              { label: 'Actualités', href: '/actualites' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-500 hover:border-primary-300 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
