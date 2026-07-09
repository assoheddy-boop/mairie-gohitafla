import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-500 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-500 font-heading font-bold text-lg">S</span>
              </div>
              <div>
                <div className="font-heading font-bold text-lg">Mairie de Gohitafla</div>
              </div>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              La Mairie de Gohitafla est au service de ses citoyens pour assurer le développement 
              harmonieux de la commune et offrir des services publics de qualité.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5">Liens rapides</h3>
            <ul className="space-y-3">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'La Mairie', href: '/la-mairie' },
                { name: 'Services en ligne', href: '/services' },
                { name: 'Démarches', href: '/demarches' },
                { name: 'Patrimoine & Culture', href: '/patrimoine' },
                { name: 'Suivi de demande', href: '/suivi' },
                { name: 'Agenda', href: '/agenda' },
                { name: 'Galerie photos', href: '/galerie' },
                { name: 'Actualités', href: '/actualites' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-200 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <ExternalLink size={12} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5">Nos services</h3>
            <ul className="space-y-3">
              {[
                'Acte de naissance',
                'Acte de mariage',
                'Acte de décès',
                'Certificat de résidence',
                'Légalisation',
                'Certificat de célibat',
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-primary-200 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <ExternalLink size={12} />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-primary-200 text-sm">
                  Mairie de Gohitafla<br />
                  Gohitafla, Côte d'Ivoire
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent-500 flex-shrink-0" />
                <span className="text-primary-200 text-sm">+225 XX XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent-500 flex-shrink-0" />
                <span className="text-primary-200 text-sm">contact@mairie-gohitafla.ci</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-accent-500 flex-shrink-0" />
                <span className="text-primary-200 text-sm">Lun - Ven : 7h30 - 16h30</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-200 text-sm">
              &copy; {new Date().getFullYear()} Mairie de Gohitafla. Tous droits réservés.
            </p>
            <p className="text-primary-300 text-xs">
              République de Côte d'Ivoire - Union - Discipline - Travail
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
