import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'face-project-ui-styles'
// import App from './App.tsx'
import Chat from './pages/Chat'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Chat />
  </StrictMode>,
)
