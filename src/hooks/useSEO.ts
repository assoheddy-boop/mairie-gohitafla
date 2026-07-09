import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
}

const BASE_URL = 'https://mairie-gohitafla.ci'
const SITE_NAME = 'Mairie de Gohitafla'
const DEFAULT_IMAGE = '/mairie-gohitafla.png'

export default function useSEO({ title, description, path = '', image }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const url = `${BASE_URL}${path}`
    const img = image ? `${BASE_URL}${image}` : `${BASE_URL}${DEFAULT_IMAGE}`

    document.title = fullTitle

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    setMeta('description', description)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', description, true)
    setMeta('og:url', url, true)
    setMeta('og:image', img, true)
    setMeta('og:type', 'website', true)
    setMeta('og:site_name', SITE_NAME, true)
    setMeta('og:locale', 'fr_CI', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', img)

    return () => {
      document.title = SITE_NAME
    }
  }, [title, description, path, image])
}
