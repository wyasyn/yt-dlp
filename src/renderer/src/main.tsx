import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

// Global error handlers
window.addEventListener('error', (event: ErrorEvent): void => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent): void => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
