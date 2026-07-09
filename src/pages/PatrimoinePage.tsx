import { Link } from 'react-router-dom'
import {
  ChevronRight, MapPin, Users, Sparkles, Music, TreePine, Mountain,
  Star, ArrowRight, Calendar, Heart, Landmark, Sun, Drum
} from 'lucide-react'
import useSEO from '../hooks/useSEO'

const villages = [
  {
    nom: 'Gohitafla',
    type: 'Chef-lieu de commune',
    description: 'Centre administratif et économique de la commune, siège de la mairie et des principaux services publics. Ville principale du pays Gouro.',
    population: 'Principal',
    particularite: 'Centre urbain, marché central',
  },
  {
    nom: 'Bazra',
    type: 'Village',
    description: 'Village Gouro historique reconnu pour ses traditions ancestrales et sa vie communautaire active.',
    population: 'Important',
    particularite: 'Traditions ancestrales',
  },
  {
    nom: 'Bognonzra',
    type: 'Village',
    description: 'Localité dynamique ancrée dans les traditions du peuple Gouro, productrice de cultures vivrières.',
    population: 'Moyen',
    particularite: 'Agriculture vivrière',
  },
  {
    nom: 'Dananon',
    type: 'Village',
    description: 'Village agricole aux terres fertiles, contribuant à la production cacaoyère et vivrière de la commune.',
    population: 'Moyen',
    particularite: 'Cacao, cultures vivrières',
  },
  {
    nom: 'Gogokro',
    type: 'Village',
    description: 'Communauté villageoise active, participant aux grandes fêtes traditionnelles Gouro.',
    population: 'Moyen',
    particularite: 'Fêtes traditionnelles',
  },
  {
    nom: 'Kpangbassou',
    type: 'Village',
    description: 'Village réputé pour ses forêts sacrées et ses cérémonies initiatiques du peuple Gouro.',
    population: 'Moyen',
    particularite: 'Forêts sacrées, initiations',
  },
  {
    nom: 'Tiéningboué',
    type: 'Village',
    description: 'Village reconnu pour ses plantations et son implication dans la vie culturelle de la région.',
    population: 'Moyen',
    particularite: 'Plantations, culture',
  },
  {
    nom: 'Zaguiéta',
    type: 'Village',
    description: 'Village agricole dynamique, producteur de cultures de rente. Communauté solidaire et engagée.',
    population: 'Moyen',
    particularite: 'Agriculture, solidarité',
  },
]

const traditions = [
  {
    nom: 'La danse du Zaouli',
    description: 'Le Zaouli est une danse traditionnelle emblématique du peuple Gouro, inscrite au patrimoine culturel immatériel de l\'UNESCO. Le danseur porte un masque coloré et exécute des mouvements rapides et précis au rythme des tambours.',
    icon: Music,
  },
  {
    nom: 'Les masques sacrés Gouro',
    description: 'Les masques Gouro sont célèbres dans le monde entier pour leur beauté et leur finesse. Ils jouent un rôle central dans les cérémonies rituelles, représentant les esprits de la nature et des ancêtres.',
    icon: Sparkles,
  },
  {
    nom: 'L\'art culinaire Gouro',
    description: 'La cuisine locale est riche et variée : foutou banane, sauce graine, sauce aubergine, gibier braisé. Les plats traditionnels sont préparés lors des grandes cérémonies communautaires et des fêtes de récolte.',
    icon: Heart,
  },
  {
    nom: 'La musique et les chants traditionnels',
    description: 'Les chants et rythmes Gouro accompagnent toutes les cérémonies. Les djembés, les balafons et les voix créent une ambiance mystique et festive propre au peuple Gouro de la Marahoué.',
    icon: Drum,
  },
]

