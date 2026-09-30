import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/main.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// У продакшні HTML уже пре-рендерений (scripts/prerender.mjs) — гідратуємо; у dev рендеримо з нуля
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
