import { useState, useEffect } from 'react'
import { Accessibility, Plus, Minus, Sun, Eye, X } from 'lucide-react'

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('a11y-font-size')
    const savedContrast = localStorage.getItem('a11y-high-contrast')
    if (saved) setFontSize(Number(saved))
    if (savedContrast === 'true') setHighContrast(true)
  }, [])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
    localStorage.setItem('a11y-font-size', String(fontSize))
  }, [fontSize])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('a11y-high-contrast', String(highContrast))
  }, [highContrast])

  const increase = () => setFontSize((p) => Math.min(p + 10, 150))
  const decrease = () => setFontSize((p) => Math.max(p - 10, 80))
  const reset = () => {
    setFontSize(100)
    setHighContrast(false)
  }

  return (
    <div className="fixed bottom-6 right-24 z-40">
      {open && (
        <div className="absolute bottom-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 w-64 mb-2 animate-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-gray-900">Accessibilité</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Taille du texte ({fontSize}%)</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrease}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Réduire le texte"
                >
                  <Minus size={14} />
                </button>
                <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${((fontSize - 80) / 70) * 100}%` }}
                  />
                </div>
                <button
                  onClick={increase}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Agrandir le texte"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-sm font-medium ${
                  highContrast
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye size={16} />
                Contraste élevé
                {highContrast && <span className="ml-auto text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">ON</span>}
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
            >
              Réinitialiser les paramètres
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Options d'accessibilité"
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          open
            ? 'bg-primary-600 text-white'
            : 'bg-white text-primary-500 hover:bg-primary-50 border border-gray-200'
        }`}
      >
        <Accessibility size={20} />
      </button>
    </div>
  )
}
