import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import Auth from './Auth.jsx'
import Dashboard from './dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
)
