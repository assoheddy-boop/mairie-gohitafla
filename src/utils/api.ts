export function getServerUrl(): string {
  if (import.meta.env.DEV) {
    return `http://${window.location.hostname}:3001`
  }
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) return apiUrl.replace(/\/$/, '')
  return window.location.origin
}

export const API_BASE = getServerUrl()
export const API = `${API_BASE}/api`
