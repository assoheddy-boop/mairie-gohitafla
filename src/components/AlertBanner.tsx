import { useState, useEffect } from 'react'
import { AlertTriangle, X, Info, Bell } from 'lucide-react'
import { API } from '../utils/api'

interface Alert {
  id: number
  type: 'urgent' | 'info' | 'event'
  message: string
  active: number
}

const typeConfig = {
  urgent: { bg: 'bg-red-600', icon: AlertTriangle, label: 'URGENT' },
  info: { bg: 'bg-blue-600', icon: Info, label: 'INFO' },
  event: { bg: 'bg-accent-500', icon: Bell, label: 'ÉVÉNEMENT' },
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissed, setDismissed] = useState<number[]>(() => {
    const saved = sessionStorage.getItem('dismissed-alerts')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    fetch(`${API}/alertes?active=1`)
      .then(r => r.json())
      .then(setAlerts)
      .catch(() => {})
  }, [])

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a.id))

  const dismiss = (id: number) => {
    const updated = [...dismissed, id]
    setDismissed(updated)
    sessionStorage.setItem('dismissed-alerts', JSON.stringify(updated))
  }

  if (visibleAlerts.length === 0) return null

  return (
    <div className="relative z-50">
      {visibleAlerts.map((alert) => {
        const config = typeConfig[alert.type] || typeConfig.info
        const Icon = config.icon
        return (
          <div key={alert.id} className={`${config.bg} text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">{config.label}</span>
                  <p className="text-sm truncate">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismiss(alert.id)}
                  className="text-white/70 hover:text-white flex-shrink-0 transition-colors"
                  aria-label="Fermer l'alerte"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