export default function PatrimoinePage() {
  useSEO({
    title: 'Patrimoine & Culture',
    description: 'Découvrez le patrimoine culturel de Gohitafla : le Zaouli, les traditions Gouro, les villages et l\'histoire du peuple Gouro.',
    path: '/patrimoine',
  })

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 to-primary-500/70" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-16 md:py-24">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Patrimoine & Culture</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Patrimoine & Culture
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Découvrez la richesse culturelle de Gohitafla, terre du peuple Gouro, 
            ses villages, ses traditions ancestrales et la célèbre danse du Zaouli.
          </p>
        </div>
      </section>

      {/* Le Zaouli — Section principale */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-accent-50 text-accent-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                Patrimoine immatériel UNESCO
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-500 leading-tight">
                Le Zaouli, danse sacrée du peuple Gouro
              </h2>
              <p className="text-gray-600 mt-6 leading-relaxed text-lg">
                Le <strong>Zaouli</strong> est une danse traditionnelle emblématique du peuple 
                <strong> Gouro</strong> de la région de Gohitafla. Inscrite au patrimoine culturel 
                immatériel de l'UNESCO, c'est l'une des danses les plus spectaculaires d'Afrique de 
                l'Ouest, attirant des visiteurs du monde entier.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Cette danse, née dans les années 1950, s'inspire de la beauté d'une jeune fille nommée 
                <strong> Djela Lou Zaouli</strong>. Le danseur, portant un masque finement sculpté et 
                peint, exécute des mouvements de pieds d'une rapidité et d'une précision extraordinaires.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Le Zaouli est dansé lors des récoltes, des funérailles, des visites de dignitaires et 
                des célébrations communautaires. Il symbolise la beauté, la joie et l'unité du peuple Gouro.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
                <Sparkles size={32} className="mb-4" />
                <h3 className="font-heading font-bold text-2xl mb-3">Patrimoine UNESCO</h3>
                <p className="text-white/90 leading-relaxed">
                  Le Zaouli est inscrit au patrimoine culturel immatériel de l'UNESCO depuis 2017. 
                  Cette reconnaissance internationale témoigne de la richesse culturelle exceptionnelle 
                  du peuple Gouro et de la commune de Gohitafla.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-5 text-center">
                  <Calendar size={24} className="text-accent-500 mx-auto mb-2" />
                  <p className="font-heading font-bold text-gray-900">Toute l'année</p>
                  <p className="text-xs text-gray-500">Célébrations diverses</p>
                </div>
                <div className="card p-5 text-center">
                  <Users size={24} className="text-primary-500 mx-auto mb-2" />
                  <p className="font-heading font-bold text-gray-900">Peuple Gouro</p>
                  <p className="text-xs text-gray-500">Communauté gardienne</p>
                </div>
                <div className="card p-5 text-center">
                  <Landmark size={24} className="text-success-500 mx-auto mb-2" />
                  <p className="font-heading font-bold text-gray-900">UNESCO</p>
                  <p className="text-xs text-gray-500">Patrimoine mondial</p>
                </div>
                <div className="card p-5 text-center">
                  <Star size={24} className="text-amber-500 mx-auto mb-2" />
                  <p className="font-heading font-bold text-gray-900">International</p>
                  <p className="text-xs text-gray-500">Renommée mondiale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Déroulement du Zaouli */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Cérémonie
            </span>
            <h2 className="section-title">La danse du Zaouli</h2>
            <p className="section-subtitle mx-auto">
              Le Zaouli se déroule en plusieurs phases rituelles, chacune ayant une signification profonde.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 border-t-4 border-accent-500 hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-5">
                <Sun size={28} className="text-accent-500" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">La préparation</h3>
              <p className="text-gray-600 leading-relaxed">
                Le danseur se prépare dans un lieu sacré. Le masque du Zaouli, finement sculpté 
                dans le bois, est orné de peintures colorées représentant la beauté idéale. Le 
                costume en raphia et tissus est assemblé avec soin.
              </p>
            </div>
            <div className="card p-8 border-t-4 border-primary-500 hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5">
                <Sparkles size={28} className="text-primary-500" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">La danse</h3>
              <p className="text-gray-600 leading-relaxed">
                Au son des tambours et des chants, le danseur masqué entre en scène. Ses pieds 
                frappent le sol avec une rapidité stupéfiante tandis que son corps reste 
                étonnamment immobile. La foule l'encourage par des chants et des cris de joie.
              </p>
            </div>
            <div className="card p-8 border-t-4 border-success-500 hover:-translate-y-1">
              <div className="w-14 h-14 bg-success-50 rounded-2xl flex items-center justify-center mb-5">
                <Heart size={28} className="text-success-500" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">La célébration</h3>
              <p className="text-gray-600 leading-relaxed">
                Après la danse, la communauté se rassemble pour un grand festin. Le Zaouli 
                apporte bonheur et prospérité au village. C'est un moment de joie collective, 
                de partage et de renforcement des liens communautaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traditions et culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-accent-50 text-accent-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Traditions
            </span>
            <h2 className="section-title">Culture et traditions Gouro</h2>
            <p className="section-subtitle mx-auto">
              Le peuple Gouro de Gohitafla possède un patrimoine culturel d'une richesse exceptionnelle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {traditions.map((item, index) => (
              <div key={index} className="card p-6 flex gap-5 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                  <item.icon size={28} className="text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{item.nom}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le peuple Gouro */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
          <div className="absolute inset-0 bg-primary-500/90" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Le peuple Gouro
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Les Gouro sont un peuple Mandé du Sud installé dans la région de la Marahoué, au 
            centre-ouest de la Côte d'Ivoire. Réputés pour leur talent artistique exceptionnel, 
            notamment dans la sculpture de masques, ils constituent le socle culturel de la commune 
            de Gohitafla. Leur organisation sociale, basée sur les lignages et les classes d'âge, 
            témoigne d'une civilisation riche et structurée.
          </p>
          <p className="text-lg text-white/80 leading-relaxed mt-4">
            Les Gouro sont également reconnus pour leurs compétences agricoles, cultivant le cacao, 
            le café, le riz et les cultures vivrières. Leur hospitalité légendaire et leur attachement 
            aux traditions font d'eux les gardiens d'un patrimoine culturel inestimable.
          </p>
        </div>
      </section>

      {/* Villages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-success-50 text-success-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Géographie
            </span>
            <h2 className="section-title">Les villages de la commune</h2>
            <p className="section-subtitle mx-auto">
              La commune de Gohitafla est composée de plusieurs villages et localités, 
              chacun avec son identité et ses particularités.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {villages.map((village, index) => (
              <div key={index} className="card p-5 group hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center group-hover:bg-success-500 transition-colors">
                    <MapPin size={20} className="text-success-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900">{village.nom}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-500">{village.type}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{village.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star size={12} className="text-accent-400" />
                  {village.particularite}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            Venez découvrir Gohitafla !
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Assistez au Zaouli, explorez les villages et vivez l'hospitalité du peuple Gouro. 
            Gohitafla vous accueille à bras ouverts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white text-accent-600 font-bold rounded-lg hover:bg-gray-50 transition-all shadow-lg">
              Nous contacter
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/actualites" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
              Voir les événements
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
